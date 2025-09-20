"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface ProductMedia {
  url: string;
  isMain: boolean;
}

interface ProductImageCarouselProps {
  medias: ProductMedia[];
}

export default function ProductImageCarousel({ medias }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? medias.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === medias.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className={styles.carouselContainer}>
        <button className={styles.leftArrow} onClick={goToPrevious}>
            <img src="/icons/Group198.png" alt="Previous" />
        </button>
        <button className={styles.rightArrow} onClick={goToNext}>
            <img src="/icons/Group196.png" alt="Next" />
        </button>
        <Image 
            key={currentIndex}
            src={medias[currentIndex].url}
            alt={`Product image ${currentIndex + 1}`}
            fill
            style={{ objectFit: 'contain' }}
        />
        <div className={styles.dotsContainer}>
            {medias.map((slide, slideIndex) => (
                <div
                    key={slideIndex}
                    className={`${styles.dot} ${currentIndex === slideIndex ? styles.activeDot : ''}`}
                    onClick={() => goToSlide(slideIndex)}
                ></div>
            ))}
        </div>
    </div>
  );
}