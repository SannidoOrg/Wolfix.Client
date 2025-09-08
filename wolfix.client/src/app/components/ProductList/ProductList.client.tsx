"use client";

import { FC, useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard.client";
import ProductCarousel from "../ProductCarousel/ProductCarousel.client";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton.client";
import { useProducts } from "../../../contexts/ProductContext";
import { useGlobalContext } from "../../../contexts/GlobalContext";

const ProductListClient: FC = () => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(12);

  const { products, promoProducts, fetchRandomProducts, fetchPromoProducts } = useProducts();
  const { loading } = useGlobalContext();
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchRandomProducts();
    fetchPromoProducts(1);
  }, []);

  const safePromoProducts = promoProducts || [];
  const safeProducts = products || [];

  const handlePrev = () => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : safePromoProducts.length - 4));
  const handleNext = () => setCarouselIndex((prev) => (prev < safePromoProducts.length - 4 ? prev + 1 : 0));

  const handleLoadMore = () => {
    setIsLoadMoreLoading(true);
    setVisibleProductsCount((prev) => prev + 4);
    setIsLoadMoreLoading(false);
  };

  const totalSteps = safePromoProducts.length > 4 ? safePromoProducts.length - 4 : 0;
  const progressWidth = totalSteps > 0 ? `${(carouselIndex / totalSteps) * 100}%` : "0%";

  const initialGridProducts = safeProducts.slice(0, 12);
  const remainingProducts = safeProducts.slice(12, visibleProductsCount);

  if (loading && safeProducts.length === 0) {
    return <div>Завантаження товарів...</div>;
  }

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
        {initialGridProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {safeProducts.length > 12 && (
        <>
          <div className="custom-separator" />
          <div className="custom-banner">
            <img src="/banners/Banner_4.png" alt="Продавайте легко з Wolfix" />
          </div>
          <div className="custom-separator" />

          <div className="products-grid">
            {remainingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {visibleProductsCount < safeProducts.length && (
        <div className="load-more-container">
          <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoadMoreLoading} />
        </div>
      )}
    </div>
  );
};

export default ProductListClient;