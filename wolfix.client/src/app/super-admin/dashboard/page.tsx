"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { superAdminService } from "../../../services/superAdminService";
import {
    BasicAdminDto,
    SupportForAdminDto,
    SellerForAdminDto,
    PaginationResult
} from "../../../types/admin";
import "../../../styles/AdminDashboard.css";

type SuperTab = "admins" | "support" | "sellers";

const SuperAdminDashboardPage = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SuperTab>("admins");

    // --- State: Pagination & Data ---
    // Admins
    const [adminsData, setAdminsData] = useState<PaginationResult<BasicAdminDto> | null>(null);
    const [adminsPage, setAdminsPage] = useState(1);

    // Supports
    const [supportsData, setSupportsData] = useState<PaginationResult<SupportForAdminDto> | null>(null);
    const [supportsPage, setSupportsPage] = useState(1);

    // Sellers
    const [sellersData, setSellersData] = useState<PaginationResult<SellerForAdminDto> | null>(null);
    const [sellersPage, setSellersPage] = useState(1);

    const [isLoadingList, setIsLoadingList] = useState(false);
    const pageSize = 10;

    // --- State: Forms ---
    const [adminForm, setAdminForm] = useState({
        email: "", password: "", firstName: "", lastName: "", middleName: "", phoneNumber: ""
    });
    const [supportForm, setSupportForm] = useState({
        email: "", password: "", firstName: "", lastName: "", middleName: ""
    });

    const fetchAdmins = useCallback(async (page: number) => {
        setIsLoadingList(true);
        try {
            const data = await superAdminService.getAdminsPage(page, pageSize);
            setAdminsData(data);
        } catch (e) { console.error("Failed to fetch admins", e); }
        finally { setIsLoadingList(false); }
    }, []);

    const fetchSupports = useCallback(async (page: number) => {
        setIsLoadingList(true);
        try {
            const data = await superAdminService.getSupportsPage(page, pageSize);
            setSupportsData(data);
        } catch (e) { console.error("Failed to fetch supports", e); }
        finally { setIsLoadingList(false); }
    }, []);

    const fetchSellers = useCallback(async (page: number) => {
        setIsLoadingList(true);
        try {
            const data = await superAdminService.getSellersPage(page, pageSize);
            setSellersData(data);
        } catch (e) { console.error("Failed to fetch sellers", e); }
        finally { setIsLoadingList(false); }
    }, []);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "SuperAdmin") {
                router.push("/");
            } else {
                if (activeTab === "admins") fetchAdmins(adminsPage);
                if (activeTab === "support") fetchSupports(supportsPage);
                if (activeTab === "sellers") fetchSellers(sellersPage);
            }
        }
    }, [user, authLoading, router, activeTab, adminsPage, supportsPage, sellersPage, fetchAdmins, fetchSupports, fetchSellers]);

    // --- Handlers: Create ---
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await superAdminService.addAdmin(adminForm);
            alert("Администратор создан");
            setAdminForm({ email: "", password: "", firstName: "", lastName: "", middleName: "", phoneNumber: "" });
            fetchAdmins(adminsPage); // Refresh list
        } catch (e) { alert("Ошибка при создании администратора"); }
    };

    const handleCreateSupport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await superAdminService.createSupport(supportForm);
            alert("Сотрудник поддержки создан");
            setSupportForm({ email: "", password: "", firstName: "", lastName: "", middleName: "" });
            fetchSupports(supportsPage); // Refresh list
        } catch (e) { alert("Ошибка при создании сотрудника поддержки"); }
    };

    // --- Handlers: Delete ---
    const handleDeleteSupport = async (id: string) => {
        if (!confirm("Удалить сотрудника поддержки?")) return;
        try {
            await superAdminService.deleteSupport(id);
            fetchSupports(supportsPage);
        } catch (e) { alert("Ошибка при удалении"); }
    };

    const handleDeleteSeller = async (id: string) => {
        if (!confirm("Удалить продавца? Все его товары будут удалены.")) return;
        try {
            await superAdminService.deleteSeller(id);
            fetchSellers(sellersPage);
        } catch (e) { alert("Ошибка при удалении"); }
    };

    // --- Helpers ---
    const getFullName = (fName?: string, lName?: string, mName?: string) => {
        return `${fName || ''} ${lName || ''} ${mName || ''}`.trim() || "Без имени";
    };

    // Pagination Controls Component
    const PaginationControls = ({
                                    page,
                                    totalPages,
                                    setPage
                                }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
        if (totalPages <= 1) return null;
        return (
            <div className="pagination-controls" style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn">Назад</button>
                <span style={{ alignSelf: 'center' }}>Страница {page} из {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn">Вперед</button>
            </div>
        );
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
                    className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admins')}
                >
                    Администраторы
                </button>
                <button
                    className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
                    onClick={() => setActiveTab('support')}
                >
                    Техподдержка
                </button>
                <button
                    className={`tab-btn ${activeTab === 'sellers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sellers')}
                >
                    Продавцы
                </button>
            </div>

            <div className="dashboard-content">

                {/* --- Tab: Admins --- */}
                {activeTab === 'admins' && (
                    <div className="two-col-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="list-column">
                            <h3>Список Администраторов</h3>
                            {isLoadingList && <p>Загрузка...</p>}
                            <ul className="item-list" style={{ listStyle: 'none', padding: 0 }}>
                                {adminsData?.items?.map(admin => (
                                    <li key={admin.id} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                                        <strong>{getFullName(admin.firstName, admin.lastName, admin.middleName)}</strong>
                                        <div style={{ fontSize: '0.9em', color: '#666' }}>{admin.phoneNumber || "Нет телефона"}</div>
                                    </li>
                                ))}
                            </ul>
                            {adminsData && (
                                <PaginationControls
                                    page={adminsPage}
                                    totalPages={adminsData.totalPages}
                                    setPage={setAdminsPage}
                                />
                            )}
                        </div>

                        <div className="form-column">
                            <div className="form-card">
                                <h3>Добавить Администратора</h3>
                                <form onSubmit={handleCreateAdmin} className="super-admin-form">
                                    <input placeholder="Email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} required />
                                    <input placeholder="Пароль" type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} required />
                                    <input placeholder="Имя" value={adminForm.firstName} onChange={e => setAdminForm({...adminForm, firstName: e.target.value})} />
                                    <input placeholder="Фамилия" value={adminForm.lastName} onChange={e => setAdminForm({...adminForm, lastName: e.target.value})} />
                                    <input placeholder="Отчество" value={adminForm.middleName} onChange={e => setAdminForm({...adminForm, middleName: e.target.value})} />
                                    <input placeholder="Телефон" value={adminForm.phoneNumber} onChange={e => setAdminForm({...adminForm, phoneNumber: e.target.value})} />
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}>Создать</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Tab: Support --- */}
                {activeTab === 'support' && (
                    <div className="two-col-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="list-column">
                            <h3>Сотрудники Поддержки</h3>
                            {isLoadingList && <p>Загрузка...</p>}
                            <ul className="item-list" style={{ listStyle: 'none', padding: 0 }}>
                                {supportsData?.items?.map(s => (
                                    <li key={s.id} style={{ borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{getFullName(s.firstName, s.lastName, s.middleName)}</strong>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteSupport(s.id)}
                                            className="btn btn-reject"
                                            style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                        >
                                            Удалить
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {supportsData && (
                                <PaginationControls
                                    page={supportsPage}
                                    totalPages={supportsData.totalPages}
                                    setPage={setSupportsPage}
                                />
                            )}
                        </div>

                        <div className="form-column">
                            <div className="form-card">
                                <h3>Создать сотрудника</h3>
                                <form onSubmit={handleCreateSupport} className="super-admin-form">
                                    <input placeholder="Email" value={supportForm.email} onChange={e => setSupportForm({...supportForm, email: e.target.value})} required />
                                    <input placeholder="Пароль" type="password" value={supportForm.password} onChange={e => setSupportForm({...supportForm, password: e.target.value})} required />
                                    <input placeholder="Имя" value={supportForm.firstName} onChange={e => setSupportForm({...supportForm, firstName: e.target.value})} />
                                    <input placeholder="Фамилия" value={supportForm.lastName} onChange={e => setSupportForm({...supportForm, lastName: e.target.value})} />
                                    <input placeholder="Отчество" value={supportForm.middleName} onChange={e => setSupportForm({...supportForm, middleName: e.target.value})} />
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}>Создать</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Tab: Sellers --- */}
                {activeTab === 'sellers' && (
                    <div className="full-width-list">
                        <h3>Список Продавцов</h3>
                        <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
                            Внимание: удаление продавца приведет к удалению его товаров.
                        </p>
                        {isLoadingList && <p>Загрузка...</p>}

                        <div className="sellers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                            {sellersData?.items?.map(s => (
                                <div key={s.id} className="seller-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        {s.photoUrl && <img src={s.photoUrl} alt="avatar" style={{width: 40, height: 40, borderRadius: '50%', objectFit: 'cover'}} />}
                                        <h4>{s.fullName ? getFullName(s.fullName.firstName, s.fullName.lastName, s.fullName.middleName) : "Продавец"}</h4>
                                    </div>
                                    <p><strong>Тел:</strong> {s.phoneNumber || "Не указан"}</p>
                                    <p><strong>Адрес:</strong> {s.address ? `${s.address.city || ''}, ${s.address.street || ''}` : "Не указан"}</p>
                                    <p><strong>Категории:</strong> {s.categories?.join(", ") || "Нет"}</p>

                                    <button
                                        onClick={() => handleDeleteSeller(s.id)}
                                        className="btn btn-reject"
                                        style={{ marginTop: '10px', width: '100%' }}
                                    >
                                        Удалить Продавца
                                    </button>
                                </div>
                            ))}
                        </div>

                        {sellersData && (
                            <PaginationControls
                                page={sellersPage}
                                totalPages={sellersData.totalPages}
                                setPage={setSellersPage}
                            />
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SuperAdminDashboardPage;