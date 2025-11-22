// src/app/components/BrandCard/BrandCard.client.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import "../../../styles/BrandCard.css";

export interface IBrandCardProps {
    parentId: string; // ID родительской категории (для навигации)
    childId: string;  // ID этой категории (бренда)
    brandName: string;
    imageUrl: string | null;
}

interface Variant {
    key: string;
    value: string; // Используем value как отображаемое имя (по Swagger может отличаться, уточним по факту)
}

const BrandCardClient: FC<IBrandCardProps> = ({ parentId, childId, brandName, imageUrl }) => {
    const router = useRouter();
    const [variants, setVariants] = useState<string[]>([]);

    // Подгружаем варианты (модели) для этого бренда
    useEffect(() => {
        const fetchVariants = async () => {
            try {
                // Согласно Swagger: GET /api/categories/child/{childCategoryId}/attributes
                // Или variants. В Swagger есть /variants, но POST/DELETE.
                // Обычно список вариантов для фильтра приходит в атрибутах.
                // Для демо пока оставим пустым или реализуем, если бэкенд отдает список моделей отдельным GET.
                // ПРЕДПОЛОЖЕНИЕ: Пока бэкенд не дает GET variants, список будет пустым, чтобы не ломать UI 404 ошибками.
                // Если появится эндпоинт GET .../variants, раскомментируйте код ниже:

                /*
                const response = await api.get(`/api/categories/child/${childId}/variants`);
                setVariants(response.data.map((v: any) => v.value || v.key));
                */
            } catch (error) {
                console.error(`Error fetching variants for ${brandName}`, error);
            }
        };

        fetchVariants();
    }, [childId, brandName]);

    const handleBrandClick = () => {
        // Переход на страницу товаров этого бренда
        router.push(`/categories/${parentId}/${childId}`);
    };

    return (
        <div className="brand-card" onClick={handleBrandClick}>
            <div className="brand-card-image-container">
                <img
                    src={imageUrl || "/placeholder.png"}
                    alt={brandName}
                    className="brand-card-image"
                    // Добавляем onError чтобы скрыть битые картинки
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.png"; // Убедитесь что этот файл есть или уберите onError
                        target.style.display = 'none'; // Или скрываем
                    }}
                />
            </div>
            <h2 className="brand-card-title">{brandName}</h2>

            {variants.length > 0 && (
                <>
                    <div className="brand-card-divider"></div>
                    <div className="model-list">
                        {variants.slice(0, 5).map((model, index) => (
                            <div key={index} className="model-item-text">{model}</div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BrandCardClient;