import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header/Header.server";
import Footer from "../../components/Footer/Footer.server"; 
import ProductActions from "./ProductActions.client";
import styles from './page.module.css';

// ... (інтерфейси залишаються без змін)

interface ProductCategory {
  categoryId: string;
  categoryName: string;
  order: number;
}
interface ProductMedia {
  url: string;
  isMain: boolean;
}
interface ProductVariant {
  key: string;
  value: string;
}
interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  finalPrice: number;
  bonuses: number;
  averageRating: number | null;
  seller: string;
  medias: ProductMedia[];
  variants: ProductVariant[];
  categories: ProductCategory[];
}

async function getProduct(productId: string): Promise<ProductDetails | null> {
  try {
    const res = await fetch(`https://wolfix-api.azurewebsites.net/api/products/product/${productId}`, {
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

const colorMap: { [key: string]: string } = {
    'Pink': '#FFC0CB', 'Black': '#000000', 'Green': '#008000', 'Yellow': '#FFFF00', 'Blue': '#0000FF',
};

const renderStars = (rating: number | null) => {
    const totalStars = 5;
    const filledStars = Math.round(rating || 0);
    const emptyStars = totalStars - filledStars;
    return (
        <>{'★'.repeat(filledStars)}{'☆'.repeat(emptyStars)}</>
    );
};

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProduct(params.productId);

  if (!product) {
    notFound();
  }

  const mainImage = product.medias.find(media => media.isMain)?.url || 'https://placehold.co/600x400?text=No+Image';
  const sortedCategories = product.categories.sort((a, b) => a.order - b.order);

  const colorVariants = product.variants.filter(v => v.key === 'Колір');
  const memoryVariants = product.variants.filter(v => v.key === 'Пам\'ять');
  const seriesVariants = product.variants.filter(v => v.key === 'Серія');

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.productPageContainer}>
        <div className={styles.breadcrumbs}>
          <span>Головна</span>
          {sortedCategories.map(cat => (
            <span key={cat.categoryId}>{' / '}{cat.categoryName}</span>
          ))}
        </div>
        
        <nav className={styles.tabsNav}>
            <ul className={styles.tabsList}>
                <li className={styles.tabItem}><a href="#" className={styles.activeTab}>Інформація про товар</a></li>
                <li className={styles.tabItem}><a href="#">Опис</a></li>
                <li className={styles.tabItem}><a href="#">Характеристики</a></li>
                <li className={styles.tabItem}><a href="#">Відгуки/Питання</a></li>
                <li className={styles.tabItem}><a href="#">Обмін та повернення</a></li>
            </ul>
        </nav>

        <div className={styles.productMainLayout}>
          <div className={styles.productGallery}>
            <div className={styles.mainImageContainer}>
              <Image 
                src={mainImage} 
                alt={product.title} 
                width={436} 
                height={566} 
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.productInfo}>
                <h1>{product.title}</h1>
                <div className={styles.productMeta}>
                    <div className={styles.rating}>
                        <span className={styles.stars}>{renderStars(product.averageRating)}</span>
                        <span>{product.averageRating?.toFixed(1) || 'Немає оцінок'}</span>
                    </div>
                    <span>Код товару: {product.id.substring(0, 6)}</span>
                </div>

                <div className={styles.productVariants}>
                    {colorVariants.length > 0 && (
                        <div className={styles.variantGroup}>
                        <h3>Колір: {colorVariants[0].value}</h3>
                        <div className={styles.variantOptions}>
                            {colorVariants.map((v, i) => (
                            <div key={v.value} className={`${styles.colorSwatch} ${i === 0 ? styles.active : ''}`} style={{ backgroundColor: colorMap[v.value] || '#cccccc' }}></div>
                            ))}
                        </div>
                        </div>
                    )}
                    {memoryVariants.length > 0 && (
                        <div className={styles.variantGroup}>
                        <h3>Пам'ять:</h3>
                        <div className={styles.variantOptions}>
                            {memoryVariants.map((v, i) => <button key={v.value} className={`${styles.variantBtn} ${i === 1 ? styles.active : ''}`}>{v.value}</button>)}
                        </div>
                        </div>
                    )}
                    {seriesVariants.length > 0 && (
                        <div className={styles.variantGroup}>
                        <h3>Серія:</h3>
                        <div className={styles.variantOptions}>
                            {seriesVariants.map((v, i) => <button key={v.value} className={`${styles.variantBtn} ${i === 0 ? styles.active : ''}`}>{v.value}</button>)}
                        </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.purchaseBox}>
                <div className={styles.sellerHeader}>
                    Продавець: {product.seller || 'Wolfix'}
                </div>
                <div className={styles.priceContent}>
                    <div>
                        <span className={styles.price}>{new Intl.NumberFormat('uk-UA').format(product.finalPrice)} грн</span>
                        {product.price > product.finalPrice && <span className={styles.oldPrice}>{product.price} грн</span>}
                        <div className={styles.bonuses}>+ {product.bonuses} бонусів</div>
                    </div>
                    <ProductActions productId={product.id} />
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}