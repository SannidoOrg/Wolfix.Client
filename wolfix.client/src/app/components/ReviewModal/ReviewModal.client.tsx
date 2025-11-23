"use client";

import { FC, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import api from "@/lib/api";
import "../../../styles/ReviewModal.css";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productTitle: string;
    onSuccess: () => void; // Коллбек для обновления списка отзывов
}

const ReviewModal: FC<ReviewModalProps> = ({ isOpen, onClose, productId, productTitle, onSuccess }) => {
    const { user } = useAuth();
    const { showNotification } = useGlobalContext();

    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.customerId) {
            showNotification("Помилка: Не знайдено ID користувача. Спробуйте переувійти.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            // Согласно Swagger: AddProductReviewDto { title, text, rating, customerId }
            await api.post(`/api/products/${productId}/reviews`, {
                title: title || null, // Заголовок опционален
                text: text,           // Текст отзыва
                rating: rating,
                customerId: user.customerId
            });

            showNotification("Дякуємо! Ваш відгук успішно додано.", "success");
            onSuccess(); // Обновляем список

            // Сброс формы
            setTitle("");
            setText("");
            setRating(5);
            onClose();
        } catch (error: any) {
            console.error(error);
            showNotification("Не вдалося додати відгук. Спробуйте пізніше.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Функция для рендера звезд
    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="star-input-label">
                <input
                    type="radio"
                    name="rating"
                    value={star}
                    style={{ display: "none" }}
                    onClick={() => setRating(star)}
                />
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill={star <= rating ? "#FF6B00" : "#E0E0E0"}
                    xmlns="http://www.w3.org/2000/svg"
                    className="star-icon-large"
                >
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
            </label>
        ));
    };

    return (
        <div className="review-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="review-modal-content">
                <button className="review-modal-close" onClick={onClose}>&times;</button>

                <h2 className="review-modal-title">Відгук про товар</h2>
                <p className="review-product-name">{productTitle}</p>

                <div className="star-rating-input">
                    {renderStars()}
                </div>

                <form className="review-form" onSubmit={handleSubmit}>
                    <div className="review-form-group">
                        <label htmlFor="review-title">Заголовок</label>
                        <input
                            id="review-title"
                            type="text"
                            className="review-input"
                            placeholder="Коротке враження..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="review-form-group">
                        <label htmlFor="review-text">Ваш відгук*</label>
                        <textarea
                            id="review-text"
                            className="review-textarea"
                            placeholder="Розкажіть детальніше про товар..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="review-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Відправка..." : "Залишити відгук"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;