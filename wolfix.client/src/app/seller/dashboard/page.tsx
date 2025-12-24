"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { sellerService } from "../../../services/sellerService";
import { ProductShortDto, SellerOrderDto } from "../../../types/seller";
import CreateProductForm from "../../components/CreateProductForm/CreateProductForm.client";
import "../../../styles/Dashboard.css";

type SellerTab = "products" | "orders" | "profile";

// Определяем интерфейс локально, чтобы гарантировать наличие categoryId
interface SellerCategoryDto {
    id: string;         // ID связи
    categoryId: string; // Реальный ID категории (важен для запроса товаров)
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

    useEffect(() => {
        if (!authLoading) {
            // Если пользователь не продавец, редиректим (можно ослабить проверку если роль еще грузится)
            if (user && user.role !== "Seller") {
                router.push("/");
                return;
            }

            // Load initial data
            if (user) {
                if (activeTab === "products") loadCategories();
                if (activeTab === "orders") loadOrders();
            }
        }
    }, [user, authLoading, router, activeTab]);

    // Получаем корректный ID продавца (как в форме создания товара)
    const getSellerId = () => {
        return user?.profileId || (user as any)?.customerId || user?.id;
    };

    const loadCategories = async () => {
        const id = getSellerId();
        if (!id) return;

        try {
            // Приводим тип ответа к нашему локальному интерфейсу
            const cats = (await sellerService.getCategories(id)) as unknown as SellerCategoryDto[];
            setCategories(cats);

            // Если категории есть, а выбранной нет - выбираем первую и грузим товары
            if (cats.length > 0 && !selectedCategory) {
                const firstCatId = cats[0].categoryId;
                setSelectedCategory(firstCatId);
                loadProducts(firstCatId);
            }
        } catch (e) {
            console.error("Ошибка загрузки категорий:", e);
        }
    };

    const loadProducts = async (catId: string) => {
        const id = getSellerId();
        if (!id || !catId) {
            console.warn("Missing sellerId or categoryId for loading products", { id, catId });
            return;
        }

        setIsLoading(true);
        try {
            const res = await sellerService.getProductsByCategory(id, catId);
            // Учитываем структуру пагинации (res.items)
            setProducts(res.items || []);
        } catch (e) {
            console.error("Ошибка загрузки товаров:", e);
        } finally {
            setIsLoading(false);
        }
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
        if (!confirm("Видалити товар?")) return;
        try {
            await sellerService.deleteProduct(id);
            if (selectedCategory) loadProducts(selectedCategory);
        } catch (e) { alert("Ошибка удаления"); }
    };

    // Обработчик смены категории
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCatId = e.target.value;
        setSelectedCategory(newCatId);
        if (newCatId) {
            loadProducts(newCatId);
        } else {
            setProducts([]);
        }
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
                        {/* Список товаров */}
                        <div className="list-column">
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                                <h3>Список товарів</h3>
                                <select
                                    className="btn"
                                    style={{background:'white', border:'1px solid #ddd', minWidth: '200px'}}
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    {categories.length === 0 && <option value="">Немає категорій</option>}
                                    {categories.map(c => (
                                        <option key={c.id} value={c.categoryId}>
                                            {c.name}
                                        </option>
                                    ))}
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
                                    {!isLoading && products.length === 0 && (
                                        <p style={{color: '#888', fontStyle: 'italic'}}>
                                            {categories.length === 0
                                                ? "У вас ще немає категорій. Створіть товар, щоб категорія з'явилась."
                                                : "У цій категорії немає товарів."}
                                        </p>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Форма добавления (компонент) */}
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
                    <div className="form-card" style={{maxWidth:'600px', margin:'0 auto', textAlign:'center'}}>
                        <h3>Профіль</h3>
                        <p>ID: {user?.id}</p>
                        <p>Email: {user?.email}</p>
                        <p style={{color:'#666', marginTop:'10px'}}>Редагування профілю доступне в налаштуваннях акаунту.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardPage;