"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import CreateProductForm from "../CreateProductForm/CreateProductForm.client";
import "../../../styles/SellerProfile.css";

// --- Types ---
interface SellerDto {
    id: string;
    fullName?: {
        firstName?: string;
        lastName?: string;
        middleName?: string;
    };
    phoneNumber?: string;
    address?: {
        city?: string;
        street?: string;
        houseNumber?: number;
        apartmentNumber?: number;
    };
    birthDate?: string;
}

interface SellerCategoryDto {
    id: string;
    name: string;
}

interface ProductShortDto {
    id: string;
    title: string;
    price: number;
    finalPrice: number;
    averageRating: number;
    mainPhoto?: string;
}

interface PaginationResponse {
    items: ProductShortDto[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

// --- Forms Interfaces ---
interface FullNameForm { firstName: string; lastName: string; middleName: string; }
interface PhoneForm { phoneNumber: string; }
interface AddressForm { city: string; street: string; houseNumber: number; apartmentNumber?: number; }
interface BirthDateForm { birthDate: string; }

const SellerProfile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
    const [isLoading, setIsLoading] = useState(false);
    const [sellerData, setSellerData] = useState<SellerDto | null>(null);

    // --- State for Products Tab ---
    const [sellerCategories, setSellerCategories] = useState<SellerCategoryDto[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductShortDto[]>([]);

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Модалка
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    // --- State for Orders Tab ---
    const [orders, setOrders] = useState<any[]>([]);

    // --- Forms hooks ---
    const nameForm = useForm<FullNameForm>();
    const phoneForm = useForm<PhoneForm>();
    const addressForm = useForm<AddressForm>();
    const birthForm = useForm<BirthDateForm>();

    const sellerId = user?.profileId || user?.userId;

    // === 1. ЗАГРУЗКА ПРОФИЛЯ ===
    useEffect(() => {
        if (!sellerId) return;

        const fetchProfile = async () => {
            try {
                const profileRes = await api.get<SellerDto>(`/api/sellers/${sellerId}`);
                setSellerData(profileRes.data);

                if (profileRes.data) {
                    const { fullName, phoneNumber, address, birthDate } = profileRes.data;
                    nameForm.reset({
                        firstName: fullName?.firstName || "",
                        lastName: fullName?.lastName || "",
                        middleName: fullName?.middleName || ""
                    });
                    phoneForm.reset({ phoneNumber: phoneNumber || "" });
                    addressForm.reset({
                        city: address?.city || "",
                        street: address?.street || "",
                        houseNumber: address?.houseNumber,
                        apartmentNumber: address?.apartmentNumber
                    });
                    if (birthDate) {
                        birthForm.reset({ birthDate: new Date(birthDate).toISOString().split('T')[0] });
                    }
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        };

        fetchProfile();
    }, [sellerId, nameForm, phoneForm, addressForm, birthForm]);

    // === 2. ЗАГРУЗКА КАТЕГОРИЙ (при входе на вкладку товаров) ===
    useEffect(() => {
        if (!sellerId || activeTab !== 'products') return;

        const loadCategories = async () => {
            try {
                // Получаем список категорий, в которых у продавца есть товары (или все доступные ему)
                const catRes = await api.get<SellerCategoryDto[]>(`/api/sellers/${sellerId}/categories`);
                const cats = catRes.data || [];
                setSellerCategories(cats);

                // Если категории есть, выбираем первую по умолчанию
                if (cats.length > 0 && !selectedCategoryId) {
                    setSelectedCategoryId(cats[0].id);
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };

        loadCategories();
    }, [activeTab, sellerId, selectedCategoryId]);

    // === 3. ЗАГРУЗКА ТОВАРОВ ПО КАТЕГОРИИ ===
    useEffect(() => {
        if (activeTab === 'products' && selectedCategoryId && sellerId) {
            const fetchProducts = async () => {
                setIsLoading(true);
                try {
                    // !!! ВАЖНО: Используем правильный эндпоинт
                    // GET /api/sellers/{sellerId}/category/{categoryId}/page/{page}
                    const res = await api.get<PaginationResponse>(
                        `/api/sellers/${sellerId}/category/${selectedCategoryId}/page/${currentPage}`
                    );

                    setProducts(res.data.items || []);
                    setTotalPages(res.data.totalPages || 1);
                } catch (error) {
                    console.error("Error loading products:", error);
                    setProducts([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        } else if (activeTab === 'products' && sellerCategories.length === 0) {
            setProducts([]);
            setIsLoading(false);
        }
    }, [selectedCategoryId, currentPage, activeTab, sellerId, sellerCategories.length]);

    // === 4. ЗАГРУЗКА ЗАКАЗОВ ===
    useEffect(() => {
        if (activeTab === 'orders') {
            // Mock data (замените на реальный вызов, когда будет эндпоинт)
            setOrders([
                { id: "ORD-001", createdAt: "2023-11-20", totalAmount: 1200, status: "Новий", customerName: "Олена П." },
                { id: "ORD-002", createdAt: "2023-11-22", totalAmount: 450, status: "Виконано", customerName: "Іван Б." },
            ]);
        }
    }, [activeTab]);


    // === ОБРАБОТЧИКИ (HANDLERS) ===

    // Обновление профиля
    const onUpdateName: SubmitHandler<FullNameForm> = async (data) => {
        try { await api.patch(`/api/sellers/${sellerId}/full-name`, data); alert("ПІБ оновлено!"); } catch(e) { alert("Помилка"); }
    };
    const onUpdatePhone: SubmitHandler<PhoneForm> = async (data) => {
        try { await api.patch(`/api/sellers/${sellerId}/phone-number`, data); alert("Телефон оновлено!"); } catch(e) { alert("Помилка"); }
    };
    const onUpdateAddress: SubmitHandler<AddressForm> = async (data) => {
        try { await api.patch(`/api/sellers/${sellerId}/address`, data); alert("Адресу оновлено!"); } catch(e) { alert("Помилка"); }
    };
    const onUpdateBirthDate: SubmitHandler<BirthDateForm> = async (data) => {
        try { await api.patch(`/api/sellers/${sellerId}/birth-date`, data); alert("Дату оновлено!"); } catch(e) { alert("Помилка"); }
    };

    // Удаление товара
    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Видалити товар?")) return;
        try {
            await api.delete(`/api/products/product/${id}`);
            // Обновляем список локально
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Помилка видалення");
        }
    };

    // Модалка
    const closeAddModal = () => {
        setIsAddProductModalOpen(false);
        // Можно добавить логику обновления списка товаров
    };

    if (!user) return <div className="p-10 text-center">Будь ласка, увійдіть.</div>;

    return (
        <div className="container mx-auto px-4 relative">
            <div className="seller-profile-container">

                {/* --- SIDEBAR --- */}
                <aside className="seller-sidebar">
                    <div className="seller-info">
                        <div className="seller-avatar">
                            {sellerData?.fullName?.firstName ? sellerData.fullName.firstName[0] : "S"}
                        </div>
                        <h2 className="seller-name">
                            {sellerData?.fullName?.firstName} {sellerData?.fullName?.lastName}
                        </h2>
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
                            ⚙️ Налаштування профілю
                        </button>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <button onClick={logout} className="nav-item text-red-500 hover:bg-red-50 hover:text-red-600">
                            🚪 Вийти
                        </button>
                    </nav>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="seller-content">

                    {/* === TAB: PRODUCTS === */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="content-header">
                                <h1 className="content-title">Мої товари</h1>
                                <button onClick={() => setIsAddProductModalOpen(true)} className="action-btn">
                                    + Додати товар
                                </button>
                            </div>

                            {/* Category Filter Tabs */}
                            <div className="category-tabs-container mb-6">
                                {sellerCategories.length > 0 ? (
                                    <div className="category-tabs">
                                        {sellerCategories.map(cat => (
                                            <button
                                                key={cat.id}
                                                className={`category-tab ${selectedCategoryId === cat.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedCategoryId(cat.id);
                                                    setCurrentPage(1); // Сброс страницы при смене категории
                                                }}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">У вас ще немає категорій з товарами.</p>
                                )}
                            </div>

                            {/* Products Table */}
                            {isLoading ? (
                                <div className="loading-state">Завантаження...</div>
                            ) : products.length > 0 ? (
                                <>
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
                                                        {product.mainPhoto ? (
                                                            <img src={product.mainPhoto} alt="" className="product-row-img"/>
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="font-medium">{product.title}</div>
                                                    </td>
                                                    <td>
                                                        {product.finalPrice < product.price ? (
                                                            <div>
                                                                <span className="text-red-500 font-bold">{product.finalPrice} ₴</span>
                                                                <span className="text-gray-400 line-through text-xs ml-2">{product.price} ₴</span>
                                                            </div>
                                                        ) : (
                                                            <span>{product.price} ₴</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="delete-btn text-sm"
                                                        >
                                                            Видалити
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="pagination-controls mt-6 flex justify-center gap-2">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ← Назад
                                        </button>
                                        <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Вперед →
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="empty-state">
                                    <p>У цій категорії немає товарів.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === TAB: ORDERS === */}
                    {activeTab === 'orders' && (
                        <div>
                            <div className="content-header">
                                <h1 className="content-title">Замовлення</h1>
                            </div>
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
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
                                            <td><span className="status-badge status-new">{order.status}</span></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* === TAB: SETTINGS === */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8">
                            <h1 className="content-title border-b pb-4">Налаштування профілю</h1>

                            <form onSubmit={nameForm.handleSubmit(onUpdateName)} className="settings-section">
                                <h3 className="text-lg font-semibold mb-4">Особисті дані</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Прізвище</label>
                                        <input type="text" className="form-input" {...nameForm.register("lastName")} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Ім'я</label>
                                        <input type="text" className="form-input" {...nameForm.register("firstName")} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">По батькові</label>
                                        <input type="text" className="form-input" {...nameForm.register("middleName")} />
                                    </div>
                                </div>
                                <button type="submit" className="save-btn mt-3">Зберегти ПІБ</button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <form onSubmit={phoneForm.handleSubmit(onUpdatePhone)} className="settings-section">
                                    <h3 className="text-lg font-semibold mb-4">Контакти</h3>
                                    <div className="form-group">
                                        <label className="form-label">Телефон</label>
                                        <input type="tel" className="form-input" {...phoneForm.register("phoneNumber")} />
                                    </div>
                                    <button type="submit" className="save-btn mt-3">Зберегти телефон</button>
                                </form>

                                <form onSubmit={birthForm.handleSubmit(onUpdateBirthDate)} className="settings-section">
                                    <h3 className="text-lg font-semibold mb-4">Дата народження</h3>
                                    <div className="form-group">
                                        <label className="form-label">Дата</label>
                                        <input type="date" className="form-input" {...birthForm.register("birthDate")} />
                                    </div>
                                    <button type="submit" className="save-btn mt-3">Зберегти дату</button>
                                </form>
                            </div>

                            <form onSubmit={addressForm.handleSubmit(onUpdateAddress)} className="settings-section">
                                <h3 className="text-lg font-semibold mb-4">Адреса бізнесу</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Місто</label>
                                        <input type="text" className="form-input" {...addressForm.register("city")} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Вулиця</label>
                                        <input type="text" className="form-input" {...addressForm.register("street")} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Номер будинку</label>
                                        <input type="number" className="form-input" {...addressForm.register("houseNumber", { valueAsNumber: true })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Офіс / Квартира</label>
                                        <input type="number" className="form-input" {...addressForm.register("apartmentNumber", { valueAsNumber: true })} />
                                    </div>
                                </div>
                                <button type="submit" className="save-btn mt-3">Зберегти адресу</button>
                            </form>
                        </div>
                    )}
                </main>
            </div>

            {/* === ADD PRODUCT MODAL === */}
            {isAddProductModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-large">
                        <button className="modal-close-btn" onClick={closeAddModal}>×</button>
                        <h2 className="text-xl font-bold mb-4">Додати новий товар</h2>
                        <div className="modal-scroll-area">
                            <CreateProductForm />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProfile;