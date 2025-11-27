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
    // --- Поля, требуемые API (CreateSellerApplicationDto) ---
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

    // --- Поля для UI (могут не уходить на бэк, если DTO строгий) ---
    email: string; // Только для отображения
    companyName: string;
    siteUrl: string;
    hasNoSite: boolean;
}

const SellerRegistrationForm = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<CategorySimpleDto[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<SellerApplicationFormValues>({
        defaultValues: {
            hasNoSite: false
        }
    });

    const hasNoSiteValue = watch("hasNoSite");

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
                    // Если есть ID профиля, пробуем достать детали
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
                        // Остальное сбрасываем
                        categoryId: "",
                        companyName: "",
                        siteUrl: "",
                        hasNoSite: false
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        };

        initData();
    }, [user, reset]);

    // Блокировка сайта при чекбоксе
    useEffect(() => {
        if (hasNoSiteValue) setValue("siteUrl", "");
    }, [hasNoSiteValue, setValue]);

    const onSubmit: SubmitHandler<SellerApplicationFormValues> = async (data) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // === 1. Обязательные поля для DTO ===
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            if (data.middleName) formData.append('middleName', data.middleName);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('birthDate', data.birthDate);

            formData.append('city', data.city);
            formData.append('street', data.street);
            formData.append('houseNumber', data.houseNumber.toString());
            if (data.apartmentNumber) formData.append('apartmentNumber', data.apartmentNumber.toString());

            formData.append('categoryId', data.categoryId);

            if (data.document && data.document[0]) {
                formData.append('document', data.document[0]);
            } else {
                alert("Необхідно завантажити документ!");
                setIsSubmitting(false);
                return;
            }

            // === 2. Дополнительные поля (отправляем, если бэкенд позволяет) ===
            formData.append('companyName', data.companyName);
            if (!data.hasNoSite && data.siteUrl) formData.append('siteUrl', data.siteUrl);

            // Отправка
            await api.post('/api/seller-applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert("Заявка успішно відправлена!");
            // Можно добавить редирект на главную или страницу успеха
        } catch (error: any) {
            console.error("Error submitting form:", error);
            alert(error.response?.data?.message || "Помилка при відправці заявки.");
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
                        </div>

                        <div className="form-group full-width">
                            <label>Назва магазину (Компанії) <span className="req">*</span></label>
                            <input
                                {...register("companyName", { required: "Введіть назву" })}
                                className={errors.companyName ? "error" : ""}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Посилання на сайт</label>
                            <div className="input-group">
                                <span className="prefix">https://</span>
                                <input
                                    {...register("siteUrl", { required: !hasNoSiteValue })}
                                    disabled={hasNoSiteValue}
                                    className={hasNoSiteValue ? "disabled" : ""}
                                />
                            </div>
                        </div>

                        <div className="checkbox-group full-width">
                            <input type="checkbox" id="noSite" {...register("hasNoSite")} />
                            <label htmlFor="noSite">У мене немає веб-сайту</label>
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