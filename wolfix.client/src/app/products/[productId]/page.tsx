import { notFound } from "next/navigation";
import Header from "../../components/Header/Header.server";
import Footer from "../../components/Footer/Footer.server";
import ProductActions from "./ProductActions.client";
import ProductImageCarousel from "./ProductImageCarousel.client";
import ProductVariants from "./ProductVariants.client";
import ProductTabsNav from "./ProductTabsNav.client";
import ProductReviews from "./ProductReviews.client";
import styles from './page.module.css';
import Image from "next/image";
import { ReviewDto, ReviewsResponseDto } from "../../../types/review";

interface ProductCategory {
  categoryId: string;
  categoryName: string;
  order: number;
}
interface ProductMedia {
  url:string;
  isMain: boolean;
}
interface ProductVariant {
  key: string;
  value: string;
}
interface ProductAttribute {
  key: string;
  value: string;
}

interface Seller {
    sellerId: string;
    sellerFullName: string;
    sellerPhotoUrl: string;
}

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  finalPrice: number;
  bonuses: number;
  averageRating: number | null;
  seller: Seller | string | null;
  reviewsSummary: Omit<ReviewsResponseDto, 'reviews'>;
  medias: ProductMedia[];
  variants: ProductVariant[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
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

async function getProductReviews(productId: string): Promise<ReviewDto[]> {
    try {
        const res = await fetch(`https://wolfix-api.azurewebsites.net/api/products/${productId}/reviews?pageSize=10`, {
             next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data: ReviewsResponseDto = await res.json();
        return data.reviews || [];
    } catch (error) {
        return [];
    }
}

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
  const initialReviews = await getProductReviews(params.productId);

  if (!product) {
    notFound();
  }

  const sortedCategories = product.categories.sort((a, b) => a.order - b.order);

  const sellerName = (product.seller && typeof product.seller === 'object')
    ? product.seller.sellerFullName
    : product.seller || 'Wolfix';

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

        <ProductTabsNav />

        <div id="product-top" className={styles.productMainLayout}>
          <div className={styles.productGallery}>
             <ProductImageCarousel medias={product.medias} />
            <div className={styles.detailsSection}>
                <div className={styles.detailsHeader}>
                    <h2>Характеристики</h2>
                </div>
                <ul className={styles.attributesList}>
                    {product.attributes.slice(0, 4).map(attr => (
                    <li key={attr.key} className={styles.attributeItem}>
                        <span className={styles.attributeKey}>{attr.key}</span>
                        <span className={styles.attributeValue}>{attr.value}</span>
                    </li>
                    ))}
                </ul>
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
                <ProductVariants variants={product.variants} title={product.title} />
            </div>

            <div className={styles.purchaseBox}>
                <div className={styles.sellerHeader}>
                    Продавець: {sellerName}
                </div>
                <div className={styles.priceContent}>
                    <div className={styles.priceLine}>
                        <span className={styles.price}>{new Intl.NumberFormat('uk-UA').format(product.finalPrice)} грн</span>
                        <div className={styles.bonuses}>
                            <Image src="/icons/Coins.png" alt="bonus" width={24} height={24} />
                            <span>+ {product.bonuses} бонусів</span>
                        </div>
                    </div>
                    <ProductActions productId={product.id} />
                </div>
            </div>

            <div className={styles.deliveryBox}>
                <div className={styles.deliveryHeader}>
                    <h2>Доставка:</h2>
                </div>
                <ul className={styles.deliveryList}>
                    <li className={styles.deliveryOption}>
                        <span className={styles.deliveryMethod}>
                            <Image src="/icons/CourierWolfix.png" alt="courier" width={32} height={32} />
                            <span className={styles.deliveryMethodName}>Кур'єр Wolfix</span>
                        </span>
                        <span className={styles.deliveryTime}>Отримати сьогодні з 14:00</span>
                        <span className={`${styles.deliveryPrice} ${styles.deliveryPriceFree}`}>Безкоштовно</span>
                    </li>
                    <li className={styles.deliveryOption}>
                        <span className={styles.deliveryMethod}>
                            <Image src="/icons/CourierTrack.png" alt="courier" width={32} height={32} />
                            <span className={styles.deliveryMethodName}>Кур'єр на вашу адресу</span>
                        </span>
                        <span className={styles.deliveryTime}>Доставка завтра з 11:00</span>
                        <span className={styles.deliveryPrice}>120 грн</span>
                    </li>
                    <li className={styles.deliveryOption}>
                        <span className={styles.deliveryMethod}>
                             <Image src="/icons/NovaPost.png" alt="novaposhta" width={32} height={32} />
                            <span className={styles.deliveryMethodName}>Самовивіз з Нової Пошти</span>
                        </span>
                        <span className={styles.deliveryTime}>Відправимо завтра</span>
                        <span className={`${styles.deliveryPrice} ${styles.deliveryPriceFree}`}>Безкоштовно</span>
                    </li>
                </ul>
            </div>

            <div className={styles.paymentBox}>
                <div className={styles.paymentOption}>
                    <Image src="/icons/Payment.png" alt="payment" width={31} height={26} />
                    <div>
                        <span className={styles.paymentLabel}>Оплата: </span>
                        <span className={styles.paymentValue}>Картою онлайн, Оплата під час отримання товару, Оплата карткою у відділенні, Apple Pay, Google Pay, Безготівковими для юридичних осіб, Безготівковий для фізичних осіб, Visa та Mastercard.</span>
                    </div>
                </div>
                <hr className={styles.paymentSeparator}/>
                <div className={styles.paymentOption}>
                    <Image src="/icons/Garant.png" alt="warranty" width={21} height={26} />
                    <div>
                        <span className={styles.paymentLabel}>Гарантія: </span>
                        <span className={styles.paymentValue}>12 місяців офіційної гарантії від виробника Обмін/повернення товару впродовж 14 днів</span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div id="product-description" className={styles.descriptionBox}>
            <h2 className={styles.largeDetailsHeader}>Опис:</h2>
            <p>{product.description}</p>
        </div>

        <div id="product-characteristics" className={styles.largeDetailsBox}>
            <h2 className={styles.largeDetailsHeader}>Характеристики:</h2>
            <ul className={styles.attributesListFull}>
                {product.attributes.map(attr => (
                     <li key={attr.key} className={styles.attributeItem}>
                        <span className={styles.attributeKey}>{attr.key}</span>
                        <span className={styles.attributeValue}>{attr.value}</span>
                    </li>
                ))}
            </ul>
            <button className={styles.showAllButton}>Всі характеристики</button>
        </div>

        <ProductReviews
            productId={product.id}
            initialSummary={product.reviewsSummary}
            initialReviews={initialReviews}
        />
      </main>
      <Footer />
    </div>
  );
}