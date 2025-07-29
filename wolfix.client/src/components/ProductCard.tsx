import { FC } from 'react';
import { formatPrice } from '../utils/helpers';
import { IProduct } from '../types';
import styles from '../styles/ProductCard.module.css';

interface IProductCardProps {
  product: IProduct;
}

const ProductCard: FC<IProductCardProps> = ({ product }) => {
  return (
    <div className={styles.card}>
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Ціна: {formatPrice(product.price)}</p>
      <p>Стара ціна: {formatPrice(product.originalPrice)}</p>
      <p>Рейтинг: {product.rating}</p>
    </div>
  );
};

export default ProductCard;