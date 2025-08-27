"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import "../../../styles/BrandCard.css";

interface IBrandCardProps {
  category: string;
  brandName: string;
  models: string[];
  imageUrl: string;
}

const BrandCard: FC<IBrandCardProps> = ({ category, brandName, models, imageUrl }) => {
  const router = useRouter();

  const handleModelSelect = (model: string) => {
    const modelPath = model.replace(/\s+/g, '-').toLowerCase();
    router.push(`/product/${category}/${modelPath}`);
  };

  return (
    <div className="brand-card">
      <div className="brand-card-image-container">
        <img src={imageUrl} alt={brandName} className="brand-card-image" />
      </div>
      <h2 className="brand-card-title">{brandName}</h2>
      <div className="brand-card-divider"></div>
      <div className="model-list">
        {models.map((model) => (
          <div
            key={model}
            className="model-item-text"
            onClick={() => handleModelSelect(model)}
          >
            {model}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandCard;