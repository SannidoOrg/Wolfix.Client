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
    'Смартфони Apple': {
      models: ["Apple iPhone 16 Pro Max", "Apple iPhone 16 Pro", "Apple iPhone 16 Plus", "Apple iPhone 16", "Apple iPhone 15", "Apple iPhone 14", "Apple iPhone 13", "Apple iPhone 12"],
      imageUrl: "/Categoryes/image8.png",
    },
    'Смартфони Samsung': {
      models: ["Galaxy Fold7", "Galaxy Flip7", "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S24", "Galaxy S24 FE", "Galaxy A56"],
      imageUrl: "/samsung.png",
    },
    'Смартфони Xiaomi': {
      models: ["14T Pro", "14 Pro", "Redmi Note 14 Pro+ 5G", "Redmi Note 14 Pro", "Redmi Note 14S", "Redmi Note 14", "Redmi 13", "Redmi 14C"],
      imageUrl: "/xiaomi.png",
    },
  },
};

const CategoryPage: FC<ICategoryPageProps> = ({ params }) => {
  const { category } = params;
  const categoryName = getCategoryName(category);
  const categoryBrands = brandData[category] || {};

  if (categoryName === 'Категорія не знайдена') {
    return null;
  }

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