"use client";

import { FC, useState, useEffect } from "react";
import "../../../styles/Banner.css";

interface IBannerClientProps {
    banners: string[];
}

const BannerClient: FC<IBannerClientProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="banner">
      <button className="banner-prev" onClick={handlePrev}>
        <img src="/icons/Group101.png" alt="Previous" />
      </button>
      <div className="banner-content">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`banner-image ${index === currentIndex ? 'active' : ''}`}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
          />
        ))}
      </div>
      <button className="banner-next" onClick={handleNext}>
        <img src="/icons/Group100.png" alt="Next" />
      </button>
      <div className="banner-dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerClient;