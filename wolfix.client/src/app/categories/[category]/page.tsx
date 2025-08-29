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
    'Смартфони Apple': { models: ["iPhone 16 Pro", "iPhone 15"], imageUrl: "/Categoryes/image8.png" },
    'Смартфони Samsung': { models: ["Galaxy S25", "Galaxy Fold"], imageUrl: "/Categoryes/samsung.png" },
    'Смартфони Xiaomi': { models: ["Xiaomi 14T Pro", "Redmi Note 14"], imageUrl: "/Categoryes/xiaomi.png" },
    'Смартфони Google': { models: ["Pixel 9 Pro", "Pixel 8a"], imageUrl: "/Categoryes/google.png" },
  },
  notebook: {
    'Ноутбуки Apple': { models: ["MacBook Pro", "MacBook Air"], imageUrl: "/Categoryes/apple-notebook.png" },
    'Ноутбуки ASUS': { models: ["ROG Strix", "Zenbook"], imageUrl: "/Categoryes/asus-notebook.png" },
    'Ноутбуки Lenovo': { models: ["Legion", "IdeaPad"], imageUrl: "/Categoryes/lenovo-notebook.png" },
    'Ноутбуки HP': { models: ["Pavilion", "Spectre"], imageUrl: "/Categoryes/hp-notebook.png" },
  },
  televizory: {
    'Телевізори Samsung': { models: ["Neo QLED 8K", "OLED 4K"], imageUrl: "/Categoryes/samsung-tv.png" },
    'Телевізори LG': { models: ["OLED evo", "QNED"], imageUrl: "/Categoryes/lg-tv.png" },
    'Телевізори Sony': { models: ["BRAVIA 9", "BRAVIA 7"], imageUrl: "/Categoryes/sony-tv.png" },
  },
  'smart-godinniki': {
    'Годинники Apple': { models: ["Watch Series 9", "Watch Ultra 2"], imageUrl: "/Categoryes/apple-watch.png" },
    'Годинники Samsung': { models: ["Galaxy Watch 6", "Galaxy Fit 3"], imageUrl: "/Categoryes/samsung-watch.png" },
    'Годинники Garmin': { models: ["Fenix 7", "Epix Pro"], imageUrl: "/Categoryes/garmin-watch.png" },
  },
  'tovary-dlya-domu': {
    'Техніка Dyson': { models: ["Пилососи", "Очищувачі повітря"], imageUrl: "/Categoryes/dyson-tech.png" },
    'Техніка Philips': { models: ["Парові системи", "Лампи Hue"], imageUrl: "/Categoryes/philips-tech.png" },
  },
  'tovary-dlya-kuxni': {
    'Техніка Samsung': { models: ["Мікрохвильові печі", "Духові шафи"], imageUrl: "/Categoryes/samsung-tech.png" },
    'Техніка Bosch': { models: ["Посудомийні машини", "Холодильники"], imageUrl: "/Categoryes/bosch-tech.png" },
    'Техніка TEFAL': { models: ["Мультипечі", "Грилі"], imageUrl: "/Categoryes/tefal-tech.png" },
  },
  'audio-foto-video': {
    'Аудіо Apple': { models: ["AirPods Max", "HomePod"], imageUrl: "/Categoryes/apple-audio.png" },
    'Аудіо Sony': { models: ["WH-1000XM5", "SRS-XG500"], imageUrl: "/Categoryes/sony-audio.png" },
    'Аудіо Marshall': { models: ["Stanmore III", "Major V"], imageUrl: "/Categoryes/marshall-audio.png" },
  },
  'gaming-pro-konsoli': {
      'Консолі Sony': { models: ["PlayStation 5", "PS Portal"], imageUrl: "/Categoryes/sony-console.png" },
      'Консолі Microsoft': { models: ["Xbox Series X", "Xbox Series S"], imageUrl: "/Categoryes/xbox-console.png" },
      'Консолі Nintendo': { models: ["Switch OLED", "Switch Lite"], imageUrl: "/Categoryes/nintendo-console.png" },
  },
  'krasa-i-zdorovya': {
    'Догляд Dyson': { models: ["Стайлери", "Фени"], imageUrl: "/Categoryes/dyson-tech.png" },
    'Догляд Philips': { models: ["Електробритви", "Зубні щітки"], imageUrl: "/Categoryes/philips-tech.png" },
  },
  'dityachi-tovary': {
      'Товари Chicco': { models: ["Автокрісла", "Коляски"], imageUrl: "/Categoryes/default.png" },
      'Товари LEGO': { models: ["Technic", "Star Wars"], imageUrl: "/Categoryes/default.png" },
  },
  zootovary: {
      'Корм Royal Canin': { models: ["Для котів", "Для собак"], imageUrl: "/Categoryes/default.png" },
      'Корм Acana': { models: ["Для котів", "Для собак"], imageUrl: "/Categoryes/default.png" },
  },
  'odjag-vzuttya-ta-prykrasy': {
      'Бренди Nike': { models: ["Кросівки", "Одяг"], imageUrl: "/Categoryes/default.png" },
      'Бренди Adidas': { models: ["Кросівки", "Одяг"], imageUrl: "/Categoryes/default.png" },
  },
  'dim-ta-vydpohnok': {
      'Меблі JYSK': { models: ["Ліжка", "Столи"], imageUrl: "/Categoryes/default.png" },
  },
  'ixa-ta-napoi': {
      'Продукти': { models: ["Кава", "Чай"], imageUrl: "/Categoryes/default.png" },
  },
  'instrumenty-ta-avtovary': {
      'Інструменти Bosch': { models: ["Дрилі", "Шліфмашини"], imageUrl: "/Categoryes/bosch-tech.png" },
      'Інструменти Makita': { models: ["Перфоратори", "Пилки"], imageUrl: "/Categoryes/default.png" },
  },
  'persolalnyj-transpor': {
      'Транспорт': { models: ["Електросамокати", "Велосипеди"], imageUrl: "/Categoryes/default.png" },
  },
  Energozabezpechennya: {
      'Станції EcoFlow': { models: ["RIVER 2", "DELTA Pro"], imageUrl: "/Categoryes/default.png" },
      'Станції Bluetti': { models: ["AC200P", "EB3A"], imageUrl: "/Categoryes/default.png" },
  }
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