"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { ProductShortDto } from "../../../types/product";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import "../../../styles/ProductCard.css";

interface IProductCardProps {
    product: ProductShortDto;
}

const ProductCard: FC<IProductCardProps> = ({ product }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart, addToFavorites, removeFromFavorites, isProductInFavorites } = useUser();

    const isFavorite = isProductInFavorites(product.id);

    const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.finalPrice);
    const formattedOldPrice = product.price !== product.finalPrice ? new Intl.NumberFormat('uk-UA').format(product.price) : null;

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть до акаунту");
            return;
        }
        addToCart(product.id);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть до акаунту");
            return;
        }

        if (isFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product.id);
        }
    };

    return (
        <div className="product-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <div className="product-image-wrapper">
                <img
                    src={product.mainPhoto || "/placeholder.png"}
                    alt={product.title}
                    className="product-image"
                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                />

                <div className="top-buttons">
                    <button onClick={handleToggleFavorite} className="action-button">
                        {isFavorite ? (
                            // Закрашенное сердце (можно заменить на другую иконку или SVG)
                            <img src="/icons/selected.png" alt="Remove from Favorites" className="button-icon active-favorite" />
                        ) : (
                            // Пустое сердце
                            <img src="/icons/Vector79.png" alt="Add to Favorites" className="button-icon" />
                        )}
                    </button>
                    <button className="action-button" onClick={(e) => e.stopPropagation()}>
                        <img src="/icons/Group.png" alt="Compare" className="button-icon" />
                    </button>
                </div>
            </div>

            <div className="product-info">
                <div className="product-name" title={product.title}>{product.title}</div>

                <div className="product-rating-row">
                    <div className="product-rating">
                        <img src="/icons/Vector.jpg" alt="Star" className="rating-star" />
                        <span className="rating-value">{product.averageRating}</span>
                    </div>
                </div>

                <div className="price-section">
                    {formattedOldPrice && <div className="product-old-price">{formattedOldPrice} грн</div>}
                    <div className="product-new-price">{formattedPrice} грн</div>
                </div>

                <button onClick={handleAddToCart} className="cart-button">
                    <img src="/icons/ShoppingCart.png" alt="Cart" className="button-icon-cart" />
                </button>

                {product.bonuses > 0 && (
                    <div className="product-fee">
                        <img src="/icons/Coins.png" alt="Bonus" className="bonus-icons" />
                        + {product.bonuses} бонусів
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;