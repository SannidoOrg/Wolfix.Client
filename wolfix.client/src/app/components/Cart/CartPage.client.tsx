"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useProducts } from "@/contexts/ProductContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import StandaloneCarousel from "../ProductCarousel/StandaloneCarousel.client";
import "../../../styles/Cart.css";
import "../../../styles/ProfilePage.css"; // Используем стили профиля для контейнера

const CartPageClient: FC = () => {
    const { cart, removeFromCart, addToFavorites, isProductInFavorites } = useUser();
    const { recommendedProducts, fetchRecommendedProducts } = useProducts();
    const { setLoading } = useGlobalContext();
    const router = useRouter();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchRecommendedProducts();
    }, []);

    const items = cart?.items || [];
    const totalPrice = cart?.totalCartPriceWithoutBonuses || 0;

    // --- Selection Logic ---
    const isAllSelected = items.length > 0 && selectedIds.length === items.length;

    const handleSelectAll = () => {
        if (isAllSelected) setSelectedIds([]);
        else setSelectedIds(items.map(i => i.id));
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds(prev => prev.filter(i => i !== id));
        else setSelectedIds(prev => [...prev, id]);
    };

    // --- Actions ---
    const handleDelete = async (id: string) => {
        if (confirm("Видалити товар з кошика?")) {
            await removeFromCart(id);
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleToggleFav = (id: string) => {
        // TODO: Логика добавления в избранное из корзины
        // Так как у нас в CartItemDto нет productId (только id записи корзины?),
        // или id и есть productId? По Swagger CartItemDto.id - это ID товара.
        // Значит можно добавлять.
        addToFavorites(id);
    };

    return (
        <div className="profile-card-content"> {/* Стиль белой карточки профиля */}
            <h1 className="cart-title">Кошик</h1>

            <div className="cart-list-header">
                <label className="select-all-label">
                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={items.length === 0} />
                    Обрати все
                </label>
                {/* Кнопки удаления выбранных можно добавить сюда */}
            </div>

            <div className="cart-layout-profile">
                {/* Список товаров */}
                <div className="cart-items-list">
                    {items.length === 0 ? (
                        <p style={{textAlign:'center', color:'#888', padding:'40px'}}>Кошик порожній</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <div className="checkbox-area">
                                    <input
                                        type="checkbox"
                                        className="cart-item-checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleSelectOne(item.id)}
                                    />
                                </div>

                                <img
                                    src={item.photoUrl || "/placeholder.png"}
                                    alt={item.title}
                                    className="cart-item-image"
                                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                                />

                                <div className="cart-item-info">
                                    <div className="item-title-row">
                                        <span className="item-title">{item.title}</span>
                                    </div>
                                    <div className="item-seller">Продавець: Wolfix</div> {/* Заглушка */}

                                    <div className="item-controls">
                                        {/* Счетчик отключен (сервер не поддерживает) */}
                                        <div className="qty-control disabled">
                                            <button>-</button>
                                            <span>1</span>
                                            <button>+</button>
                                        </div>
                                        <div className="item-price">{item.price.toLocaleString()} грн</div>
                                    </div>
                                </div>

                                <div className="cart-item-actions-right">
                                    <button onClick={() => handleToggleFav(item.id)} className="icon-btn">
                                        <img
                                            src={isProductInFavorites(item.id) ? "/icons/selected.png" : "/icons/Vector79.png"}
                                            alt="Fav"
                                            style={{width: 20, height: 20}}
                                        />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="icon-btn">
                                        <img src="/icons/X.png" alt="Del" style={{width: 16, height: 16, opacity: 0.5}} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Итого и кнопка */}
                {items.length > 0 && (
                    <div className="cart-summary-right">
                        <div className="total-row">
                            <span>Всього:</span>
                            <span className="total-val">{totalPrice.toLocaleString()} грн</span>
                        </div>
                        <button className="checkout-btn" onClick={() => router.push('/checkout')}>
                            Оформити замовлення
                        </button>
                        <button className="continue-btn" onClick={() => router.push('/')}>
                            Продовжити покупки
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPageClient;