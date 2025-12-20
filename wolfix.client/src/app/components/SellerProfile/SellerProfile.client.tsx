"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import "../../../styles/SellerProfile.css";

// Типы данных (адаптируйте под ваши реальные DTO)
interface Product {
    id: string;
    title: string;
    price: number;
    categoryName?: string;
    images?: string[];
}

interface Order {
    id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
    customerName: string;
}

interface ShopSettingsForm {
    companyName: string;
    description: string;
    siteUrl: string;
}

const SellerProfile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');

    // Стейты данных
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // React Hook Form для настроек
    const { register, handleSubmit, reset: resetSettings } = useForm<ShopSettingsForm>();

    // === 1. ЗАГРУЗКА ДАННЫХ ===
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'products') {
                    // Получение товаров продавца
                    // Если бэк не фильтрует по токену, нужно передать sellerId
                    const response = await api.get(`/api/products`);
                    // В реальном API тут должен быть фильтр ?sellerId=${user.profileId}
                    // Для демонстрации берем все, но в продакшене фильтруем
                    setProducts(response.data || []);
                }
                else if (activeTab === 'orders') {
                    // Получение заказов (пример эндпоинта)
                    // const response = await api.get(`/api/orders/seller`);
                    // setOrders(response.data);

                    // MOCK DATA для заказов, пока нет реального API
                    setOrders([
                        { id: "ORD-001", createdAt: "2023-11-20", totalAmount: 1200, status: "Новий", customerName: "Олена П." },
                        { id: "ORD-002", createdAt: "2023-11-22", totalAmount: 450, status: "Виконано", customerName: "Іван Б." },
                    ]);
                }
                else if (activeTab === 'settings') {
                    // Получение данных магазина
                    // const response = await api.get(`/api/sellers/${user.profileId}`);
                    // resetSettings(response.data);

                    // Пре-заполнение формы заглушкой
                    resetSettings({
                        companyName: "Мій Магазин",
                        description: "Найкращі товари для дому",
                        siteUrl: "https://myshop.com"
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab, user, resetSettings]);


    // === 2. ДЕЙСТВИЯ ===

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Ви впевнені, що хочете видалити цей товар?")) return;
        try {
            await api.delete(`/api/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Помилка видалення товару");
        }
    };

    const onSaveSettings: SubmitHandler<ShopSettingsForm> = async (data) => {
        try {
            // await api.put(`/api/sellers/${user?.profileId}`, data);
            alert("Налаштування збережено!");
        } catch (error) {
            alert("Помилка збереження");
        }
    };

    if (!user) return <div className="p-10 text-center">Будь ласка, увійдіть в систему.</div>;

    // Проверка роли (если пользователь случайно попал сюда)
    const isSeller = user.role === "Seller" || user.role === "seller";
    // Временно можно убрать проверку для тестов, если роль еще не пришла правильно

    return (
        <div className="container mx-auto px-4">
            <div className="seller-profile-container">

                {/* --- SIDEBAR --- */}
                <aside className="seller-sidebar">
                    <div className="seller-info">
                        <div className="seller-avatar">
                            {user.firstName ? user.firstName[0].toUpperCase() : "S"}
                        </div>
                        <h2 className="seller-name">{user.firstName} {user.lastName}</h2>
                        <p className="seller-role">Продавець</p>
                    </div>

                    <nav className="seller-nav">
                        <button
                            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            📦 Мої товари
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            📋 Замовлення
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            ⚙️ Налаштування магазину
                        </button>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <button onClick={logout} className="nav-item text-red-500 hover:bg-red-50 hover:text-red-600">
                            🚪 Вийти
                        </button>
                    </nav>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="seller-content">

                    {/* Вкладка: ТОВАРЫ */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="content-header">
                                <h1 className="content-title">Мої товари</h1>
                                <Link href="/products/create" className="action-btn">
                                    + Додати товар
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="loading-state">Завантаження товарів...</div>
                            ) : products.length > 0 ? (
                                <div className="data-table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>Фото</th>
                                            <th>Назва</th>
                                            <th>Ціна</th>
                                            <th>Дії</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>
                                                    {product.images && product.images[0] ? (
                                                        <img src={product.images[0]} alt="" className="product-row-img"/>
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Нет фото</div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="font-medium">{product.title}</div>
                                                    <div className="text-xs text-gray-500">{product.categoryName}</div>
                                                </td>
                                                <td>{product.price} ₴</td>
                                                <td>
                                                    <div className="flex gap-3">
                                                        {/* Ссылка на редактирование (нужна страница) */}
                                                        <Link href={`/products/edit/${product.id}`} className="text-blue-600 hover:underline text-sm">
                                                            Ред.
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="delete-btn text-sm"
                                                        >
                                                            Видалити
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>У вас поки немає товарів.</p>
                                    <Link href="/products/create" className="text-orange-500 underline mt-2 inline-block">
                                        Створити перший товар
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Вкладка: ЗАКАЗЫ */}
                    {activeTab === 'orders' && (
                        <div>
                            <div className="content-header">
                                <h1 className="content-title">Замовлення</h1>
                            </div>

                            {isLoading ? (
                                <div className="loading-state">Завантаження замовлень...</div>
                            ) : orders.length > 0 ? (
                                <div className="data-table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>№ Замовлення</th>
                                            <th>Дата</th>
                                            <th>Клієнт</th>
                                            <th>Сума</th>
                                            <th>Статус</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td className="font-medium">#{order.id}</td>
                                                <td>{order.createdAt}</td>
                                                <td>{order.customerName}</td>
                                                <td>{order.totalAmount} ₴</td>
                                                <td>
                                                        <span className={`status-badge ${
                                                            order.status === 'Новий' ? 'status-new' :
                                                                order.status === 'Виконано' ? 'status-completed' : 'status-cancelled'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">Замовлень поки немає.</div>
                            )}
                        </div>
                    )}

                    {/* Вкладка: НАСТРОЙКИ */}
                    {activeTab === 'settings' && (
                        <div>
                            <div className="content-header">
                                <h1 className="content-title">Налаштування магазину</h1>
                            </div>

                            <form onSubmit={handleSubmit(onSaveSettings)} className="settings-form">
                                <div className="form-group">
                                    <label className="form-label font-medium mb-1 block">Назва компанії</label>
                                    <input
                                        type="text"
                                        className="form-input w-full p-2 border rounded"
                                        {...register("companyName", { required: true })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label font-medium mb-1 block">Опис магазину</label>
                                    <textarea
                                        className="form-input w-full p-2 border rounded"
                                        rows={4}
                                        {...register("description")}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label font-medium mb-1 block">Веб-сайт</label>
                                    <input
                                        type="text"
                                        className="form-input w-full p-2 border rounded"
                                        {...register("siteUrl")}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="action-btn">
                                        Зберегти зміни
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SellerProfile;