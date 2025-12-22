"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "../../../services/adminService";
import { SellerApplicationDto } from "../../../types/admin";
import "../../../styles/AdminDashboard.css";
import { useAuth } from "../../../contexts/AuthContext";

const AdminDashboardPage = () => {
    const [applications, setApplications] = useState<SellerApplicationDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    // Базовый URL для формирования ссылки на документ
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7168";

    useEffect(() => {
        // Защита роута: если загрузка завершена и пользователь не админ — редирект
        if (!authLoading) {
            if (!user || user.role !== "Admin") {
                router.push("/");
                return;
            }
            // Если права есть, грузим данные
            fetchApplications();
        }
    }, [user, authLoading, router]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllApplications();
            setApplications(data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch applications", err);
            setError("Не удалось загрузить заявки. Возможно, истек срок действия сессии.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Вы уверены, что хотите одобрить эту заявку?")) return;

        try {
            await adminService.approveApplication(id);
            setApplications((prev) => prev.filter((app) => app.id !== id));
            alert("Заявка успешно одобрена");
        } catch (err) {
            console.error(err);
            alert("Ошибка при одобрении заявки");
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Вы уверены, что хотите отклонить эту заявку?")) return;

        try {
            await adminService.rejectApplication(id);
            setApplications((prev) => prev.filter((app) => app.id !== id));
            alert("Заявка отклонена");
        } catch (err) {
            console.error(err);
            alert("Ошибка при отклонении заявки");
        }
    };

    const getDocumentLink = (url?: string) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.substring(1) : url;
        const cleanBase = API_URL.endsWith("/") ? API_URL.substring(0, API_URL.length - 1) : API_URL;
        return `${cleanBase}/${cleanPath}`;
    };

    if (authLoading || (loading && applications.length === 0)) {
        return <div className="loading-state">Загрузка...</div>;
    }

    return (
        <div className="admin-dashboard-container">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="admin-title" style={{ margin: 0 }}>Панель Администратора</h1>
                <button
                    onClick={logout}
                    className="btn"
                    style={{ backgroundColor: '#6b7280', color: 'white' }}
                >
                    Вийти
                </button>
            </div>

            {error && <div className="error-state">{error}</div>}

            {!error && applications.length === 0 ? (
                <div className="empty-state">
                    <p>На данный момент нет активных заявок.</p>
                </div>
            ) : (
                <div className="applications-list">
                    {applications.map((app) => {
                        const { fullName, address, phoneNumber, birthDate } = app.sellerProfileData || {};
                        const fullAddress = address
                            ? `${address.city || ""}, ${address.street || ""} ${address.houseNumber || ""}`
                            : "Адрес не указан";

                        const fullNameString = fullName
                            ? `${fullName.lastName || ""} ${fullName.firstName || ""} ${fullName.middleName || ""}`
                            : "Имя не указано";

                        const docLink = getDocumentLink(app.documentUrl);

                        return (
                            <div key={app.id} className="application-card">
                                <div className="app-header">
                                    <span className="applicant-name">{fullNameString}</span>
                                    <span className="category-badge">
                    Категория: {app.categoryName || "Не указана"}
                  </span>
                                </div>

                                <div className="app-details">
                                    <div className="detail-row">
                                        <strong>Телефон:</strong>
                                        {phoneNumber?.value || "Не указан"}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Дата рождения:</strong>
                                        {birthDate?.value ? new Date(birthDate.value).toLocaleDateString() : "Не указана"}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Адрес:</strong>
                                        {fullAddress}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Документ:</strong>
                                        {docLink ? (
                                            <a
                                                href={docLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="document-link"
                                            >
                                                Скачать / Просмотреть
                                            </a>
                                        ) : (
                                            <span style={{ color: "#999" }}>Нет документа</span>
                                        )}
                                    </div>
                                </div>

                                <div className="app-actions">
                                    <button
                                        className="btn btn-reject"
                                        onClick={() => handleReject(app.id)}
                                    >
                                        Отклонить
                                    </button>
                                    <button
                                        className="btn btn-approve"
                                        onClick={() => handleApprove(app.id)}
                                    >
                                        Одобрить
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;