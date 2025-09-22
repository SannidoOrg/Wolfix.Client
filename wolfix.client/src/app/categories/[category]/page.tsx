'use client';

import {FC, useContext, useEffect} from 'react';
import Header from '../../components/Header/Header.client';
import Footer from '../../components/Footer/Footer.server';
import BrandCard from '../../components/BrandCard/BrandCard.server';
import { categorySlugMap } from '../../(utils)/categories.config';
import { notFound } from 'next/navigation';
import {ProductContext} from "@/contexts/ProductContext";

interface BrandInfo {
  displayName: string;
  brandSlug: string;
  models: string[];
  imageUrl: string;
}

const brandData: { [key: string]: BrandInfo[] } = {
  smartfony: [
    { displayName: 'Смартфони Apple', brandSlug: 'apple', models: ["iPhone 16 Pro", "iPhone 15"], imageUrl: "/Categoryes/image8.png" },
    { displayName: 'Смартфони Samsung', brandSlug: 'samsung', models: ["Galaxy S24", "Galaxy Fold"], imageUrl: "/Categoryes/samsung.png" },
  ],
  noutbuky: [
    { displayName: 'Ноутбуки Apple', brandSlug: 'apple', models: ["MacBook Pro", "MacBook Air"], imageUrl: "/Categoryes/apple-notebook.png" },
    { displayName: 'Ноутбуки ASUS', brandSlug: 'asus', models: ["TUF Gaming", "Zenbook"], imageUrl: "/Categoryes/asus-notebook.png" },
  ],
  televizory: [
    { displayName: 'Телевізори Samsung', brandSlug: 'samsung', models: ["Neo QLED 8K", "OLED 4K"], imageUrl: "/Categoryes/samsung-tv.png" },
    { displayName: 'Телевізори LG', brandSlug: 'lg', models: ["OLED evo", "QNED"], imageUrl: "/Categoryes/lg-tv.png" },
  ],
  'smart-godynnyky': [
    { displayName: 'Годинники Apple', brandSlug: 'apple', models: ["Watch Series 9", "Watch Ultra 2"], imageUrl: "/Categoryes/apple-watch.png" },
    { displayName: 'Годинники Samsung', brandSlug: 'samsung', models: ["Galaxy Watch 6", "Galaxy Fit 3"], imageUrl: "/Categoryes/samsung-watch.png" },
  ],
  'tovary-dlya-domu': [
      { displayName: 'Техніка Roborock', brandSlug: 'roborock', models: ["Роботи-пилососи"], imageUrl: "/Categoryes/roborock.png" },
      { displayName: 'Техніка Philips', brandSlug: 'philips', models: ["Зволожувачі повітря"], imageUrl: "/Categoryes/philips.png" },
  ],
  'pobutova-tekhnika': [
      { displayName: 'Техніка Samsung', brandSlug: 'samsung', models: ["Пральні машини"], imageUrl: "/Categoryes/samsung.png" },
      { displayName: 'Техніка Dyson', brandSlug: 'dyson', models: ["Пилососи"], imageUrl: "/Categoryes/dyson.png" },
  ],
  audiotekhnika: [
      { displayName: 'Аудіо Apple', brandSlug: 'apple', models: ["AirPods"], imageUrl: "/Categoryes/image8.png" },
      { displayName: 'Аудіо Sony', brandSlug: 'sony', models: ["Навушники"], imageUrl: "/Categoryes/sony-tv.png" },
  ],
  heyminh: [
      { displayName: 'Консолі Sony', brandSlug: 'sony', models: ["PlayStation 5"], imageUrl: "/Categoryes/sony-console.png" },
      { displayName: 'Консолі Microsoft', brandSlug: 'microsoft', models: ["Xbox Series X"], imageUrl: "/Categoryes/xbox-console.png" },
  ],
  'krasa-i-zdorovya': [
      { displayName: 'Техніка Dyson', brandSlug: 'dyson', models: ["Стайлери", "Фени"], imageUrl: "/Categoryes/dyson.png" },
      { displayName: 'Техніка Philips', brandSlug: 'philips', models: ["Зубні щітки"], imageUrl: "/Categoryes/philips.png" },
  ],
  'dytyachi-tovary': [
      { displayName: 'Візочки Anex', brandSlug: 'anex', models: ["m/type", "e/type"], imageUrl: "/Categoryes/anex.png" },
      { displayName: 'Конструктори LEGO', brandSlug: 'lego', models: ["Technic", "Creator"], imageUrl: "/Categoryes/lego.png" },
  ],
  zootovary: [
      { displayName: 'Корм Royal Canin', brandSlug: 'royal canin', models: ["Для котів", "Для собак"], imageUrl: "/Categoryes/royalcanin.png" },
      { displayName: 'Аксесуари Petkit', brandSlug: 'petkit', models: ["Автоматичні годівниці"], imageUrl: "/Categoryes/petkit.png" },
  ],
  'odyah-ta-vzuttya': [
      { displayName: 'Одяг та взуття Nike', brandSlug: 'nike', models: ["Кросівки", "Спортивний одяг"], imageUrl: "/Categoryes/nike.png" },
      { displayName: 'Одяг The North Face', brandSlug: 'the north face', models: ["Худі", "Куртки"], imageUrl: "/Categoryes/tnf.png" },
  ],
  instrumenty: [
      { displayName: 'Інструменти Bosch', brandSlug: 'bosch', models: ["Шуруповерти", "Дрилі"], imageUrl: "/Categoryes/bosch.png" },
      { displayName: 'Набори TOPTUL', brandSlug: 'toptul', models: ["Для авто"], imageUrl: "/Categoryes/toptul.png" },
  ],
  enerhozabezpechennya: [
      { displayName: 'Зарядні станції EcoFlow', brandSlug: 'ecoflow', models: ["DELTA", "RIVER"], imageUrl: "/Categoryes/ecoflow.png" },
      { displayName: 'Павербанки Anker', brandSlug: 'anker', models: ["PowerCore", "MagGo"], imageUrl: "/Categoryes/anker.png" },
  ],
  transport: [
      { displayName: 'Електросамокати Xiaomi', brandSlug: 'xiaomi', models: ["Scooter 4 Pro", "Scooter 3 Lite"], imageUrl: "/Categoryes/xiaomi.png" },
      { displayName: 'Електровелосипеди Engwe', brandSlug: 'engwe', models: ["EP-2 Pro", "Engine Pro"], imageUrl: "/Categoryes/engwe.png" },
  ],
  'yizha-ta-napoyi': [
      { displayName: 'Кава Lavazza', brandSlug: 'lavazza', models: ["Qualita Oro", "Espresso"], imageUrl: "/Categoryes/lavazza.png" },
      { displayName: 'Олії Monini', brandSlug: 'monini', models: ["Classico", "Delicato"], imageUrl: "/Categoryes/monini.png" },
  ],
  'dim-ta-vidpochynok': [
      { displayName: 'Спорядження Terra Incognita', brandSlug: 'terra incognita', models: ["Намети", "Спальники"], imageUrl: "/Categoryes/terra.png" },
      { displayName: 'Спорттовари 4FIZJO', brandSlug: '4fizjo', models: ["Гантелі", "Килимки"], imageUrl: "/Categoryes/4fizjo.png" },
  ]
};

const CategoryPage: FC<{ params: { category: string } }> = ({ params }) => {
  const { category } = params;
  const categoryName = categorySlugMap[category] || 'Категорія';
  const categoryBrands = brandData[category] || [];

  // const {fetchProductsByCategory, products} = useContext(ProductContext)!;
  //
  // if (categoryBrands.length === 0) {
  //   return notFound();
  // }
  //
  // //todo
  // useEffect(() => {
  //     fetchProductsByCategory()
  // }, []);

  return (
    <div className="page-container">
      <Header logoAlt="Wolfix Logo" />
      <main className="main-content-category">
        <div className="breadcrumbs">Головна / {categoryName}</div>
        <h1 className="category-title">{categoryName}</h1>
        <div className="cards-grid">
          {categoryBrands.map((brandInfo) => (
            <BrandCard
              key={brandInfo.displayName}
              category={category}
              brandName={brandInfo.displayName}
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