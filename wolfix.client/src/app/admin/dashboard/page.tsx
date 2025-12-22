"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "../../../services/adminService";
import {
    SellerApplicationDto,
    ParentCategoryDto,
    ChildCategoryDto,
    CategoryAttributeDto
} from "../../../types/admin";
import "../../../styles/AdminDashboard.css";
import { useAuth } from "../../../contexts/AuthContext";

type Tab = "applications" | "categories";

const AdminDashboardPage = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("categories");

    // --- State: Applications ---
    const [applications, setApplications] = useState<SellerApplicationDto[]>([]);
    const [appsLoading, setAppsLoading] = useState(false);

    // --- State: Categories ---
    const [parents, setParents] = useState<ParentCategoryDto[]>([]);
    const [selectedParent, setSelectedParent] = useState<ParentCategoryDto | null>(null);
    const [children, setChildren] = useState<ChildCategoryDto[]>([]);
    const [selectedChild, setSelectedChild] = useState<ChildCategoryDto | null>(null);
    const [attributes, setAttributes] = useState<CategoryAttributeDto[]>([]);

    // Loading states for categories
    const [loadingParents, setLoadingParents] = useState(false);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const [loadingAttrs, setLoadingAttrs] = useState(false);

    // --- Forms State (Categories) ---
    const [newParentName, setNewParentName] = useState("");
    const [newParentDesc, setNewParentDesc] = useState("");
    const [newParentPhoto, setNewParentPhoto] = useState<File | null>(null);

    const [newChildName, setNewChildName] = useState("");
    const [newChildDesc, setNewChildDesc] = useState("");
    const [newChildPhoto, setNewChildPhoto] = useState<File | null>(null);
    // Для простоты вводим ключи через запятую
    const [newChildAttrKeys, setNewChildAttrKeys] = useState("");
    const [newChildVarKeys, setNewChildVarKeys] = useState("");

    const [newAttrKey, setNewAttrKey] = useState("");
    const [newVarKey, setNewVarKey] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7168";

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "Admin") {
                router.push("/");
                return;
            }
            fetchInitialData();
        }
    }, [user, authLoading, router]);

    const fetchInitialData = () => {
        fetchApplications();
        fetchParents();
    };

    // --- Logic: Applications ---
    const fetchApplications = async () => {
        try {
            setAppsLoading(true);
            const data = await adminService.getAllApplications();
            setApplications(data);
        } catch (e) {
            console.error(e);
        } finally {
            setAppsLoading(false);
        }
    };

    const handleApproveApp = async (id: string) => {
        if (!confirm("Одобрить заявку?")) return;
        try {
            await adminService.approveApplication(id);
            setApplications(prev => prev.filter(app => app.id !== id));
        } catch (e) { alert("Ошибка при одобрении"); }
    };

    const handleRejectApp = async (id: string) => {
        if (!confirm("Отклонить заявку?")) return;
        try {
            await adminService.rejectApplication(id);
            setApplications(prev => prev.filter(app => app.id !== id));
        } catch (e) { alert("Ошибка при отклонении"); }
    };

    const getDocumentLink = (url?: string) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.substring(1) : url;
        const cleanBase = API_URL.endsWith("/") ? API_URL.substring(0, API_URL.length - 1) : API_URL;
        return `${cleanBase}/${cleanPath}`;
    };

    // --- Logic: Categories ---
    const fetchParents = async () => {
        setLoadingParents(true);
        try {
            const data = await adminService.getAllParentCategories();
            setParents(data);
        } catch (e) { console.error(e); }
        finally { setLoadingParents(false); }
    };

    const handleParentClick = async (parent: ParentCategoryDto) => {
        setSelectedParent(parent);
        setSelectedChild(null);
        setAttributes([]);
        setLoadingChildren(true);
        try {
            const data = await adminService.getChildCategoriesByParent(parent.id);
            setChildren(data);
        } catch (e) { console.error(e); }
        finally { setLoadingChildren(false); }
    };

    const handleChildClick = async (child: ChildCategoryDto) => {
        setSelectedChild(child);
        setLoadingAttrs(true);
        try {
            const attrs = await adminService.getAttributesByChildCategory(child.id);
            setAttributes(attrs);
        } catch (e) { console.error(e); }
        finally { setLoadingAttrs(false); }
    };

    // CRUD Parent
    const handleAddParent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.addParentCategory({
                name: newParentName,
                description: newParentDesc,
                photo: newParentPhoto
            });
            setNewParentName(""); setNewParentDesc(""); setNewParentPhoto(null);
            fetchParents();
            alert("Родительская категория добавлена");
        } catch (e) { alert("Ошибка добавления"); }
    };

    const handleDeleteParent = async (id: string) => {
        if (!confirm("Удалить категорию? Это удалит и дочерние элементы.")) return;
        try {
            await adminService.deleteCategory(id);
            fetchParents();
            if (selectedParent?.id === id) {
                setSelectedParent(null);
                setChildren([]);
            }
        } catch (e) { alert("Ошибка удаления"); }
    };

    // CRUD Child
    const handleAddChild = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedParent) return;
        try {
            await adminService.addChildCategory(selectedParent.id, {
                name: newChildName,
                description: newChildDesc,
                photo: newChildPhoto,
                attributeKeys: newChildAttrKeys.split(",").map(s => s.trim()).filter(Boolean),
                variantKeys: newChildVarKeys.split(",").map(s => s.trim()).filter(Boolean)
            });
            setNewChildName(""); setNewChildDesc(""); setNewChildPhoto(null);
            setNewChildAttrKeys(""); setNewChildVarKeys("");
            handleParentClick(selectedParent); // refresh children
            alert("Дочерняя категория добавлена");
        } catch (e) { alert("Ошибка добавления"); }
    };

    const handleChangeChild = async (child: ChildCategoryDto) => {
        const newName = prompt("Новое имя:", child.name);
        if (newName === null) return;
        try {
            await adminService.changeChildCategory(child.id, { name: newName });
            if (selectedParent) handleParentClick(selectedParent);
        } catch (e) { alert("Ошибка изменения"); }
    };

    // CRUD Attributes & Variants
    const handleAddAttribute = async () => {
        if (!selectedChild || !newAttrKey) return;
        try {
            await adminService.addAttributeToChildCategory(selectedChild.id, { key: newAttrKey });
            setNewAttrKey("");
            handleChildClick(selectedChild);
        } catch (e) { alert("Ошибка добавления атрибута"); }
    };

    const handleDeleteAttribute = async (attrId: string) => {
        if (!selectedChild) return;
        if (!confirm("Удалить атрибут?")) return;
        try {
            await adminService.deleteAttribute(selectedChild.id, attrId);
            handleChildClick(selectedChild);
        } catch (e) { alert("Ошибка удаления атрибута"); }
    };

    const handleAddVariant = async () => {
        if (!selectedChild || !newVarKey) return;
        try {
            await adminService.addVariantToChildCategory(selectedChild.id, { key: newVarKey });
            setNewVarKey("");
            alert("Вариант добавлен");
        } catch (e) { alert("Ошибка добавления варианта"); }
    };

    // Render Helpers
    if (authLoading) return <div className="loading-state">Проверка прав...</div>;

    return (
        <div className="admin-dashboard-container">
            <header className="dashboard-header">
                <h1>Панель Администратора</h1>
                <button onClick={logout} className="btn logout-btn">Выйти</button>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Управление Категориями
                </button>
                <button
                    className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Заявки Продавцов
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'applications' && (
                    <div className="applications-section">
                        {appsLoading && <p>Загрузка заявок...</p>}
                        {!appsLoading && applications.length === 0 && <p>Нет активных заявок.</p>}
                        <div className="applications-list">
                            {applications.map(app => (
                                <div key={app.id} className="application-card">
                                    <h3>{app.sellerProfileData?.fullName?.firstName} {app.sellerProfileData?.fullName?.lastName}</h3>
                                    <p>Категория: {app.categoryName}</p>
                                    <p>Телефон: {app.sellerProfileData?.phoneNumber?.value}</p>
                                    {app.documentUrl && (
                                        <a href={getDocumentLink(app.documentUrl) || '#'} target="_blank" rel="noreferrer">
                                            Смотреть документ
                                        </a>
                                    )}
                                    <div className="app-actions">
                                        <button className="btn btn-approve" onClick={() => handleApproveApp(app.id)}>Одобрить</button>
                                        <button className="btn btn-reject" onClick={() => handleRejectApp(app.id)}>Отклонить</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="categories-grid">
                        {/* Column 1: Parent Categories */}
                        <div className="col-parent">
                            <h3>Родительские категории</h3>
                            <div className="category-list">
                                {loadingParents ? <p>Загрузка...</p> : parents.map(p => (
                                    <div
                                        key={p.id}
                                        className={`category-item ${selectedParent?.id === p.id ? 'selected' : ''}`}
                                        onClick={() => handleParentClick(p)}
                                    >
                                        <span>{p.name}</span>
                                        <button className="btn-icon-del" onClick={(e) => { e.stopPropagation(); handleDeleteParent(p.id); }}>×</button>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleAddParent} className="add-form">
                                <input placeholder="Название" value={newParentName} onChange={e => setNewParentName(e.target.value)} required />
                                <input placeholder="Описание" value={newParentDesc} onChange={e => setNewParentDesc(e.target.value)} />
                                <input type="file" onChange={e => setNewParentPhoto(e.target.files?.[0] || null)} />
                                <button type="submit">Добавить Родителя</button>
                            </form>
                        </div>

                        {/* Column 2: Child Categories */}
                        <div className="col-child">
                            <h3>Дочерние категории</h3>
                            {!selectedParent ? <p className="hint">Выберите родителя</p> : (
                                <>
                                    <div className="category-list">
                                        {loadingChildren ? <p>Загрузка...</p> : children.map(c => (
                                            <div
                                                key={c.id}
                                                className={`category-item ${selectedChild?.id === c.id ? 'selected' : ''}`}
                                                onClick={() => handleChildClick(c)}
                                            >
                                                <span>{c.name}</span>
                                                <div className="item-actions">
                                                    <button onClick={(e) => { e.stopPropagation(); handleChangeChild(c); }}>✎</button>
                                                    {/* Удаление ребенка требует отдельного эндпоинта или использования deleteCategory с childId, если API это поддерживает унифицированно.
                                                        В swagger: DELETE /api/categories/{categoryId} работает для Parent.
                                                        Для Child есть change, add variants/attr.
                                                        Предположим, что удаление через общий /api/categories/{id} работает и для child, т.к. ID UUID.
                                                    */}
                                                    <button className="btn-icon-del" onClick={(e) => { e.stopPropagation(); handleDeleteParent(c.id); /* Reuse delete logic */ }}>×</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleAddChild} className="add-form">
                                        <h4>Добавить дочернюю</h4>
                                        <input placeholder="Название" value={newChildName} onChange={e => setNewChildName(e.target.value)} required />
                                        <input placeholder="Описание" value={newChildDesc} onChange={e => setNewChildDesc(e.target.value)} />
                                        <input type="file" onChange={e => setNewChildPhoto(e.target.files?.[0] || null)} />
                                        <input placeholder="Атрибуты (через запятую)" value={newChildAttrKeys} onChange={e => setNewChildAttrKeys(e.target.value)} />
                                        <input placeholder="Варианты (через запятую)" value={newChildVarKeys} onChange={e => setNewChildVarKeys(e.target.value)} />
                                        <button type="submit">Добавить Child</button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Column 3: Attributes & Variants */}
                        <div className="col-details">
                            <h3>Детали (Атрибуты/Варианты)</h3>
                            {!selectedChild ? <p className="hint">Выберите дочернюю категорию</p> : (
                                <>
                                    <div className="details-block">
                                        <h4>Атрибуты</h4>
                                        <ul>
                                            {loadingAttrs ? <li>Загрузка...</li> : attributes.map(a => (
                                                <li key={a.id}>
                                                    {a.key}
                                                    <button onClick={() => handleDeleteAttribute(a.id)}>×</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mini-form">
                                            <input placeholder="Ключ атрибута" value={newAttrKey} onChange={e => setNewAttrKey(e.target.value)} />
                                            <button onClick={handleAddAttribute}>+</button>
                                        </div>
                                    </div>

                                    <div className="details-block">
                                        <h4>Варианты (Добавление)</h4>
                                        <p className="hint-text">Список вариантов управляется глобально или при создании, здесь можно добавить новый ключ.</p>
                                        <div className="mini-form">
                                            <input placeholder="Ключ варианта (напр. Color)" value={newVarKey} onChange={e => setNewVarKey(e.target.value)} />
                                            <button onClick={handleAddVariant}>+</button>
                                        </div>
                                        {/* Реализовать удаление варианта сложнее без списка ID, см. заметку в сервисе */}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;