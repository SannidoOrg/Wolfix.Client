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

    categoryId: string;
    document: FileList;

    // Поля только для UI
    email: string;
}

const SellerRegistrationForm = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<CategorySimpleDto[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<SellerApplicationFormValues>();

    // Инициализация данных
    useEffect(() => {
        const initData = async () => {
            try {
                // 1. Загружаем категории
                const catRes = await api.get<CategorySimpleDto[]>('/api/categories/parent');
                if (catRes.data) setCategories(catRes.data);

                // 2. Подставляем данные пользователя
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

                    // Форматируем дату
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
                        categoryId: "", // Категорию пользователь должен выбрать сам
                        houseNumber: profileData.address?.houseNumber,
                        apartmentNumber: profileData.address?.apartmentNumber
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        };

        initData();
    }, [user, reset]);

    const onSubmit: SubmitHandler<SellerApplicationFormValues> = async (data) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // === Обязательные поля ===
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            if (data.middleName) formData.append('middleName', data.middleName);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('birthDate', data.birthDate);

            formData.append('city', data.city);
            formData.append('street', data.street);
            formData.append('houseNumber', data.houseNumber.toString());
            if (data.apartmentNumber) formData.append('apartmentNumber', data.apartmentNumber.toString());

            // === Логика Категории ===
            // Отправляем ID
            formData.append('categoryId', data.categoryId);

            // Находим и отправляем Название категории (сервер ожидает categoryName)
            const selectedCategory = categories.find(c => c.id === data.categoryId);
            if (selectedCategory) {
                formData.append('categoryName', selectedCategory.name);
            } else {
                // На всякий случай, если что-то пошло не так
                console.warn("Category name not found for ID:", data.categoryId);
            }

            // === Документ ===
            if (data.document && data.document[0]) {
                formData.append('document', data.document[0]);
            } else {
                alert("Необхідно завантажити документ!");
                setIsSubmitting(false);
                return;
            }

            // Отправка
            const endpoint = user?.accountId
                ? `/api/seller-applications/${user.accountId}`
                : '/api/seller-applications';

            await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert("Заявка успішно відправлена!");
            // Можно добавить сброс формы или редирект
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

                {/* Секция 1: Личные данные */}
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

                {/* Секция 2: Адрес */}
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

                {/* Секция 3: Магазин */}
                <div className="form-section">
                    <h3 className="section-title">Інформація про магазин</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Категорія товарів <span className="req">*</span></label>
                            <select
                                {...register("categoryId", { required: "Оберіть категорію" })}
                                className={errors.categoryId ? "error" : ""}
                            >
                                <option value="">Оберіть категорію...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="error-msg">{errors.categoryId.message}</span>}
                        </div>
                    </div>
                </div>

                {/* Секция 4: Документы */}
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