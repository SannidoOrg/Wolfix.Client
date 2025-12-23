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
import "../../../styles/Dashboard.css"; // UPDATED IMPORT
import { useAuth } from "../../../contexts/AuthContext";

type Tab = "applications" | "categories";

const AdminDashboardPage = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("categories");
    // ... (State variables same as before) ...
    const [applications, setApplications] = useState<SellerApplicationDto[]>([]);
    const [appsLoading, setAppsLoading] = useState(false);
    const [parents, setParents] = useState<ParentCategoryDto[]>([]);
    const [selectedParent, setSelectedParent] = useState<ParentCategoryDto | null>(null);
    const [children, setChildren] = useState<ChildCategoryDto[]>([]);
    const [selectedChild, setSelectedChild] = useState<ChildCategoryDto | null>(null);
    const [attributes, setAttributes] = useState<CategoryAttributeDto[]>([]);
    const [loadingParents, setLoadingParents] = useState(false);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const [loadingAttrs, setLoadingAttrs] = useState(false);

    // Forms
    const [newParentName, setNewParentName] = useState("");
    const [newParentDesc, setNewParentDesc] = useState("");
    const [newParentPhoto, setNewParentPhoto] = useState<File | null>(null);
    const [newChildName, setNewChildName] = useState("");
    const [newChildDesc, setNewChildDesc] = useState("");
    const [newChildPhoto, setNewChildPhoto] = useState<File | null>(null);
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
    // ... (Logic functions fetchApplications, handleApprove, etc. remain EXACTLY same) ...
    const fetchApplications = async () => { /* ... same logic ... */ setAppsLoading(true); try { const data = await adminService.getAllApplications(); setApplications(data); } catch(e){console.error(e);} finally {setAppsLoading(false);} };
    const handleApproveApp = async (id: string) => { if(!confirm("Одобрить?")) return; await adminService.approveApplication(id); setApplications(prev => prev.filter(a => a.id !== id)); };
    const handleRejectApp = async (id: string) => { if(!confirm("Отклонить?")) return; await adminService.rejectApplication(id); setApplications(prev => prev.filter(a => a.id !== id)); };
    const fetchParents = async () => { setLoadingParents(true); const data = await adminService.getAllParentCategories(); setParents(data); setLoadingParents(false); };
    const handleParentClick = async (p: ParentCategoryDto) => { setSelectedParent(p); setSelectedChild(null); setAttributes([]); setLoadingChildren(true); const data = await adminService.getChildCategoriesByParent(p.id); setChildren(data); setLoadingChildren(false); };
    const handleChildClick = async (c: ChildCategoryDto) => { setSelectedChild(c); setLoadingAttrs(true); const data = await adminService.getAttributesByChildCategory(c.id); setAttributes(data); setLoadingAttrs(false); };
    const handleAddParent = async (e: React.FormEvent) => { e.preventDefault(); await adminService.addParentCategory({name: newParentName, description: newParentDesc, photo: newParentPhoto}); setNewParentName(""); fetchParents(); };
    const handleDeleteParent = async (id: string) => { if(confirm("Delete?")) { await adminService.deleteCategory(id); fetchParents(); setSelectedParent(null); } };
    const handleAddChild = async (e: React.FormEvent) => { e.preventDefault(); if(!selectedParent) return; await adminService.addChildCategory(selectedParent.id, { name: newChildName, description: newChildDesc, photo: newChildPhoto, attributeKeys: newChildAttrKeys.split(","), variantKeys: newChildVarKeys.split(",") }); setNewChildName(""); handleParentClick(selectedParent); };
    const handleChangeChild = async (child: ChildCategoryDto) => { const n = prompt("Name", child.name); if(n) { await adminService.changeChildCategory(child.id, {name: n}); if(selectedParent) handleParentClick(selectedParent); } };
    const handleAddAttribute = async () => { if(selectedChild && newAttrKey) { await adminService.addAttributeToChildCategory(selectedChild.id, {key: newAttrKey}); setNewAttrKey(""); handleChildClick(selectedChild); } };
    const handleDeleteAttribute = async (id: string) => { if(selectedChild && confirm("Del?")) { await adminService.deleteAttribute(selectedChild.id, id); handleChildClick(selectedChild); } };
    const handleAddVariant = async () => { if(selectedChild && newVarKey) { await adminService.addVariantToChildCategory(selectedChild.id, {key: newVarKey}); setNewVarKey(""); alert("Added"); } };
    const getDocumentLink = (url?: string) => { if(!url) return null; return url.startsWith("http") ? url : `${API_URL}/${url}`; };

    if (authLoading) return <div className="loading-state">Checking permissions...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Панель Администратора</h1>
                <button onClick={logout} className="btn logout-btn">Выйти</button>
            </header>

            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Категории</button>
                <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Заявки</button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'applications' && (
                    <div className="full-width-list">
                        {appsLoading && <p>Загрузка...</p>}
                        {applications.map(app => (
                            <div key={app.id} className="application-card">
                                <h3>{app.sellerProfileData?.fullName?.firstName} {app.sellerProfileData?.fullName?.lastName}</h3>
                                <p>Категория: {app.categoryName} | Тел: {app.sellerProfileData?.phoneNumber?.value}</p>
                                {app.documentUrl && <a href={getDocumentLink(app.documentUrl) || '#'} target="_blank" className="text-blue-500 underline">Документ</a>}
                                <div className="app-actions">
                                    <button className="btn btn-approve" onClick={() => handleApproveApp(app.id)}>Одобрить</button>
                                    <button className="btn btn-reject" onClick={() => handleRejectApp(app.id)}>Отклонить</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="categories-grid">
                        <div className="list-column">
                            <h3>Родительские</h3>
                            <div className="item-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                {parents.map(p => (
                                    <div key={p.id} className={`category-item ${selectedParent?.id === p.id ? 'selected' : ''}`} onClick={() => handleParentClick(p)}>
                                        {p.name}
                                        <button className="btn btn-reject" style={{padding:'2px 6px', fontSize:'0.7rem'}} onClick={(e) => {e.stopPropagation(); handleDeleteParent(p.id)}}>×</button>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleAddParent} className="add-form">
                                <input value={newParentName} onChange={e => setNewParentName(e.target.value)} placeholder="Название" required />
                                <button className="btn btn-primary" type="submit">Добавить</button>
                            </form>
                        </div>

                        <div className="list-column">
                            <h3>Дочерние</h3>
                            {!selectedParent ? <p className="text-gray-500">Выберите родителя</p> : (
                                <>
                                    <div className="item-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {children.map(c => (
                                            <div key={c.id} className={`category-item ${selectedChild?.id === c.id ? 'selected' : ''}`} onClick={() => handleChildClick(c)}>
                                                {c.name}
                                                <button onClick={(e) => {e.stopPropagation(); handleChangeChild(c)}} style={{marginLeft:'auto', marginRight:'5px'}}>✎</button>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleAddChild} className="add-form">
                                        <input value={newChildName} onChange={e => setNewChildName(e.target.value)} placeholder="Название" required />
                                        <input value={newChildAttrKeys} onChange={e => setNewChildAttrKeys(e.target.value)} placeholder="Атрибуты (через ,)" />
                                        <button className="btn btn-primary" type="submit">Добавить</button>
                                    </form>
                                </>
                            )}
                        </div>

                        <div className="list-column">
                            <h3>Атрибуты</h3>
                            {!selectedChild ? <p className="text-gray-500">Выберите категорию</p> : (
                                <>
                                    <ul className="item-list">
                                        {attributes.map(a => (
                                            <li key={a.id}>
                                                {a.key}
                                                <button onClick={() => handleDeleteAttribute(a.id)} className="text-red-500">×</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mini-form">
                                        <input value={newAttrKey} onChange={e => setNewAttrKey(e.target.value)} placeholder="Новый атрибут" />
                                        <button className="btn btn-primary" style={{width:'100%'}} onClick={handleAddAttribute}>+</button>
                                    </div>
                                    <div className="mini-form" style={{marginTop:'20px'}}>
                                        <input value={newVarKey} onChange={e => setNewVarKey(e.target.value)} placeholder="Новый вариант" />
                                        <button className="btn btn-primary" style={{width:'100%'}} onClick={handleAddVariant}>Add Var</button>
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