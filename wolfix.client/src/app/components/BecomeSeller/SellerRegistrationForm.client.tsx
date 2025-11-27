"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import '../../../styles/SellerRegistration.css';

// Типы
interface CategorySimpleDto {
    id: string;
    name: string;
}

interface SellerApplicationFormValues {
    // Данные формы
    firstName: string;
    lastName: string;
    middleName: string;
    phoneNumber: string;
    birthDate: string; // YYYY-MM-DD

    city: string;
    street: string;
    houseNumber: number;
    apartmentNumber?: number;

    categoryId: string; // ID конечной подкатегории
    document: FileList;

    // Поля только для UI
    email: string;
}

const SellerRegistrationForm = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Стейты для категорий
    const [parentCategories, setParentCategories] = useState<CategorySimpleDto[]>([]);
    const [childCategories, setChildCategories] = useState<CategorySimpleDto[]>([]);
    const [selectedParentId, setSelectedParentId] = useState<string>("");
    const [isLoadingChildren, setIsLoadingChildren] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue, // Нужно для сброса значения подкатегории
        formState: { errors }
    } = useForm<SellerApplicationFormValues>();

    // 1. Инициализация данных (Родительские категории + Профиль)
    useEffect(() => {
        const initData = async () => {
            try {
                // Загружаем РОДИТЕЛЬСКИЕ категории
                const catRes = await api.get<CategorySimpleDto[]>('/api/categories/parent');
                if (catRes.data) setParentCategories(catRes.data);

                // Подставляем данные пользователя
                if (user) {
                    const targetId = user.customerId || user.profileId || user.accountId;
                    let profileData: any = {};

                    if (targetId) {
                        try {
                            const pRes = await api.get(`/api/customers/${targetId}`);
                            profileData = pRes.data;
                        } catch (e) {
                            console.warn("Профиль не загружен, используем данные из токена");
                        }
                    }

                    let formattedDate = "";
                    if (profileData.birthDate) {
                        formattedDate = new Date(profileData.birthDate).toISOString().split('T')[0];
                    }

                    reset({
                        firstName: profileData.fullName?.firstName || user.firstName || "",
                        lastName: profileData.fullName?.lastName || user.lastName || "",
                        middleName: profileData.fullName?.middleName || user.middleName || "",
                        phoneNumber: profileData.phoneNumber || user.phoneNumber || "",
                        email: user.email || "",
                        birthDate: formattedDate,
                        city: profileData.address?.city || "",
                        street: profileData.address?.street || "",
                        houseNumber: profileData.address?.houseNumber,
                        apartmentNumber: profileData.address?.apartmentNumber,
                        categoryId: ""
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        };

        initData();
    }, [user, reset]);

    // 2. Эффект для загрузки ДОЧЕРНИХ категорий при выборе родителя
    useEffect(() => {
        const fetchChildCategories = async () => {
            if (!selectedParentId) {
                setChildCategories([]);
                return;
            }

            setIsLoadingChildren(true);
            try {
                const res = await api.get<CategorySimpleDto[]>(`/api/categories/child/${selectedParentId}`);
                setChildCategories(res.data || []);
            } catch (error) {
                console.error("Ошибка загрузки подкатегорий:", error);
                setChildCategories([]);
            } finally {
                setIsLoadingChildren(false);
            }
        };

        fetchChildCategories();
    }, [selectedParentId]);

    // Обработчик выбора родительской категории
    const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newParentId = e.target.value;
        setSelectedParentId(newParentId);

        // Сбрасываем выбранную подкатегорию, так как список изменится
        setValue("categoryId", "");
    };

    const onSubmit: SubmitHandler<SellerApplicationFormValues> = async (data) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            if (data.middleName) formData.append('middleName', data.middleName);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('birthDate', data.birthDate);

            formData.append('city', data.city);
            formData.append('street', data.street);
            formData.append('houseNumber', data.houseNumber.toString());
            if (data.apartmentNumber) formData.append('apartmentNumber', data.apartmentNumber.toString());

            // Отправляем ID выбранной ПОДКАТЕГОРИИ
            formData.append('categoryId', data.categoryId);

            // Находим название подкатегории для categoryName
            const selectedCategory = childCategories.find(c => c.id === data.categoryId);
            if (selectedCategory) {
                formData.append('categoryName', selectedCategory.name);
            }

            if (data.document && data.document[0]) {
                formData.append('document', data.document[0]);
            } else {
                alert("Необхідно завантажити документ!");
                setIsSubmitting(false);
                return;
            }

            const endpoint = user?.accountId
                ? `/api/seller-applications/${user.accountId}`
                : '/api/seller-applications';

            await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert("Заявка успішно відправлена!");
        } catch (error: any) {
            console.error("Error submitting form:", error);
            const msg = error.response?.data?.message || error.response?.data || "Помилка при відправці заявки.";
            alert(typeof msg === 'string' ? msg : "Сталася помилка");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="seller-registration-wrapper">
            <div className="registration-header">
                <h1 className="reg-title">Стати продавцем</h1>
                <p className="reg-subtitle">Заповніть форму, щоб почати продавати на Wolfix</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="registration-form">

                {/* --- 1. Особисті дані --- */}
                <div className="form-section">
                    <h3 className="section-title">Особисті дані</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Прізвище <span className="req">*</span></label>
                            <input
                                {...register("lastName", { required: "Обов'язкове поле" })}
                                className={errors.lastName ? "error" : ""}
                                placeholder="Іванов"
                            />
                            {errors.lastName && <span className="error-msg">{errors.lastName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>Ім'я <span className="req">*</span></label>
                            <input
                                {...register("firstName", { required: "Обов'язкове поле" })}
                                className={errors.firstName ? "error" : ""}
                                placeholder="Іван"
                            />
                            {errors.firstName && <span className="error-msg">{errors.firstName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>По батькові</label>
                            <input {...register("middleName")} placeholder="Іванович" />
                        </div>

                        <div className="form-group">
                            <label>Дата народження <span className="req">*</span></label>
                            <input
                                type="date"
                                {...register("birthDate", { required: "Вкажіть дату" })}
                                className={errors.birthDate ? "error" : ""}
                            />
                            {errors.birthDate && <span className="error-msg">{errors.birthDate.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>Телефон <span className="req">*</span></label>
                            <input
                                type="tel"
                                {...register("phoneNumber", { required: "Обов'язкове поле" })}
                                className={errors.phoneNumber ? "error" : ""}
                                placeholder="+380..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input {...register("email")} readOnly className="readonly-input" />
                        </div>
                    </div>
                </div>

                {/* --- 2. Адреса --- */}
                <div className="form-section">
                    <h3 className="section-title">Адреса проживання</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Місто / Населений пункт <span className="req">*</span></label>
                            <input
                                {...register("city", { required: "Вкажіть місто" })}
                                className={errors.city ? "error" : ""}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Вулиця <span className="req">*</span></label>
                            <input
                                {...register("street", { required: "Вкажіть вулицю" })}
                                className={errors.street ? "error" : ""}
                            />
                        </div>

                        <div className="form-group">
                            <label>Будинок <span className="req">*</span></label>
                            <input
                                type="number"
                                {...register("houseNumber", { required: "Вкажіть номер", valueAsNumber: true })}
                                className={errors.houseNumber ? "error" : ""}
                            />
                        </div>

                        <div className="form-group">
                            <label>Квартира</label>
                            <input
                                type="number"
                                {...register("apartmentNumber", { valueAsNumber: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* --- 3. Магазин (Категории) --- */}
                <div className="form-section">
                    <h3 className="section-title">Інформація про магазин</h3>
                    <div className="form-grid">

                        {/* Выбор Родительской Категории */}
                        <div className="form-group">
                            <label>Оберіть категорію <span className="req">*</span></label>
                            <select
                                value={selectedParentId}
                                onChange={handleParentCategoryChange}
                                className={!selectedParentId ? "" : "border-orange-500"} // Пример стилизации
                            >
                                <option value="">-- Категорія --</option>
                                {parentCategories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Выбор Подкатегории (основное поле формы) */}
                        <div className="form-group">
                            <label>Оберіть підкатегорію <span className="req">*</span></label>
                            <select
                                {...register("categoryId", { required: "Оберіть підкатегорію" })}
                                className={errors.categoryId ? "error" : ""}
                                disabled={!selectedParentId || isLoadingChildren}
                            >
                                <option value="">
                                    {isLoadingChildren ? "Завантаження..." : "-- Підкатегорія --"}
                                </option>
                                {childCategories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="error-msg">{errors.categoryId.message}</span>}
                        </div>

                    </div>
                </div>

                {/* --- 4. Документы --- */}
                <div className="form-section">
                    <h3 className="section-title">Документи</h3>
                    <div className="file-upload-area">
                        <p className="upload-label">Завантажте скан паспорта або ID-картки <span className="req">*</span></p>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            {...register("document", { required: "Завантажте файл" })}
                            className="file-input"
                        />
                        {errors.document && <span className="error-msg">Файл обов'язковий</span>}
                        <p className="upload-hint">Формати: JPG, PNG, PDF. Макс. 5 МБ</p>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Обробка..." : "Надіслати заявку"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerRegistrationForm;