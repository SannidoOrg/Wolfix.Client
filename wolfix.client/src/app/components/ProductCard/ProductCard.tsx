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
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-details">
          <div className="product-rating">★ {rating}</div>
          <div className="product-prices">
            <span className="product-old-price">{oldPrice} грн</span>
            <span className="product-new-price">{price}</span>
          </div>
          <div className="product-fee">+ {additionalFee} бонусів</div>
        </div>
        <button className="add-to-cart">🛒</button>
      </div>
    </div>
  );
};

export default ProductCard;