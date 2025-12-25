"use client";

import { FC, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import api from "@/lib/api";
import "../../../styles/SupportModal.css";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// Статический список категорий на основе твоего Enum
const SUPPORT_CATEGORIES = [
    { value: "GeneralQuestion", label: "Загальні питання" },
    { value: "OrderIssue", label: "Проблема із замовленням" },
    { value: "TechSupport", label: "Технічна підтримка / Помилка сайту" },
    { value: "Refund", label: "Повернення коштів" },
    { value: "Other", label: "Інше" }
];

const SupportModal: FC<SupportModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const { showNotification } = useGlobalContext();

    // По дефолту выбираем первую категорию или пустую строку, если хочешь заставить выбрать
    const [category, setCategory] = useState(SUPPORT_CATEGORIES[0].value);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.customerId) {
            showNotification("Помилка: Ви не авторизовані. Будь ласка, увійдіть.", "error");
            return;
        }

        if (!content.trim()) {
            showNotification("Будь ласка, опишіть вашу проблему.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            // Отправляем POST запрос
            // Убедись, что путь совпадает с твоим бекендом (обычно /api/support-requests)
            await api.post("api/support-requests", {
                customerId: user.customerId,
                category: category, // Отправляем строку (например, "OrderIssue")
                content: content
            });

            showNotification("Заявку успішно відправлено! Ми зв'яжемося з вами.", "success");

            // Сброс формы
            setCategory(SUPPORT_CATEGORIES[0].value);
            setContent("");

            if (onSuccess) onSuccess();
            onClose();
        } catch (error: unknown) {
            console.error("Support request error:", error);
            showNotification("Щось пішло не так. Спробуйте пізніше.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="support-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="support-modal-content">
                <button className="support-modal-close" onClick={onClose}>&times;</button>

                <h2 className="support-modal-title">Підтримка</h2>
                <p className="support-subtitle">Оберіть категорію та опишіть проблему</p>

                <form className="support-form" onSubmit={handleSubmit}>
                    <div className="support-form-group">
                        <label htmlFor="support-category">Категорія звернення</label>
                        <select
                            id="support-category"
                            className="support-input" // Используем тот же класс стиля, что и для input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {SUPPORT_CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="support-form-group">
                        <label htmlFor="support-content">Деталі проблеми</label>
                        <textarea
                            id="support-content"
                            className="support-textarea"
                            placeholder="Опишіть ситуацію детально..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="support-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Відправка..." : "Відправити запит"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportModal;