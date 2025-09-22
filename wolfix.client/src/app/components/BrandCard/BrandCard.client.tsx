"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

export interface IBrandCardProps {
  category: string;
  brandName: string;
  models: string[];
  imageUrl: string;
}

const BrandCardClient: FC<IBrandCardProps> = ({ category, brandName, models, imageUrl }) => {
  const router = useRouter();

  const handleBrandClick = () => {
    const brandSlug = brandName.split(' ')[1].toLowerCase();
    router.push(`/categories/${category}/${brandSlug}`);
  };

  return (
    <div className="brand-card" onClick={handleBrandClick}>
      <div className="brand-card-image-container">
        <img src={imageUrl} alt={brandName} className="brand-card-image" />
      </div>
      <h2 className="brand-card-title">{brandName}</h2>
      <div className="brand-card-divider"></div>
      <div className="model-list">
        {models.map((model) => (
          <div key={model} className="model-item-text">{model}</div>
        ))}
      </div>
    </div>
  );
};

export default BrandCardClient;