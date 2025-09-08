"use client";

import { FC } from "react";
import { ProductShortDto } from "../../../types/product";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";

interface IProductCardProps {
  product: ProductShortDto;
}

const ProductCard: FC<IProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, addToFavorites } = useUser();

  const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.finalPrice);
  const formattedOldPrice = product.price !== product.finalPrice ? new Intl.NumberFormat('uk-UA').format(product.price) : null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
        alert("Будь ласка, увійдіть до акаунту");
        return;
    }
    addToCart(product.id);
  };

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
        alert("Будь ласка, увійдіть до акаунту");
        return;
    }
    addToFavorites(product.id);
  };

  return (
    <div className="product-card">
      <img src={product.photoUrl || "/placeholder.png"} alt={product.title} className="product-image" />
      <div className="top-buttons">
        <button onClick={handleAddToFavorites} className="action-button">
          <img src="/icons/Vector79.png" alt="Add to Favorites" className="button-icon" />
        </button>
        <button className="action-button">
          <img src="/icons/Group.png" alt="Add to Compare" className="button-icon" />
        </button>
      </div>
      <div className="product-info">
        <div className="product-name">{product.title}</div>
        <div className="product-details">
          <div className="product-pricing">
            <div className="product-rating">
              <img src="/icons/Vector.jpg" alt="Star" className="rating-star" />
              <span className="rating-value">{product.averageRating.toFixed(1)}</span>
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