"use client";

import { FC, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import { allProducts, promoProducts, Product } from "../../data/products";

const ProductList: FC = () => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePrev = () => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : promoProducts.length - 4));
  const handleNext = () => setCarouselIndex((prev) => (prev < promoProducts.length - 4 ? prev + 1 : 0));

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProductsCount((prev) => prev + 4);
      setIsLoading(false);
    }, 1000);
  };
  
  const totalSteps = promoProducts.length > 4 ? promoProducts.length - 4 : 0;
  const progressWidth = totalSteps > 0 ? `${(carouselIndex / totalSteps) * 100}%` : "0%";

  const initialGridProducts = allProducts.slice(0, 12);
  const remainingProducts = allProducts.slice(12, visibleProductsCount);

  return (
    <div className="product-list-wrapper">
      <div className="separator-container">
        <span className="separator-text">Акційні товари</span>
        <div className="separator-line" />
      </div>
      <ProductCarousel
        products={promoProducts}
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

      {allProducts.length > 12 && (
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

      {visibleProductsCount < allProducts.length && (
        <div className="load-more-container">
          <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ProductList;