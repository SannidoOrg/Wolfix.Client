"use client";

import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Product } from "../../data/products";
import "../../../styles/ProductCarousel.css";

interface IProductCarouselProps {
  products: Product[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const ProductCarousel: FC<IProductCarouselProps> = ({ products, currentIndex, onPrev, onNext }) => {
  const safeProducts = products || [];

  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <div className="product-carousel">
      <div className="carousel-content">
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 230}px)` }}>
          {safeProducts.map((product) => (
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