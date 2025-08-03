import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard";

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
  ];

  return (
    <div className="product-list">
      <div className="separator-container">
        <span className="separator-text">Акційні товари</span>
        <div className="separator-line" />
      </div>
      {productData.map((product) => (
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
  );
};

export default ProductList;