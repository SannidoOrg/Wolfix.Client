"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { sellerService } from "../../../services/sellerService";
import { ProductShortDto, SellerCategoryDto, SellerOrderDto } from "../../../types/seller";
import CreateProductForm from "../../components/CreateProductForm/CreateProductForm.client"; // Импортируем компонент формы
import "../../../styles/Dashboard.css";

type SellerTab = "products" | "orders" | "profile";

const SellerDashboardPage = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SellerTab>("products");

    // Data State
    const [categories, setCategories] = useState<SellerCategoryDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [products, setProducts] = useState<ProductShortDto[]>([]);
    const [orders, setOrders] = useState<SellerOrderDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Удалены локальные стейты для формы (newProduct), так как теперь за это отвечает компонент CreateProductForm

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "Seller") {
                router.push("/");
                return;
            }
            // Load initial data
            if (activeTab === "products") loadCategories();
            if (activeTab === "orders") loadOrders();
        }
    }, [user, authLoading, router, activeTab]);

    const getSellerId = () => {
        // Используем profileId (если есть) как ID продавца, или fallback на id пользователя
        return user?.profileId || user?.id;
    };

    const loadCategories = async () => {
        const id = getSellerId();
        if (!id) return;
        try {
            const cats = await sellerService.getCategories(id);
            setCategories(cats);
            if (cats.length > 0 && !selectedCategory) {
                setSelectedCategory(cats[0].categoryId);
                loadProducts(cats[0].categoryId);
            }
        } catch (e) { console.error(e); }
    };

    const loadProducts = async (catId: string) => {
        const id = getSellerId();
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await sellerService.getProductsByCategory(id, catId);
            setProducts(res.items || []);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const loadOrders = async () => {
        const id = getSellerId();
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await sellerService.getOrders(id);
            setOrders(data);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Удалить товар?")) return;
        try {
            await sellerService.deleteProduct(id);
            if (selectedCategory) loadProducts(selectedCategory);
        } catch (e) { alert("Ошибка удаления"); }
    };

    if (authLoading) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Кабинет Продавца</h1>
                <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
                    <span>{user?.email}</span>
                    <button onClick={logout} className="btn logout-btn">Выйти</button>
                </div>
            </header>

            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Мои Товары</button>
                <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Заказы</button>
                <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Профиль</button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'products' && (
                    <div className="two-col-layout">
                        {/* Список товаров */}
                        <div className="list-column">
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                                <h3>Список товаров</h3>
                                <select
                                    className="btn"
                                    style={{background:'white', border:'1px solid #ddd'}}
                                    value={selectedCategory}
                                    onChange={(e) => { setSelectedCategory(e.target.value); loadProducts(e.target.value); }}
                                >
                                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                                </select>
                            </div>

                            {isLoading ? <p>Загрузка...</p> : (
                                <ul className="item-list">
                                    {products.map(p => (
                                        <li key={p.id}>
                                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                                {p.mainPhoto && <img src={p.mainPhoto} alt="" style={{width:40, height:40, borderRadius:4, objectFit:'cover'}}/>}
                                                <div>
                                                    <strong>{p.title}</strong>
                                                    <div style={{fontSize:'0.85em', color:'#666'}}>{p.price} ₴</div>
                                                </div>
                                            </div>
                                            <button className="btn btn-reject" style={{padding:'5px 10px'}} onClick={() => handleDeleteProduct(p.id)}>Удалить</button>
                                        </li>
                                    ))}
                                    {products.length === 0 && <p>В этой категории нет товаров.</p>}
                                </ul>
                            )}
                        </div>

                        {/* Форма добавления заменена на компонент */}
                        <div className="form-column">
                            <h3>Добавить Товар</h3>
                            <CreateProductForm />
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="full-width-list">
                        <h3>Мои Продажи</h3>
                        {isLoading ? <p>Загрузка...</p> : (
                            <div className="item-list">
                                {orders.map(o => (
                                    <div key={o.id} style={{padding:'15px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                            {o.photoUrl && <img src={o.photoUrl} alt="" style={{width:50, height:50, borderRadius:4}}/>}
                                            <div>
                                                <strong>{o.title}</strong>
                                                <div>{o.quantity} шт. x {o.price} ₴</div>
                                            </div>
                                        </div>
                                        <div style={{fontWeight:'bold', color:'var(--success-color)'}}>
                                            +{o.price * o.quantity} ₴
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && <p>Заказов пока нет.</p>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="form-card" style={{maxWidth:'600px', margin:'0 auto', textAlign:'center'}}>
                        <h3>Профиль</h3>
                        <p>ID: {user?.id}</p>
                        <p>Email: {user?.email}</p>
                        <p style={{color:'#666', marginTop:'10px'}}>Редактирование профиля доступно в настройках аккаунта.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardPage;