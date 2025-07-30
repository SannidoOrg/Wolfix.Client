import { FC } from "react";

interface IProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
}

const ProductCard: FC<IProductCardProps> = ({ name, price, imageUrl }) => {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
        <button className="add-to-cart">🛒</button>
      </div>
    </div>
  );
};

export default ProductCard;