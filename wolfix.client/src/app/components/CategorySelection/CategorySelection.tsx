"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import "../../../styles/CategorySelection.css";

interface ICategorySelectionProps {
  category: string;
}

interface BrandModels {
  [key: string]: string[];
}

interface BrandData {
  [key: string]: {
    [brand: string]: string[];
  };
}

const CategorySelection: FC<ICategorySelectionProps> = ({ category }) => {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const brandData: BrandData = {
    smartfony: {
      Apple: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12"],
      Samsung: ["Galaxy Fold7", "Galaxy Flip7", "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S24", "Galaxy S24 FE", "Galaxy A56"],
      Xiaomi: ["14T Pro", "14 Pro", "Redmi Note 14 Pro+ 5G", "Redmi Note 14 Pro", "Redmi Note 14S", "Redmi Note 14", "Redmi 13", "Redmi 14C"],
      Motorola: ["Edge 50", "G85", "G84", "G64", "G54", "G15 Power", "G05", "E14"]
    }
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    router.push(`/product/${category}/${model}`);
  };

  const brand = Object.keys(brandData[category] || {})[0] || "Apple";
  const models = brandData[category]?.[brand] || [];

  return (
    <div className="category-selection">
      <div className="brand-card">
        <div className="model-list">
          {models.map((model) => (
            <div key={model} className="model-item" onClick={() => handleModelSelect(model)}>
              {model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;