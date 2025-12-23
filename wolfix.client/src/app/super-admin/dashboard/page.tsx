"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { superAdminService } from "../../../services/superAdminService";
import { BasicAdminDto, SupportForAdminDto, SellerForAdminDto, PaginationResult } from "../../../types/admin";
import "../../../styles/Dashboard.css";

type SuperTab = "admins" | "support" | "sellers";

const SuperAdminDashboardPage = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SuperTab>("admins");
    const [isLoadingList, setIsLoadingList] = useState(false);

    // Data
    const [adminsData, setAdminsData] = useState<PaginationResult<BasicAdminDto> | null>(null);
    const [adminsPage, setAdminsPage] = useState(1);
    const [supportsData, setSupportsData] = useState<PaginationResult<SupportForAdminDto> | null>(null);
    const [supportsPage, setSupportsPage] = useState(1);
    const [sellersData, setSellersData] = useState<PaginationResult<SellerForAdminDto> | null>(null);
    const [sellersPage, setSellersPage] = useState(1);

    // Forms
    // Admin DTO: email, password, firstName, lastName, middleName, phoneNumber
    const [adminForm, setAdminForm] = useState({
        email: "", password: "", firstName: "", lastName: "", middleName: "", phoneNumber: ""
    });

    // Support DTO: email, password, firstName, lastName, middleName
    const [supportForm, setSupportForm] = useState({
        email: "", password: "", firstName: "", lastName: "", middleName: ""
    });

    // Fetchers
    const fetchAdmins = useCallback(async (page: number) => {
        setIsLoadingList(true);
        try {
            const data = await superAdminService.getAdminsPage(page, 10);
            setAdminsData(data);
        } catch(e){console.error(e);}
        finally {setIsLoadingList(false);}
    }, []);

    const fetchSupports = useCallback(async (page: number) => {
        setIsLoadingList(true);
        try {
            const data = await superAdminService.getSupportsPage(page, 10);
            setSupportsData(data);
        } catch(e){console.error(e);}
        finally {setIsLoadingList(false);}
    }, []);

    const fetchSellers = useCallback(async (page: number) => {
        setIsLoadingList(true);
        try {
            const data = await superAdminService.getSellersPage(page, 10);
            setSellersData(data);
        } catch(e){console.error(e);}
        finally {setIsLoadingList(false);}
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

    // Handlers
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await superAdminService.addAdmin(adminForm);
            alert("Администратор создан");
            setAdminForm({email:"", password:"", firstName:"", lastName:"", middleName:"", phoneNumber:""});
            fetchAdmins(adminsPage);
        } catch(e){alert("Ошибка при создании");}
    };

    const handleCreateSupport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await superAdminService.createSupport(supportForm);
            alert("Сотрудник поддержки создан");
            setSupportForm({email:"", password:"", firstName:"", lastName:"", middleName:""});
            fetchSupports(supportsPage);
        } catch(e){alert("Ошибка при создании");}
    };

    const handleDeleteAdmin = async (id: string) => {
        if(confirm("Удалить администратора?")) {
            await superAdminService.deleteAdmin(id);
            fetchAdmins(adminsPage);
        }
    };

    const handleDeleteSupport = async (id: string) => {
        if(confirm("Удалить сотрудника поддержки?")) {
            await superAdminService.deleteSupport(id);
            fetchSupports(supportsPage);
        }
    };

    const handleDeleteSeller = async (id: string) => {
        if(confirm("Удалить продавца?")) {
            await superAdminService.deleteSeller(id);
            fetchSellers(sellersPage);
        }
    };

    const PaginationControls = ({ page, totalPages, setPage }: any) => {
        if (!totalPages || totalPages <= 1) return null;
        return (
            <div style={{display:'flex', justifyContent:'center', gap:'10px', marginTop:'20px'}}>
                <button className="btn" disabled={page<=1} onClick={() => setPage(page-1)}>Назад</button>
                <span style={{alignSelf:'center'}}>{page} / {totalPages}</span>
                <button className="btn" disabled={page>=totalPages} onClick={() => setPage(page+1)}>Вперед</button>
            </div>
        );
    };

    if (authLoading) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Панель Супер-Админа</h1>
                <button onClick={logout} className="btn logout-btn">Выйти</button>
            </header>

            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')}>Админы</button>
                <button className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>Поддержка</button>
                <button className={`tab-btn ${activeTab === 'sellers' ? 'active' : ''}`} onClick={() => setActiveTab('sellers')}>Продавцы</button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'admins' && (
                    <div className="two-col-layout">
                        <div className="list-column">
                            <h3>Список Админов</h3>
                            {isLoadingList && <p>Загрузка...</p>}
                            <ul className="item-list">
                                {adminsData?.items?.map(a => (
                                    <li key={a.id}>
                                        <span>{a.firstName} {a.lastName}</span>
                                        <button className="btn btn-reject" style={{padding:'5px 10px'}} onClick={() => handleDeleteAdmin(a.id)}>Del</button>
                                    </li>
                                ))}
                            </ul>
                            <PaginationControls page={adminsPage} totalPages={adminsData?.totalPages} setPage={setAdminsPage} />
                        </div>
                        <div className="form-column">
                            <h3>Создать Админа</h3>
                            <form onSubmit={handleCreateAdmin} className="super-admin-form">
                                <input value={adminForm.email} onChange={e => setAdminForm({...adminForm, email:e.target.value})} placeholder="Email" required />
                                <input value={adminForm.password} onChange={e => setAdminForm({...adminForm, password:e.target.value})} type="password" placeholder="Пароль" required />
                                <input value={adminForm.firstName} onChange={e => setAdminForm({...adminForm, firstName:e.target.value})} placeholder="Имя" />
                                <input value={adminForm.lastName} onChange={e => setAdminForm({...adminForm, lastName:e.target.value})} placeholder="Фамилия" />
                                <input value={adminForm.middleName} onChange={e => setAdminForm({...adminForm, middleName:e.target.value})} placeholder="Отчество" />
                                <input value={adminForm.phoneNumber} onChange={e => setAdminForm({...adminForm, phoneNumber:e.target.value})} placeholder="Телефон" />
                                <button className="btn btn-primary" style={{width:'100%'}}>Создать</button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'support' && (
                    <div className="two-col-layout">
                        <div className="list-column">
                            <h3>Сотрудники Поддержки</h3>
                            <ul className="item-list">
                                {supportsData?.items?.map(s => (
                                    <li key={s.id}>
                                        <span>{s.firstName} {s.lastName}</span>
                                        <button className="btn btn-reject" style={{padding:'5px 10px'}} onClick={() => handleDeleteSupport(s.id)}>Del</button>
                                    </li>
                                ))}
                            </ul>
                            <PaginationControls page={supportsPage} totalPages={supportsData?.totalPages} setPage={setSupportsPage} />
                        </div>
                        <div className="form-column">
                            <h3>Создать Саппорт</h3>
                            <form onSubmit={handleCreateSupport} className="super-admin-form">
                                <input value={supportForm.email} onChange={e => setSupportForm({...supportForm, email:e.target.value})} placeholder="Email" required />
                                <input value={supportForm.password} onChange={e => setSupportForm({...supportForm, password:e.target.value})} type="password" placeholder="Пароль" required />
                                <input value={supportForm.firstName} onChange={e => setSupportForm({...supportForm, firstName:e.target.value})} placeholder="Имя" />
                                <input value={supportForm.lastName} onChange={e => setSupportForm({...supportForm, lastName:e.target.value})} placeholder="Фамилия" />
                                <input value={supportForm.middleName} onChange={e => setSupportForm({...supportForm, middleName:e.target.value})} placeholder="Отчество" />
                                <button className="btn btn-primary" style={{width:'100%'}}>Создать</button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'sellers' && (
                    <div className="full-width-list">
                        <h3>Список Продавцов</h3>
                        <div className="sellers-grid">
                            {sellersData?.items?.map(s => (
                                <div key={s.id} className="seller-card">
                                    <h4>{s.fullName?.firstName} {s.fullName?.lastName}</h4>
                                    <p style={{fontSize:'0.9rem', color:'#666'}}>{s.phoneNumber}</p>
                                    <button className="btn btn-reject" style={{width:'100%', marginTop:'10px'}} onClick={() => handleDeleteSeller(s.id)}>Удалить</button>
                                </div>
                            ))}
                        </div>
                        <PaginationControls page={sellersPage} totalPages={sellersData?.totalPages} setPage={setSellersPage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboardPage;