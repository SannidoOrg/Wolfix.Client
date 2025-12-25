"use client";

import { FC, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import "../../../styles/SupportModal.css"; // Используем те же стили, что и у юзера

interface SupportRequest {
    id: string;
    category: string;
    requestContent: string;
}

interface SupportResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: SupportRequest;
    onSuccess: () => void;
}

const SupportResponseModal: FC<SupportResponseModalProps> = ({ isOpen, onClose, request, onSuccess }) => {
    const { user } = useAuth();
    const { showNotification } = useGlobalContext();
    const [responseContent, setResponseContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!responseContent.trim()) {
            showNotification("Введіть текст відповіді", "error");
            return;
        }

        // Пытаемся достать ID. Обычно это accountId или userId из токена.
        const supportId = user?.accountId || user?.userId || user?.id;

        if (!supportId) {
            showNotification("Помилка: Не знайдено ID адміністратора/сапорта.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            // PATCH /api/support-requests/{requestId}/supports/{supportId}/respond
            await api.patch(
                `/api/support-requests/${request.id}/supports/${supportId}/respond`,
                {
                    content: responseContent
                }
            );

            showNotification("Відповідь успішно надіслано!", "success");
            setResponseContent(""); // Чистим поле
            onSuccess(); // Обновляем список в родительском компоненте
            onClose();   // Закрываем модалку
        } catch (error: unknown) {
            console.error("Error responding to ticket:", error);
            showNotification("Не вдалося відправити відповідь. Спробуйте пізніше.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="support-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="support-modal-content">
                <button className="support-modal-close" onClick={onClose}>&times;</button>

                <h3 className="support-modal-title">Відповідь на запит</h3>

                {/* Блок с оригинальным сообщением юзера, чтобы видеть на что отвечаем */}
                <div style={{
                    backgroundColor: '#f9f9f9',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    borderLeft: '4px solid #FF6B00'
                }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                        Категорія: {request.category}
                    </div>
                    <p style={{ margin: 0, color: '#333', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                        {request.requestContent}
                    </p>
                </div>

                <form className="support-form" onSubmit={handleSubmit}>
                    <div className="support-form-group">
                        <label>Ваша відповідь</label>
                        <textarea
                            className="support-textarea"
                            value={responseContent}
                            onChange={(e) => setResponseContent(e.target.value)}
                            placeholder="Доброго дня, дякуємо за звернення..."
                            style={{ minHeight: '120px' }}
                            required
                        />
                    </div>

                    <button type="submit" className="support-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Відправка..." : "Відправити відповідь"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportResponseModal;