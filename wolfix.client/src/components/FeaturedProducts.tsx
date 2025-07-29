import { FC, useEffect, useState } from 'react';
import { fetchFeaturedProducts } from '../utils/api';
import { IProduct } from '../types';
import ProductCard from './ProductCard';
import styles from '../styles/FeaturedProducts.module.css';

const FeaturedProducts: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetchFeaturedProducts().then(data => setProducts(data));
  }, []);

  return (
    <section className={styles.featured}>
      <h2>Рекомендовані товари</h2>
      <div className={styles.productList}>
        {products.map(product => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;