// src/app/components/ProductCard/ProductCard.client.tsx
"use client";

import { FC } from "react";
import { useRouter } from "next/navigation"; // Добавляем роутер
import { ProductShortDto } from "../../../types/product";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import "../../../styles/ProductCard.css";

interface IProductCardProps {
    product: ProductShortDto;
}

const ProductCard: FC<IProductCardProps> = ({ product }) => {
    const router = useRouter(); // Хук
    const { isAuthenticated } = useAuth();
    const { addToCart, addToFavorites } = useUser();

    const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.finalPrice);
    const formattedOldPrice = product.price !== product.finalPrice ? new Intl.NumberFormat('uk-UA').format(product.price) : null;

    // Обработчик клика по карточке
    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Чтобы не срабатывал переход при клике на кнопку
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть до акаунту");
            return;
        }
        addToCart(product.id);
    };

    const handleAddToFavorites = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть до акаунту");
            return;
        }
        addToFavorites(product.id);
    };

    return (
        // Добавляем onClick на весь контейнер
        <div className="product-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <img src={product.mainPhoto || "/placeholder.png"} alt={product.title} className="product-image" />

            <div className="top-buttons">
                <button onClick={handleAddToFavorites} className="action-button">
                    <img src="/icons/Vector79.png" alt="Add to Favorites" className="button-icon" />
                </button>
                {/* Кнопка сравнения - можно тоже остановить всплытие */}
                <button className="action-button" onClick={(e) => e.stopPropagation()}>
                    <img src="/icons/Group.png" alt="Add to Compare" className="button-icon" />
                </button>
            </div>

            <div className="product-info">
                <div className="product-name">{product.title}</div>
                <div className="product-details">
                    <div className="product-pricing">
                        <div className="product-rating">
                            <img src="/icons/Vector.jpg" alt="Star" className="rating-star" />
                            <span className="rating-value">{product.averageRating}</span>
                        </div>
                        {formattedOldPrice && <div className="product-old-price">{formattedOldPrice} грн</div>}
                        <div className="product-new-price">{formattedPrice} грн</div>
                    </div>
                </div>

                <button onClick={handleAddToCart} className="cart-button">
                    <img src="/icons/ShoppingCart.png" alt="Add to Cart" className="button-icon-cart" />
                </button>

                <div className="product-fee">
                    <img src="/icons/Coins.png" alt="Bonus" className="bonus-icons" />
                    + {product.bonuses} бонусів
                </div>
            </div>
        </div>
    );
};

export default ProductCard;