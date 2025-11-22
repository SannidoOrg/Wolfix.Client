// src/types/review.ts

export interface AddProductReviewDto {
    title: string;
    text: string;
    rating: number;
    customerId: string;
}

// Добавляем типы для чтения отзывов согласно Swagger
export interface ProductReviewDto {
    id: string;
    title: string | null;
    text: string | null;
    rating: number;
    productId: string;
    createdAt: string; // date-time
    // Обратите внимание: Swagger не возвращает имя пользователя в этом DTO,
    // поэтому будем пока выводить просто "Користувач" или без имени.
}

export interface ProductReviewResponse {
    items: ProductReviewDto[];
    nextCursor: string | null;
}