"use client";

import { FC } from "react";
import { ProductShortDto } from "../../../types/product";
import { useAuth } from "../../../contexts/AuthContext";

interface IProductCardProps {
  product: ProductShortDto;
}

const ProductCard: FC<IProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
        alert("Будь ласка, увійдіть до акаунту");
        return;
    }
  };

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
        alert("Будь ласка, увійдіть до акаунту");
        return;
    }
  };

  return (
    <div className="product-card">
      <img src={product.photoUrl} alt={product.title} className="product-image" />
      <div className="top-buttons">
        <button onClick={handleAddToFavorites} className="button-icon">
            <img src="/icons/Vector79.png" alt="Add to Favorites" />
        </button>
        <img src="/icons/Group.png" alt="Add to Compare" className="button-icon" />
      </div>
      <div className="product-info">
        <div className="product-name">{product.title}</div>
        <div className="product-pricing">
            <div className="product-new-price">{product.finalPrice} грн</div>
        </div>
        <button onClick={handleAddToCart} className="cart-button">
            <img src="/icons/ShoppingCart.png" alt="Add to Cart" className="button-icon-cart" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;