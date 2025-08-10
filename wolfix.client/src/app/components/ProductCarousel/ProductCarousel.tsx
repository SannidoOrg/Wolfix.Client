"use client";

import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard";
import "../../../styles/ProductCarousel.css";

interface IProductCarouselProps {
  products: {
    id: string;
    name: string;
    oldPrice: number;
    price: string;
    rating: number;
    additionalFee: number;
    imageUrl: string;
  }[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const ProductCarousel: FC<IProductCarouselProps> = ({ products, currentIndex, onPrev, onNext }) => {
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % products.length;
    onNext();
    if (nextIndex === 0) {
      // Если вернулись к началу, сбрасываем индекс вручную для корректной анимации
      setTimeout(() => {
        onNext(); // Вызываем onNext еще раз, чтобы завершить цикл
      }, 500); // Задержка для соответствия анимации (0.5s)
    }
  };

  return (
    <div className="product-carousel">
      <div className="carousel-content">
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 230}px)` }}>
          {products.map((product) => (
            <div key={product.id} className="carousel-item">
              <ProductCard
                name={product.name}
                oldPrice={product.oldPrice}
                price={product.price}
                rating={product.rating}
                additionalFee={product.additionalFee}
                imageSrc={product.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-prev" onClick={onPrev}>
        <img src="/icons/Group164.png" alt="Previous" />
      </button>
      <button className="carousel-next" onClick={handleNext}>
        <img src="/icons/Group164.png" alt="Next" />
      </button>
    </div>
  );
};

export default ProductCarousel;