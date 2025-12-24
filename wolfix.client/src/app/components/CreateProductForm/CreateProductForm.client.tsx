"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import "../../../styles/CreateProductForm.css";

// --- Типы данных ---

interface SellerCategoryDto {
    id: string;         // ID записи связи
    categoryId: string; // Реальный ID категории
    name: string;
}

interface AttributeDto {
    id: string;
    key: string;
}

// Статусы товара (Enum в модели)
type ProductStatus = "InStock" | "NotAvailable";

interface CreateProductFormValues {
    title: string;
    description: string;
    price: number;
    status: ProductStatus;
    categoryId: string;
    media: FileList;
    attributes: Record<string, string>;
}

const CreateProductForm = () => {
    const { user } = useAuth();

    // Справочники
    const [sellerCategories, setSellerCategories] = useState<SellerCategoryDto[]>([]);
    const [categoryAttributes, setCategoryAttributes] = useState<AttributeDto[]>([]);

    // Состояния
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<CreateProductFormValues>({
        defaultValues: {
            status: "InStock" // Значение по умолчанию
        }
    });

    const selectedCategoryId = watch("categoryId");
    const selectedFiles = watch("media");

    // Получаем ID продавца из профиля
    const sellerId = user?.profileId || user?.customerId;

    // 1. Загрузка категорий ПРОДАВЦА
    useEffect(() => {
        if (!sellerId) return;

        setIsLoadingCategories(true);
        api.get<SellerCategoryDto[]>(`/api/sellers/${sellerId}/categories`)
            .then(res => setSellerCategories(res.data || []))
            .catch(err => console.error("Помилка завантаження категорій", err))
            .finally(() => setIsLoadingCategories(false));
    }, [sellerId]);

    // 2. Загрузка атрибутов при выборе категории
    useEffect(() => {
        if (!selectedCategoryId) {
            setCategoryAttributes([]);
            return;
        }

        setIsLoadingAttributes(true);
        api.get<AttributeDto[]>(`/api/categories/child/${selectedCategoryId}/attributes`)
            .then(res => setCategoryAttributes(res.data || []))
            .finally(() => setIsLoadingAttributes(false));
    }, [selectedCategoryId]);

    // 3. Превью фото
    useEffect(() => {
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [selectedFiles]);

    const onSubmit: SubmitHandler<CreateProductFormValues> = async (data) => {
        if (!sellerId) {
            alert("Помилка: не знайдено ID продавця.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Основные поля DTO
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());

            // Передаем статус (Enum строкой)
            formData.append("status", data.status);

            formData.append("categoryId", data.categoryId);
            formData.append("sellerId", sellerId);

            // Статическое значение ContentType
            formData.append("contentType", "Photo");

            // Обработка медиа
            if (data.media && data.media[0]) {
                formData.append("media", data.media[0]);
            } else {
                alert("Будь ласка, додайте фото товару");
                setIsSubmitting(false);
                return;
            }

            // Формирование JSON для атрибутов
            // Swagger AddProductDto требует поле "attributesJson"
            const attributesArray = categoryAttributes.map(attr => ({
                id: attr.id, // ID атрибута (из справочника)
                value: data.attributes?.[attr.id] || ""
            })).filter(a => a.value.trim() !== "");

            formData.append("attributesJson", JSON.stringify(attributesArray));

            await api.post("/api/products", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Товар успішно створено!");
            reset();
            setPreviewUrl(null);
            setCategoryAttributes([]);
            window.location.reload();
        } catch (error: any) {
            console.error("Error creating product:", error);
            const msg = error.response?.data?.message || "Помилка при створенні товару";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="create-product-form">

            {/* Основная информация */}
            <div className="form-section">
                <h3 className="section-title">Основна інформація</h3>

                <div className="form-group">
                    <label>Назва товару <span className="req">*</span></label>
                    <input
                        className="form-input"
                        placeholder="Наприклад: Смартфон iPhone 15"
                        {...register("title", { required: "Введіть назву" })}
                    />
                    {errors.title && <span className="error-text">{errors.title.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label>Ціна (₴) <span className="req">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            placeholder="0.00"
                            {...register("price", { required: "Введіть ціну", min: 1 })}
                        />
                    </div>

                    {/* Поле выбора статуса */}
                    <div className="form-group">
                        <label>Статус наявності <span className="req">*</span></label>
                        <select
                            className="form-input"
                            {...register("status", { required: "Оберіть статус" })}
                        >
                            <option value="InStock">У наявності</option>
                            <option value="NotAvailable">Немає у наявності</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Опис</label>
                    <textarea
                        className="form-input textarea"
                        rows={4}
                        placeholder="Детальний опис товару..."
                        {...register("description", { required: "Додайте опис" })}
                    />
                </div>
            </div>

            {/* Категория и Характеристики */}
            <div className="form-section">
                <h3 className="section-title">Категорія та характеристики</h3>

                <div className="form-group">
                    <label>Категорія товару <span className="req">*</span></label>
                    <select
                        className="form-input"
                        disabled={isLoadingCategories}
                        {...register("categoryId", { required: "Оберіть категорію" })}
                    >
                        <option value="">
                            {isLoadingCategories ? "Завантаження списку..." : "-- Оберіть категорію --"}
                        </option>
                        {sellerCategories.map(c => (
                            <option key={c.id} value={c.categoryId}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <span className="error-text">{errors.categoryId.message}</span>}
                    {sellerCategories.length === 0 && !isLoadingCategories && (
                        <p className="text-xs text-gray-500 mt-1">У вас ще немає доступних категорій.</p>
                    )}
                </div>

                {categoryAttributes.length > 0 && (
                    <div className="attributes-grid mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-semibold mb-3 text-gray-700">Характеристики:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryAttributes.map(attr => (
                                <div key={attr.id} className="form-group">
                                    <label className="text-xs text-gray-500 mb-1">{attr.key}</label>
                                    <input
                                        type="text"
                                        className="form-input-sm"
                                        placeholder={`Введіть ${attr.key.toLowerCase()}`}
                                        {...register(`attributes.${attr.id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isLoadingAttributes && <p className="text-sm text-gray-500 mt-2">Завантаження характеристик...</p>}
            </div>

            {/* Фото */}
            <div className="form-section">
                <h3 className="section-title">Фото товару</h3>
                <div className="media-upload-area">
                    {previewUrl ? (
                        <div className="image-preview relative">
                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain rounded" />
                            <button
                                type="button"
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                                onClick={() => {
                                    setValue("media", null as any);
                                    setPreviewUrl(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <input
                                type="file"
                                accept="image/*"
                                className="file-input-hidden"
                                id="product-photo"
                                {...register("media", { required: "Фото обов'язкове" })}
                            />
                            <label htmlFor="product-photo" className="upload-btn-label">
                                <span className="text-2xl">📷</span>
                                <span className="text-sm mt-2 font-medium text-orange-500">Завантажити фото</span>
                            </label>
                        </div>
                    )}
                    {errors.media && <span className="error-text mt-2 block">{errors.media.message}</span>}
                </div>
            </div>

            <div className="form-actions pt-4">
                <button
                    type="submit"
                    className="submit-product-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Створення..." : "Створити товар"}
                </button>
            </div>
        </form>
    );
};

export default CreateProductForm;