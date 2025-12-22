"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { superAdminService } from "../../../services/superAdminService";
import "../../../styles/AdminDashboard.css"; // Переиспользуем стили админа для консистентности

type SuperTab = "addAdmin" | "createSupport";

const SuperAdminDashboardPage = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SuperTab>("addAdmin");

    // Form State
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: ""
    });

    useEffect(() => {
        if (!authLoading) {
            // Проверка роли: предполагаем, что роль называется "SuperAdmin"
            // Если в вашей системе это просто Admin с флагом, измените условие.
            // Судя по контексту задачи, это отдельная роль.
            if (!user || user.role !== "SuperAdmin") {
                router.push("/");
            }
        }
    }, [user, authLoading, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === "addAdmin") {
                await superAdminService.addAdmin(formData);
                alert("Администратор успешно создан");
            } else {
                // Для Support не нужен телефон в DTO (согласно swagger CreateSupportDto),
                // но форма одна. Мы просто передадим нужные поля.
                const { phoneNumber, ...supportData } = formData;
                await superAdminService.createSupport(supportData);
                alert("Аккаунт техподдержки успешно создан");
            }
            // Reset form
            setFormData({
                email: "", password: "", firstName: "", lastName: "", middleName: "", phoneNumber: ""
            });
        } catch (error) {
            console.error(error);
            alert("Ошибка при создании пользователя. Проверьте данные.");
        }
    };

    if (authLoading) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="admin-dashboard-container">
            <header className="dashboard-header" style={{ borderColor: '#7c3aed' }}>
                <h1 style={{ color: '#7c3aed' }}>Панель Супер-Администратора</h1>
                <button onClick={logout} className="btn logout-btn">Выйти</button>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'addAdmin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addAdmin')}
                >
                    Добавить Администратора
                </button>
                <button
                    className={`tab-btn ${activeTab === 'createSupport' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createSupport')}
                >
                    Создать Техподдержку
                </button>
            </div>

            <div className="dashboard-content">
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2>
                        {activeTab === 'addAdmin' ? 'Новый Администратор' : 'Новый сотрудник Поддержки'}
                    </h2>
                    <form onSubmit={handleSubmit} className="super-admin-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Имя</label>
                            <input name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Фамилия</label>
                            <input name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Отчество</label>
                            <input name="middleName" value={formData.middleName} onChange={handleInputChange} />
                        </div>

                        {activeTab === 'addAdmin' && (
                            <div className="form-group">
                                <label>Телефон</label>
                                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                            Создать
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboardPage;