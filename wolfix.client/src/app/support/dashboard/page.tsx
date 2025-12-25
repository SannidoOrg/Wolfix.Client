"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import api from "@/lib/api";
import SupportResponseModal from "@/app/components/SupportResponseModal/SupportResponseModal.client";
import "../../../styles/SupportDashboard.css";

// Текст для категорий
const CATEGORY_LABELS: Record<string, string> = {
    GeneralQuestion: "Загальні питання",
    OrderIssue: "Проблема із замовленням",
    TechSupport: "Технічна підтримка",
    Refund: "Повернення коштів",
    Other: "Інше"
};

// Цвета для бейджиков
const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Refund': return { bg: '#fee2e2', text: '#991b1b' }; // Красный
        case 'TechSupport': return { bg: '#e0f2fe', text: '#075985' }; // Синий
        case 'OrderIssue': return { bg: '#ffedd5', text: '#9a3412' }; // Оранжевый
        default: return { bg: '#f3f4f6', text: '#374151' }; // Серый
    }
};

interface SupportRequest {
    id: string;
    category: string;
    requestContent: string;
    createdAt: string;
}

export default function SupportDashboardPage() {
    const { user } = useAuth(); // Убрали isLoading, так как его нет в типе
    const { showNotification } = useGlobalContext();
    const router = useRouter();

    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true); // Локальный лоадер данных
    const [filterCategory, setFilterCategory] = useState("All");

    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

    // 1. Загрузка данных
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/support-requests");
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to load support requests:", error);
            showNotification("Не вдалося завантажити звернення", "error");
        } finally {
            setLoading(false);
        }
    };

    // 2. Проверка доступа и первичная загрузка
    useEffect(() => {
        if (user) {
            // Простейшая проверка роли (адаптируй под свои названия ролей: "Admin", "Support")
            const hasAccess = user.role === "Support" || user.role === "Admin" || user.role === "Seller";

            if (!hasAccess) {
                // Если чужак — редиректим (раскомментируй для защиты)
                // router.push("/");
            } else {
                fetchRequests();
            }
        }
    }, [user]);

    // 3. Действия
    const handleOpenResponse = (req: SupportRequest) => {
        setSelectedRequest(req);
        setIsResponseModalOpen(true);
    };

    const handleSuccessResponse = () => {
        fetchRequests();
    };

    const handleCancelRequest = async (requestId: string) => {
        if (!confirm("Видалити це звернення?")) return;

        // Берем ID из user. Подставь правильное поле (accountId, userId или id)
        const supportId = user?.accountId || user?.userId;

        try {
            await api.patch(`/api/support-requests/${requestId}/supports/${supportId}/cancel`);
            showNotification("Звернення видалено", "success");
            fetchRequests();
        } catch (error) {
            console.error(error);
            showNotification("Помилка видалення", "error");
        }
    };

    // 4. Фильтрация
    const filteredRequests = requests.filter(req => {
        if (filterCategory === "All") return true;
        return req.category === filterCategory;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("uk-UA", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    // Если юзер еще не подгрузился, показываем заглушку
    if (!user) {
        return <div className="dashboard-loading">Завантаження доступу...</div>;
    }

    return (
        <div className="support-dashboard-wrapper">
            <header className="dashboard-header">
                <div className="header-title-group">
                    <h1>Панель підтримки</h1>
                    <span className="badge-count">{filteredRequests.length}</span>
                </div>

                <div className="header-actions">
                    <select
                        className="category-filter-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">Всі категорії</option>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    <button className="refresh-btn" onClick={fetchRequests} disabled={loading} title="Оновити">
                        🔄
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                {loading ? (
                    <div className="loading-state">Завантаження тікетів...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="empty-state">
                        <p>Звернень немає ☕</p>
                    </div>
                ) : (
                    <div className="tickets-grid">
                        <div className="tickets-header-row">
                            <span>Дата</span>
                            <span>Категорія</span>
                            <span>Суть звернення</span>
                            <span>Дії</span>
                        </div>

                        {filteredRequests.map((req) => {
                            const style = getCategoryColor(req.category);
                            return (
                                <div key={req.id} className="ticket-card">
                                    <div className="ticket-date">
                                        <span className="mobile-label">Дата:</span>
                                        {formatDate(req.createdAt)}
                                    </div>
                                    <div className="ticket-category">
                                        <span className="mobile-label">Категорія:</span>
                                        <span
                                            className="category-badge"
                                            style={{ backgroundColor: style.bg, color: style.text }}
                                        >
                                            {CATEGORY_LABELS[req.category] || req.category}
                                        </span>
                                    </div>
                                    <div className="ticket-content">
                                        <span className="mobile-label">Зміст:</span>
                                        <p>{req.requestContent}</p>
                                    </div>
                                    <div className="ticket-actions">
                                        <button
                                            className="btn-respond"
                                            onClick={() => handleOpenResponse(req)}
                                        >
                                            Відповісти
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={() => handleCancelRequest(req.id)}
                                            title="Видалити"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Модалка для ответа */}
            {selectedRequest && (
                <SupportResponseModal
                    isOpen={isResponseModalOpen}
                    onClose={() => setIsResponseModalOpen(false)}
                    request={selectedRequest}
                    onSuccess={handleSuccessResponse}
                />
            )}
        </div>
    );
}