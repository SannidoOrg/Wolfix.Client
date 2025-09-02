"use client";

import { FC, useState } from "react";
import ProductCard from "../ProductCard/ProductCard.server";
import ProductCarousel from "../ProductCarousel/ProductCarousel.client";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton.client";
import { Product } from "../../data/products";

interface IProductListClientProps {
  promoProducts: Product[];
  allProducts: Product[];
}

const ProductListClient: FC<IProductListClientProps> = ({ promoProducts, allProducts }) => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const safePromoProducts = promoProducts || [];
  const safeAllProducts = allProducts || [];

  const handlePrev = () => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : safePromoProducts.length - 4));
  const handleNext = () => setCarouselIndex((prev) => (prev < safePromoProducts.length - 4 ? prev + 1 : 0));

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProductsCount((prev) => prev + 4);
      setIsLoading(false);
    }, 1000);
  };

  const totalSteps = safePromoProducts.length > 4 ? safePromoProducts.length - 4 : 0;
  const progressWidth = totalSteps > 0 ? `${(carouselIndex / totalSteps) * 100}%` : "0%";

  const initialGridProducts = safeAllProducts.slice(0, 12);
  const remainingProducts = safeAllProducts.slice(12, visibleProductsCount);

  return (
    <div className="product-list-wrapper">
      <div className="separator-container">
        <span className="separator-text">Акційні товари</span>
        <div className="separator-line" />
      </div>
      <ProductCarousel
        products={safePromoProducts}
        currentIndex={carouselIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: progressWidth }}></div>
      </div>

      <div className="separator-container">
        <span className="separator-text">Всі товари</span>
        <div className="separator-line" />
      </div>
      <div className="products-grid">
        {initialGridProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {safeAllProducts.length > 12 && (
        <>
          <div className="custom-separator" />
          <div className="custom-banner">
            <img src="/banners/Banner_4.png" alt="Продавайте легко з Wolfix" />
          </div>
          <div className="custom-separator" />

          <div className="products-grid">
            {remainingProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {visibleProductsCount < safeAllProducts.length && (
        <div className="load-more-container">
          <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ProductListClient;