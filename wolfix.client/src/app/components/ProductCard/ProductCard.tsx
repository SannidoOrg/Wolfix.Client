import { FC } from "react";

interface IProductCardProps {
  name: string;
  oldPrice: number;
  price: string;
  rating: number;
  additionalFee: number;
  imageSrc: string;
}

const ProductCard: FC<IProductCardProps> = ({ name, oldPrice, price, rating, additionalFee, imageSrc }) => {
  return (
    <div className="product-card">
      <img src={imageSrc} alt={name} className="product-image" />
      <div className="top-buttons">
        <img src="/icons/Vector79.png" alt="Add to Favorites" className="button-icon" />
        <img src="/icons/Group.png" alt="Add to Compare" className="button-icon" />
      </div>
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-details">
          <div className="product-pricing">
            <div className="product-rating">
              <img src="/icons/Vector.jpg" alt="Star" className="rating-star" />
              <span className="rating-value">{rating}</span>
            </div>
            {oldPrice > 0 && <div className="product-old-price">{oldPrice} грн</div>}
            <div className="product-new-price">{price}</div>
          </div>
        </div>
        <div className="cart-button">
          <img src="/icons/ShoppingCart.png" alt="Add to Cart" className="button-icon-cart" />
        </div>
        <div className="product-fee">
          <img src="/icons/Coins.png" alt="Bonus" className="bonus-icons" />
          + {additionalFee} бонусів
        </div>
      </div>
    </div>
  );
};

export default ProductCard;