import { FC } from 'react';
import Header from '../../components/Header/Header.client';
import Footer from '../../components/Footer/Footer';
import BrandCard from '../../components/BrandCard/BrandCard';
import { getCategoryName } from './utils';
import '../../../styles/CategoryPage.css';

interface ICategoryPageProps {
  params: {
    category: string;
  };
}

interface BrandData {
  [key: string]: {
    [brand: string]: {
      models: string[];
      imageUrl: string;
    };
  };
}

const brandData: BrandData = {
  smartfony: {
    'Смартфони Apple': { models: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 15"], imageUrl: "/Categoryes/image8.png" },
    'Смартфони Samsung': { models: ["Galaxy S25 Ultra", "Galaxy Fold7", "Galaxy A56"], imageUrl: "/Categoryes/samsung.png" },
    'Смартфони Xiaomi': { models: ["14T Pro", "Redmi Note 14 Pro+", "Redmi 14C"], imageUrl: "/Categoryes/xiaomi.png" },
    'Смартфони Google': { models: ["Pixel 9 Pro", "Pixel 8a", "Pixel Fold 2"], imageUrl: "/Categoryes/google.png" },
  },
};

const CategoryPage: FC<ICategoryPageProps> = ({ params }) => {
  const { category } = params;
  const categoryName = getCategoryName(category);
  const categoryBrands = brandData[category] || {};

  return (
    <div className="page-container">
      <Header logoAlt="Wolfix Logo" />
      <main className="main-content-category">
        <div className="breadcrumbs">Головна / {categoryName} /</div>
        <h1 className="category-title">{categoryName}</h1>
        <div className="cards-grid">
          {Object.entries(categoryBrands).map(([brandName, brandInfo]) => (
            <BrandCard
              key={brandName}
              category={category}
              brandName={brandName}
              models={brandInfo.models}
              imageUrl={brandInfo.imageUrl}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;