import { FC } from "react";
import { Product } from "../../data/products";

interface IProductCardProps {
  product: Product;
}

const ProductCard: FC<IProductCardProps> = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.price);
  const formattedOldPrice = product.oldPrice ? new Intl.NumberFormat('uk-UA').format(product.oldPrice) : null;

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="top-buttons">
        <img src="/icons/Vector79.png" alt="Add to Favorites" className="button-icon" />
        <img src="/icons/Group.png" alt="Add to Compare" className="button-icon" />
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-details">
          <div className="product-pricing">
            <div className="product-rating">
              <img src="/icons/Vector.jpg" alt="Star" className="rating-star" />
              <span className="rating-value">{product.rating}</span>
            </div>
            {formattedOldPrice && <div className="product-old-price">{formattedOldPrice} грн</div>}
            <div className="product-new-price">{formattedPrice} грн</div>
          </div>
        </div>
        <div className="cart-button">
          <img src="/icons/ShoppingCart.png" alt="Add to Cart" className="button-icon-cart" />
        </div>
        <div className="product-fee">
          <img src="/icons/Coins.png" alt="Bonus" className="bonus-icons" />
          + {product.additionalFee} бонусів
        </div>
      </div>
    </div>
  );
};

export default ProductCard;