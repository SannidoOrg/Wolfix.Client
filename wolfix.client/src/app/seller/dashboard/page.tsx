"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { sellerService } from "../../../services/sellerService";
import { ProductShortDto, SellerOrderDto } from "../../../types/seller";
import CreateProductForm from "../../components/CreateProductForm/CreateProductForm.client";
import SellerProfileSettings from "../../components/SellerProfile/SellerProfileSettings.client";
import "../../../styles/Dashboard.css";

type SellerTab = "products" | "orders" | "profile";

interface SellerCategoryDto {
    id: string;
    categoryId: string;
    name: string;
}

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

    // Helpers to get IDs
    const getSellerId = () => user?.profileId || (user as any)?.customerId; // ID профиля продавца
    const getAccountId = () => user?.id; // ID аккаунта (для смены пароля/email)

    useEffect(() => {
        if (!authLoading) {
            if (user && user.role !== "Seller") {
                router.push("/");
                return;
            }
            if (user) {
                if (activeTab === "products") loadCategories();
                if (activeTab === "orders") loadOrders();
            }
        }
    }, [user, authLoading, router, activeTab]);

    const loadCategories = async () => {
        const id = getSellerId();
        if (!id) return;
        try {
            const cats = (await sellerService.getCategories(id)) as unknown as SellerCategoryDto[];
            setCategories(cats);
            if (cats.length > 0 && !selectedCategory) {
                const firstCatId = cats[0].categoryId;
                setSelectedCategory(firstCatId);
                loadProducts(firstCatId);
            }
        } catch (e) { console.error("Error loading categories", e); }
    };

    const loadProducts = async (catId: string) => {
        const id = getSellerId();
        if (!id || !catId) return;
        setIsLoading(true);
        try {
            const res = await sellerService.getProductsByCategory(id, catId);
            setProducts(res.items || []);
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const loadOrders = async () => {
        const id = getSellerId(); // Здесь должен быть ID продавца, а не UserID
        if (!id) {
            console.error("Seller ID not found in user context");
            return;
        }
        setIsLoading(true);
        try {
            // Запрос идет на /api/orders/sellers/{sellerId}
            const data = await sellerService.getOrders(id);
            setOrders(data);
        } catch (e) {
            console.error("Error loading orders:", e);
        } finally { setIsLoading(false); }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Видалити товар?")) return;
        try {
            await sellerService.deleteProduct(id);
            if (selectedCategory) loadProducts(selectedCategory);
        } catch (e) { alert("Ошибка удаления"); }
    };

    if (authLoading) return <div className="loading-state">Завантаження...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Кабінет Продавця</h1>
                <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
                    <span>{user?.email}</span>
                    <button onClick={logout} className="btn logout-btn">Вийти</button>
                </div>
            </header>

            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Мої Товари</button>
                <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Замовлення</button>
                <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Профіль</button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'products' && (
                    <div className="two-col-layout">
                        <div className="list-column">
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                                <h3>Список товарів</h3>
                                <select
                                    className="btn"
                                    style={{background:'white', border:'1px solid #ddd', minWidth: '200px'}}
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        loadProducts(e.target.value);
                                    }}
                                >
                                    {categories.length === 0 && <option value="">Немає категорій</option>}
                                    {categories.map(c => <option key={c.id} value={c.categoryId}>{c.name}</option>)}
                                </select>
                            </div>
                            {isLoading ? <p>Завантаження...</p> : (
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
                                            <button className="btn btn-reject" style={{padding:'5px 10px'}} onClick={() => handleDeleteProduct(p.id)}>Видалити</button>
                                        </li>
                                    ))}
                                    {products.length === 0 && <p style={{color:'#888', fontStyle:'italic'}}>Товарів немає.</p>}
                                </ul>
                            )}
                        </div>
                        <div className="form-column">
                            <h3>Додати Товар</h3>
                            <CreateProductForm />
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="full-width-list">
                        <h3>Мої Продажі</h3>
                        {isLoading ? <p>Завантаження...</p> : (
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
                                {orders.length === 0 && <p>Замовлень поки немає.</p>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-tab-content">
                        {getSellerId() && getAccountId() ? (
                            <SellerProfileSettings sellerId={getSellerId()!} accountId={getAccountId()!} />
                        ) : (
                            <p className="text-center text-red-500">Помилка: Неможливо визначити ID продавця або акаунта.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardPage;