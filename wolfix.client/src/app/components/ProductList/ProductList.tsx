"use client";

import { FC, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import "../../../styles/ProductList.css";

interface IProductListProps {}

const ProductList: FC<IProductListProps> = () => {
  const allProducts = [
    { id: "7", name: "Смартфон Apple iPhone 16 Pro Max 512Gb Desert Titanium", price: "73 009 грн", oldPrice: 77999, rating: 4.6, additionalFee: 730, imageUrl: "/test.png" },
    { id: "8", name: "Смартфон Apple iPhone 15 256Gb Pink", price: "39 009 грн", oldPrice: 42499, rating: 4.8, additionalFee: 390, imageUrl: "/test.png" },
    { id: "9", name: "Ігрова приставка Sony PlayStation 5 Slim Blu-ray (2 геймпади DualSense)", price: "29 999 грн", oldPrice: 31999, rating: 4.75, additionalFee: 300, imageUrl: "/test.png" },
    { id: "10", name: "Автокрісло Britax-Römer KidFix Pro M Style Dusty Rose", price: "10 540 грн", oldPrice: 12999, rating: 5, additionalFee: 105, imageUrl: "/test.png" },
    { id: "11", name: "Кавомашина PHILIPS Series 4300 LatteGo EP4346/71", price: "25 999 грн", oldPrice: 28999, rating: 4.52, additionalFee: 260, imageUrl: "/test.png" },
    { id: "12", name: "Мультипіч TEFAL Air Fry&Grill EY501815", price: "4 499 грн", oldPrice: 5999, rating: 4.89, additionalFee: 45, imageUrl: "/test.png" },
    { id: "13", name: "Портативна зарядна станція EcoFlow DELTA 2 (ZMR330-EU, CN)", price: "25 500 грн", oldPrice: 29999, rating: 4.8, additionalFee: 255, imageUrl: "/test.png" },
    { id: "14", name: "Акустична система Marshall Lauder Stanmore III Bluetooth", price: "17 999 грн", oldPrice: 19999, rating: 5, additionalFee: 180, imageUrl: "/test.png" },
    { id: "15", name: "Квадрокоптер DJI Mavic 4 Fly More Combo with DJI RC 2", price: "117 849 грн", oldPrice: 125999, rating: 4.86, additionalFee: 1178, imageUrl: "/test.png" },
    { id: "16", name: "Робот-пилосос Rowenta X-PLORER Serie 140 RR9177WH", price: "15 999 грн", oldPrice: 19999, rating: 4.86, additionalFee: 160, imageUrl: "/test.png" },
    { id: "17", name: "Очищувач повітря міні LEVOIT CORE", price: "3 500 грн", oldPrice: 4500, rating: 5, additionalFee: 35, imageUrl: "/test.png" },
    { id: "18", name: "Навушники Apple AirPods (MXP63ZGE/A)", price: "7 599 грн", oldPrice: 8999, rating: 4.45, additionalFee: 76, imageUrl: "/test.png" },
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
  const promoProducts = [...allProducts].reverse().slice(0, 20);
  
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePrev = () => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : promoProducts.length - 4));
  const handleNext = () => setCarouselIndex((prev) => (prev < promoProducts.length - 4 ? prev + 1 : 0));

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProductsCount((prev) => prev + 4);
      setIsLoading(false);
    }, 1000);
  };
  
  const totalSteps = promoProducts.length > 4 ? promoProducts.length - 4 : 0;
  const progressWidth = totalSteps > 0 ? `${(carouselIndex / totalSteps) * 100}%` : "0%";

  const initialGridProducts = allProducts.slice(0, 12);
  const remainingProducts = allProducts.slice(12, visibleProductsCount);

  return (
    <div className="product-list-wrapper">
      <div className="separator-container">
        <span className="separator-text">Акційні товари</span>
        <div className="separator-line" />
      </div>
      <ProductCarousel
        products={promoProducts}
        currentIndex={carouselIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: progressWidth }}></div>
      </div>

      <div className="separator-container">
        <span className="separator-text">Всі товари</span>
        <div className="separator-line" />
      </div>
      <div className="products-grid">
        {initialGridProducts.map((product) => (
          <ProductCard key={product.id} {...product} imageSrc={product.imageUrl} />
        ))}
      </div>

      {allProducts.length > 12 && (
        <>
          <div className="custom-separator" />
          <div className="custom-banner">
            <img src="/banners/Banner_4.png" alt="Продавайте легко з Wolfix" />
          </div>
          <div className="custom-separator" />

          <div className="products-grid">
            {remainingProducts.map((product) => (
              <ProductCard key={product.id} {...product} imageSrc={product.imageUrl} />
            ))}
          </div>
        </>
      )}

      {visibleProductsCount < allProducts.length && (
        <div className="load-more-container">
          <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ProductList;