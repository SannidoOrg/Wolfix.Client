"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { CategorySimpleDto } from "@/types/seller";
import "../../../styles/BecomeSeller.css";

// Тип формы повторяет DTO
type SellerFormInput = {
    firstName: string;
    lastName: string;
    middleName: string;
    phoneNumber: string;
    city: string;
    street: string;
    houseNumber: string;
    apartmentNumber: string;
    birthDate: string;
    categoryId: string;
    document: FileList;
};

export default function BecomeSellerPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState<CategorySimpleDto[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm<SellerFormInput>();

    // Для отображения имени выбранного файла
    const selectedFile = watch("document");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<CategorySimpleDto[]>("/api/categories/parent");
                setCategories(response.data);
            } catch (error) {
                console.error("Не вдалося завантажити категорії", error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const onSubmit: SubmitHandler<SellerFormInput> = async (data) => {
        if (!user?.id) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Персональные данные
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            if (data.middleName) formData.append("middleName", data.middleName);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("birthDate", data.birthDate);

            // Адрес
            formData.append("city", data.city);
            formData.append("street", data.street);
            formData.append("houseNumber", data.houseNumber);
            if (data.apartmentNumber) formData.append("apartmentNumber", data.apartmentNumber);

            // Категория
            formData.append("categoryId", data.categoryId);

            // Файл документа
            if (data.document && data.document.length > 0) {
                formData.append("document", data.document[0]);
            } else {
                setError("document", { type: "required", message: "Документ обов'язковий" });
                setIsSubmitting(false);
                return;
            }

            // Отправка
            await api.post(`/api/seller-applications/${user.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Заявка успішно надіслана!");
            router.push("/profile");

        } catch (error: any) {
            console.error("Помилка при створенні заявки", error);
            const msg = error.response?.data || "Сталася помилка.";
            alert(`Помилка: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="seller-container">
            <div className="seller-header">
                <h1 className="seller-title">Стати продавцем</h1>
                <span className="seller-subtitle">Заповніть форму та завантажте документи для верифікації</span>
            </div>

            <div className="seller-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Секция 1: Особисті дані */}
                    <div className="form-section-title">Особисті дані</div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Ім'я *</label>
                            <input
                                {...register("firstName", { required: "Введіть ім'я" })}
                                className="form-input"
                                placeholder="Іван"
                            />
                            {errors.firstName && <span className="error-msg">{errors.firstName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Прізвище *</label>
                            <input
                                {...register("lastName", { required: "Введіть прізвище" })}
                                className="form-input"
                                placeholder="Петренко"
                            />
                            {errors.lastName && <span className="error-msg">{errors.lastName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">По батькові</label>
                            <input
                                {...register("middleName")}
                                className="form-input"
                                placeholder="Іванович"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Телефон *</label>
                            <input
                                {...register("phoneNumber", { required: "Введіть телефон" })}
                                className="form-input"
                                placeholder="+380..."
                            />
                            {errors.phoneNumber && <span className="error-msg">{errors.phoneNumber.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Дата народження *</label>
                            <input
                                type="date"
                                {...register("birthDate", { required: "Оберіть дату" })}
                                className="form-input"
                            />
                            {errors.birthDate && <span className="error-msg">{errors.birthDate.message}</span>}
                        </div>
                    </div>

                    {/* Секция 2: Адреса */}
                    <div className="form-section-title">Адреса бізнесу</div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Місто *</label>
                            <input
                                {...register("city", { required: "Введіть місто" })}
                                className="form-input"
                                placeholder="Київ"
                            />
                            {errors.city && <span className="error-msg">{errors.city.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Вулиця *</label>
                            <input
                                {...register("street", { required: "Введіть вулицю" })}
                                className="form-input"
                                placeholder="Хрещатик"
                            />
                            {errors.street && <span className="error-msg">{errors.street.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Номер будинку *</label>
                            <input
                                type="number"
                                {...register("houseNumber", { required: "Введіть номер", min: 1 })}
                                className="form-input"
                                placeholder="10"
                            />
                            {errors.houseNumber && <span className="error-msg">{errors.houseNumber.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Квартира / Офіс</label>
                            <input
                                type="number"
                                {...register("apartmentNumber")}
                                className="form-input"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    {/* Секция 3: Деталі магазину */}
                    <div className="form-section-title">Деталі магазину</div>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Категорія товарів *</label>
                            <select
                                {...register("categoryId", { required: "Оберіть категорію" })}
                                className="form-select"
                                disabled={loadingCategories}
                            >
                                <option value="">-- Оберіть основну категорію --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="error-msg">{errors.categoryId.message}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Документи (Паспорт/ФОП) *</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="document-upload"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    {...register("document", { required: "Завантажте документ" })}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="document-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                    <span className="file-upload-icon">📄</span>
                                    <div className="file-upload-text">
                                        {selectedFile && selectedFile.length > 0 ? (
                                            <strong style={{ color: '#FF6B00' }}>{selectedFile[0].name}</strong>
                                        ) : (
                                            <strong>Натисніть, щоб завантажити файл</strong>
                                        )}
                                        <p>PDF, JPG або PNG (макс. 5MB)</p>
                                    </div>
                                </label>
                            </div>
                            {errors.document && <span className="error-msg">{errors.document.message}</span>}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Обробка..." : "Відправити заявку"}
                    </button>
                </form>
            </div>
        </div>
    );
}