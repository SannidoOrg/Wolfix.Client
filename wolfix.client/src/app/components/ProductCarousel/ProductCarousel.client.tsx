"use client";

import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard.client";
import { ProductShortDto } from "../../../types/product";

interface IProductCarouselProps {
  products: ProductShortDto[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const ProductCarousel: FC<IProductCarouselProps> = ({ products, currentIndex, onPrev, onNext }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-carousel">
      <div className="carousel-content">
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 230}px)` }}>
          {products.map((product) => (
            <div key={product.id} className="carousel-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-prev" onClick={onPrev}>
        <img src="/icons/Group164.png" alt="Previous" />
      </button>
      <button className="carousel-next" onClick={onNext}>
        <img src="/icons/Group164.png" alt="Next" />
      </button>
    </div>
  );
};

export default ProductCarousel;