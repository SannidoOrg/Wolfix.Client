"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
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

  const handleActionClick = (e: React.MouseEvent, action: (id: string) => void) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!isAuthenticated) {
      alert("Будь ласка, увійдіть до акаунту");
      return;
    }
    action(product.id);
  };
  
  const getImageUrl = (): string => {
    if (product.mainPhoto && product.mainPhoto.startsWith('http')) {
      return product.mainPhoto;
    }
    return '';
  };

  const imageUrl = getImageUrl();

  return (
    <Link href={`/products/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={product.title} 
              className="product-image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div className="top-buttons">
          <button onClick={(e) => handleActionClick(e, addToFavorites)} className="action-button">
            <img src="/icons/Vector79.png" alt="Add to Favorites" className="button-icon" />
          </button>
        </div>
        <div className="product-info">
          <div className="product-name">{product.title}</div>
          <div className="product-details">
            <div className="product-pricing">
              {typeof product.averageRating === 'number' && (
                <div className="product-rating">
                  <img src="/icons/Vector.jpg" alt="Star" className="rating-star" />
                  <span className="rating-value">{product.averageRating.toFixed(1)}</span>
                </div>
              )}
              {formattedOldPrice && <div className="product-old-price">{formattedOldPrice} грн</div>}
              <div className="product-new-price">{formattedPrice} грн</div>
            </div>
          </div>
          <button onClick={(e) => handleActionClick(e, addToCart)} className="cart-button">
            <img src="/icons/ShoppingCart.png" alt="Add to Cart" className="button-icon-cart" />
          </button>
          <div className="product-fee">
            <img src="/icons/Coins.png" alt="Bonus" className="bonus-icons" />
            + {product.bonuses} бонусів
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;