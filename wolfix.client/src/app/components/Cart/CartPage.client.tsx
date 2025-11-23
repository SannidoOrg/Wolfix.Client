"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "../ProductCard/ProductCard.client";
import StandaloneCarousel from "../ProductCarousel/StandaloneCarousel.client";
import "../../../styles/Cart.css";

const CartPageClient: FC = () => {
    const { cart, removeFromCart } = useUser();
    const { recommendedProducts, fetchRecommendedProducts } = useProducts();
    const router = useRouter();

    useEffect(() => {
        fetchRecommendedProducts();
    }, []);

    const handleRemove = (id: string) => {
        if (confirm("Видалити товар з кошика?")) {
            removeFromCart(id);
        }
    };

    const totalPrice = cart?.totalCartPriceWithoutBonuses || 0;
    const items = cart?.items || [];

    if (!items.length) {
        return (
            <div className="cart-page-container" style={{textAlign: 'center', padding: '100px'}}>
                <h2>Кошик порожній</h2>
                <p>Додайте товари, щоб зробити замовлення</p>
                <button onClick={() => router.push('/')} className="checkout-btn" style={{maxWidth: '200px', marginTop: '20px'}}>
                    На головну
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <h1 className="cart-title">Кошик</h1>

            <div className="cart-layout">
                {/* Left Column: Items */}
                <div className="cart-items-column">
                    <div className="cart-list-header">
                        <label className="select-all-label">
                            <input type="checkbox" />
                            Обрати все
                        </label>
                    </div>

                    {items.map((item) => (
                        <div key={item.id} className="cart-item-card">
                            <input type="checkbox" className="cart-item-checkbox" />
                            <img
                                src={item.photoUrl || "/placeholder.png"}
                                alt={item.title}
                                className="cart-item-image"
                                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                            />

                            <div className="cart-item-details">
                                <div>
                                    <div className="cart-item-title">{item.title}</div>
                                    {/* Заглушка для продавца, так как в CartItemDto его нет */}
                                    <div className="cart-item-seller">Продавець: Wolfix</div>
                                </div>

                                <div className="cart-item-actions">
                                    {/* Счетчик (визуальный, так как API DELETE работает по ID строки) */}
                                    <div className="quantity-control">
                                        <button className="qty-btn" disabled>-</button>
                                        <span className="qty-value">1</span>
                                        <button className="qty-btn" disabled>+</button>
                                    </div>

                                    <div className="cart-item-price">
                                        {item.price.toLocaleString()} грн
                                    </div>
                                </div>
                            </div>

                            <div className="cart-item-icons">
                                <img src="/icons/Vector79.png" alt="Favorite" className="action-icon" title="В обране" />
                                <img
                                    src="/icons/close-icon.png"
                                    alt="Delete"
                                    className="action-icon"
                                    title="Видалити"
                                    onClick={() => handleRemove(item.id)}
                                    style={{opacity: 0.4, width: 16}}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Summary */}
                <div className="cart-summary-column">
                    <div className="cart-total-row">
                        <span className="total-label">Всього:</span>
                        <span className="total-amount">{totalPrice.toLocaleString()} грн</span>
                    </div>

                    <button className="checkout-btn" onClick={() => router.push('/checkout')}>
                        Оформити замовлення
                    </button>

                    <button className="continue-shopping" onClick={() => router.push('/')}>
                        Продовжити покупки
                    </button>
                </div>
            </div>

            {/* Recommended Section */}
            {recommendedProducts.length > 0 && (
                <div className="recommended-section">
                    <h2 className="recommended-title">Ви переглядали раніше</h2>
                    <StandaloneCarousel products={recommendedProducts} />
                </div>
            )}
        </div>
    );
};

export default CartPageClient;