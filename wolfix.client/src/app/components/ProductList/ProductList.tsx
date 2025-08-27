"use client";

import { FC, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import "../../../styles/ProductList.css";

interface IProductListProps {}

const ProductList: FC<IProductListProps> = () => {
const productData = [
  { id: "1", name: "Ноутбук Apple MacBook Air 13 M1 (MGN63) Space Grey", price: "30 999 грн", oldPrice: 34999, rating: 4.61, additionalFee: 310, imageUrl: "/test.png" },
  { id: "2", name: "Подушка класична Кримдур Мамонт Базальт", price: "2 000 грн", oldPrice: 2500, rating: 5, additionalFee: 20, imageUrl: "/test.png" },
  { id: "3", name: "Пральна машина Samsung WW60A2100WW", price: "13 999 грн", oldPrice: 15999, rating: 4.5, additionalFee: 140, imageUrl: "/test.png" },
  { id: "4", name: "Планшет Lenovo Tab Plus Wi-Fi 8/256GB Luna Grey", price: "12 999 грн", oldPrice: 14999, rating: 4.6, additionalFee: 130, imageUrl: "/test.png" },
  { id: "5", name: "Крісло ігрове Anda Seat T-Pro 2 XL Linen Fabric Black", price: "17 999 грн", oldPrice: 19999, rating: 4.52, additionalFee: 180, imageUrl: "/test.png" },
  { id: "6", name: "Камін електричний 3kW Art-Flamme Fashion", price: "39 000 грн", oldPrice: 45000, rating: 5, additionalFee: 390, imageUrl: "/test.png" },
  { id: "7", name: "Смартфон Apple iPhone 16 Pro Max 512Gb Desert Titanium", price: "73 000 грн", oldPrice: 79999, rating: 4.6, additionalFee: 730, imageUrl: "/test.png" },
  { id: "8", name: "Смартфон Apple iPhone 15 256Gb Pink", price: "39 000 грн", oldPrice: 45999, rating: 4.8, additionalFee: 390, imageUrl: "/test.png" },
  { id: "9", name: "Ігрова приставка Sony PlayStation 5 Slim Blu-ray", price: "29 999 грн", oldPrice: 34999, rating: 4.75, additionalFee: 300, imageUrl: "/test.png" },
  { id: "10", name: "Автокрісло Britax-Römer KidFix Pro M Style Dusty Rose", price: "10 540 грн", oldPrice: 12999, rating: 5, additionalFee: 105, imageUrl: "/test.png" },
  { id: "11", name: "Телевизор Samsung QLED 55Q70A", price: "25 000 грн", oldPrice: 27999, rating: 4.7, additionalFee: 250, imageUrl: "/test.png" },
  { id: "12", name: "Наушники Sony WH-1000XM5", price: "7 999 грн", oldPrice: 8999, rating: 4.9, additionalFee: 80, imageUrl: "/test.png" },
  { id: "13", name: "Холодильник Bosch Serie 6", price: "18 999 грн", oldPrice: 20999, rating: 4.6, additionalFee: 190, imageUrl: "/test.png" },
  { id: "14", name: "Фотокамера Canon EOS R6", price: "45 000 грн", oldPrice: 49999, rating: 4.8, additionalFee: 450, imageUrl: "/test.png" },
  { id: "15", name: "Смартфон Samsung Galaxy S24 Ultra 512Gb Titanium Gray", price: "42 999 грн", oldPrice: 47999, rating: 4.7, additionalFee: 430, imageUrl: "/test.png" },
  { id: "16", name: "Пилосос Dyson V15 Detect Absolute", price: "28 999 грн", oldPrice: 32999, rating: 4.85, additionalFee: 290, imageUrl: "/test.png" },
  { id: "17", name: "Мікрохвильова піч LG MH6535GIS", price: "6 500 грн", oldPrice: 7499, rating: 4.6, additionalFee: 65, imageUrl: "/test.png" },
  { id: "18", name: "Смарт-годинник Apple Watch Series 9 45mm", price: "15 999 грн", oldPrice: 17999, rating: 4.9, additionalFee: 160, imageUrl: "/test.png" },
  { id: "19", name: "Ноутбук ASUS ROG Strix G15", price: "35 000 грн", oldPrice: 39999, rating: 4.7, additionalFee: 350, imageUrl: "/test.png" },
  { id: "20", name: "Кавоварка De'Longhi Magnifica S", price: "9 999 грн", oldPrice: 11999, rating: 4.8, additionalFee: 100, imageUrl: "/test.png" },
  { id: "21", name: "Сушильна машина Bosch Serie 8", price: "22 999 грн", oldPrice: 25999, rating: 4.7, additionalFee: 230, imageUrl: "/test.png" },
  { id: "22", name: "Електросамокат Xiaomi Pro 2", price: "14 999 грн", oldPrice: 16999, rating: 4.6, additionalFee: 150, imageUrl: "/test.png" },
  { id: "23", name: "Монітор Dell UltraSharp U2720Q", price: "19 999 грн", oldPrice: 22999, rating: 4.8, additionalFee: 200, imageUrl: "/test.png" },
  { id: "24", name: "Кухонний комбайн Bosch MUM9", price: "11 999 грн", oldPrice: 13999, rating: 4.7, additionalFee: 120, imageUrl: "/test.png" },
  { id: "25", name: "Смартфон Google Pixel 9 Pro", price: "38 999 грн", oldPrice: 44999, rating: 4.9, additionalFee: 390, imageUrl: "/test.png" },
  { id: "26", name: "Бездротові навушники JBL Live Pro 2", price: "4 999 грн", oldPrice: 5999, rating: 4.6, additionalFee: 50, imageUrl: "/test.png" },
  { id: "27", name: "Тостер Philips HD2582", price: "1 999 грн", oldPrice: 2499, rating: 4.5, additionalFee: 20, imageUrl: "/test.png" },
  { id: "28", name: "Пилосос робот iRobot Roomba i7+", price: "25 999 грн", oldPrice: 29999, rating: 4.7, additionalFee: 260, imageUrl: "/test.png" },
  { id: "29", name: "Ноутбук Lenovo Legion 5", price: "32 999 грн", oldPrice: 37999, rating: 4.6, additionalFee: 330, imageUrl: "/test.png" },
  { id: "30", name: "Електрокамін Dimplex Opti-Myst", price: "15 999 грн", oldPrice: 17999, rating: 4.8, additionalFee: 160, imageUrl: "/test.png" },
  { id: "31", name: "Смартфон OnePlus 12", price: "29 999 грн", oldPrice: 34999, rating: 4.7, additionalFee: 300, imageUrl: "/test.png" },
  { id: "32", name: "Планшет Samsung Galaxy Tab S9", price: "18 999 грн", oldPrice: 21999, rating: 4.6, additionalFee: 190, imageUrl: "/test.png" },
  { id: "33", name: "Кавомолка Bosch TSM6A013B", price: "1 500 грн", oldPrice: 1999, rating: 4.5, additionalFee: 15, imageUrl: "/test.png" },
  { id: "34", name: "Телевизор LG OLED C3 55", price: "40 999 грн", oldPrice: 45999, rating: 4.9, additionalFee: 410, imageUrl: "/test.png" },
  { id: "35", name: "Блендер Philips HR3571", price: "3 999 грн", oldPrice: 4999, rating: 4.6, additionalFee: 40, imageUrl: "/test.png" },
  { id: "36", name: "Смарт-лампа Philips Hue White", price: "1 299 грн", oldPrice: 1699, rating: 4.7, additionalFee: 13, imageUrl: "/test.png" },
  { id: "37", name: "Клавіатура Logitech G Pro X", price: "4 500 грн", oldPrice: 5499, rating: 4.8, additionalFee: 45, imageUrl: "/test.png" },
  { id: "38", name: "Геймпад Xbox Series X Controller", price: "2 499 грн", oldPrice: 2999, rating: 4.6, additionalFee: 25, imageUrl: "/test.png" },
  { id: "39", name: "Мультиварка Redmond RMC-M90", price: "3 499 грн", oldPrice: 3999, rating: 4.7, additionalFee: 35, imageUrl: "/test.png" },
  { id: "40", name: "Ноутбук HP Spectre x360 14", price: "45 999 грн", oldPrice: 49999, rating: 4.9, additionalFee: 460, imageUrl: "/test.png" },
  ];
  
  const productData2 = [
    { id: "1", name: "Ноутбук Apple MacBook Air 13 M1 (MGN63) Space Grey", price: "30 999 грн", oldPrice: 34999, rating: 4.61, additionalFee: 310, imageUrl: "/test.png" },
    { id: "2", name: "Подушка класична Кримдур Мамонт Базальт", price: "2 000 грн", oldPrice: 2500, rating: 5, additionalFee: 20, imageUrl: "/test.png" },
    { id: "3", name: "Пральна машина Samsung WW60A2100WW", price: "13 999 грн", oldPrice: 15999, rating: 4.5, additionalFee: 140, imageUrl: "/test.png" },
    { id: "4", name: "Планшет Lenovo Tab Plus Wi-Fi 8/256GB Luna Grey", price: "12 999 грн", oldPrice: 14999, rating: 4.6, additionalFee: 130, imageUrl: "/test.png" },
    { id: "5", name: "Крісло ігрове Anda Seat T-Pro 2 XL Linen Fabric Black", price: "17 999 грн", oldPrice: 19999, rating: 4.52, additionalFee: 180, imageUrl: "/test.png" },
    { id: "6", name: "Камін електричний 3kW Art-Flamme Fashion", price: "39 000 грн", oldPrice: 45000, rating: 5, additionalFee: 390, imageUrl: "/test.png" },
    { id: "7", name: "Смартфон Apple iPhone 16 Pro Max 512Gb Desert Titanium", price: "73 000 грн", oldPrice: 79999, rating: 4.6, additionalFee: 730, imageUrl: "/test.png" },
    { id: "8", name: "Смартфон Apple iPhone 15 256Gb Pink", price: "39 000 грн", oldPrice: 45999, rating: 4.8, additionalFee: 390, imageUrl: "/test.png" },
    { id: "9", name: "Ігрова приставка Sony PlayStation 5 Slim Blu-ray", price: "29 999 грн", oldPrice: 34999, rating: 4.75, additionalFee: 300, imageUrl: "/test.png" },
    { id: "10", name: "Автокрісло Britax-Römer KidFix Pro M Style Dusty Rose", price: "10 540 грн", oldPrice: 12999, rating: 5, additionalFee: 105, imageUrl: "/test.png" },
    { id: "11", name: "Телевизор Samsung QLED 55Q70A", price: "25 000 грн", oldPrice: 27999, rating: 4.7, additionalFee: 250, imageUrl: "/test.png" },
    { id: "12", name: "Наушники Sony WH-1000XM5", price: "7 999 грн", oldPrice: 8999, rating: 4.9, additionalFee: 80, imageUrl: "/test.png" },
    { id: "13", name: "Холодильник Bosch Serie 6", price: "18 999 грн", oldPrice: 20999, rating: 4.6, additionalFee: 190, imageUrl: "/test.png" },
    { id: "14", name: "Фотокамера Canon EOS R6", price: "45 000 грн", oldPrice: 49999, rating: 4.8, additionalFee: 450, imageUrl: "/test.png" },
    { id: "15", name: "Смартфон Samsung Galaxy S24 Ultra 512Gb Titanium Gray", price: "42 999 грн", oldPrice: 47999, rating: 4.7, additionalFee: 430, imageUrl: "/test.png" },
    { id: "16", name: "Пилосос Dyson V15 Detect Absolute", price: "28 999 грн", oldPrice: 32999, rating: 4.85, additionalFee: 290, imageUrl: "/test.png" },
    { id: "17", name: "Мікрохвильова піч LG MH6535GIS", price: "6 500 грн", oldPrice: 7499, rating: 4.6, additionalFee: 65, imageUrl: "/test.png" },
    { id: "18", name: "Смарт-годинник Apple Watch Series 9 45mm", price: "15 999 грн", oldPrice: 17999, rating: 4.9, additionalFee: 160, imageUrl: "/test.png" },
    { id: "19", name: "Ноутбук ASUS ROG Strix G15", price: "35 000 грн", oldPrice: 39999, rating: 4.7, additionalFee: 350, imageUrl: "/test.png" },
    { id: "20", name: "Кавоварка De'Longhi Magnifica S", price: "9 999 грн", oldPrice: 11999, rating: 4.8, additionalFee: 100, imageUrl: "/test.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + productData2.length) % productData2.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productData2.length);
  };

  const totalSteps = productData2.length - 1;
  const progressWidth = totalSteps > 0 ? `${(currentIndex / totalSteps) * 100}%` : "0%";

  const itemsPerRow = 4;
  const firstSection = productData.slice(0, itemsPerRow * 3);
  const remainingSection = productData.slice(itemsPerRow * 3);

  const [visibleProducts, setVisibleProducts] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => Math.min(prev + 4, productData.length));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="product-list">
      <div className="separator-container">
        <span className="separator-text">Акційні товари</span>
        <div className="separator-line" />
      </div>
      <ProductCarousel
        products={productData2}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: progressWidth }}></div>
      </div>
      <div className="separator-container">
        <span className="separator-text">Всі товари</span>
        <div className="separator-line2" />
      </div>
      <div className="custom-product-list2">
        {firstSection.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            oldPrice={product.oldPrice}
            price={product.price}
            rating={product.rating}
            additionalFee={product.additionalFee}
            imageSrc={product.imageUrl}
          />
        ))}
      </div>
      <div className="custom-product-list">
        <div className="custom-separator" />
        <div className="custom-banner">
          <img src="/banners/Banner_4.png" alt="Banner" />
        </div>
        <div className="custom-separator" />
        {remainingSection.slice(0, visibleProducts - itemsPerRow * 3).map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            oldPrice={product.oldPrice}
            price={product.price}
            rating={product.rating}
            additionalFee={product.additionalFee}
            imageSrc={product.imageUrl}
          />
        ))}
        {visibleProducts < productData.length && (
          <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default ProductList;