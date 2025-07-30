import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard";

interface IProductListProps {}

const ProductList: FC<IProductListProps> = () => {
  const productData = [
    { id: "1", name: "Ноутбук Apple MacBook Air 13 M1 (MGN63) Space Grey", price: "30 999 грн", imageUrl: "/macbook.jpg" },
    { id: "2", name: "Подушка класична Кримдур Мамонт Базальт", price: "2 000 грн", imageUrl: "/pillow.jpg" },
    { id: "3", name: "Пральна машина Samsung WW60A2100WW", price: "13 999 грн", imageUrl: "/washer.jpg" },
    { id: "4", name: "Планшет Lenovo Tab Plus Wi-Fi 8/256GB Luna Grey", price: "12 999 грн", imageUrl: "/tablet.jpg" },
    { id: "5", name: "Крісло ігрове Anda Seat T-Pro 2 XL Linen Fabric Black", price: "17 999 грн", imageUrl: "/chair.jpg" },
    { id: "6", name: "Камін електричний 3kW Art-Flamme Fashion", price: "39 000 грн", imageUrl: "/fireplace.jpg" },
    { id: "7", name: "Смартфон Apple iPhone 16 Pro Max 512Gb Desert Titanium", price: "73 000 грн", imageUrl: "/iphone16.jpg" },
    { id: "8", name: "Смартфон Apple iPhone 15 256Gb Pink", price: "39 000 грн", imageUrl: "/iphone15.jpg" },
    { id: "9", name: "Ігрова приставка Sony PlayStation 5 Slim Blu-ray", price: "29 999 грн", imageUrl: "/ps5.jpg" },
    { id: "10", name: "Автокрісло Britax-Römer KidFix Pro M Style Dusty Rose", price: "10 540 грн", imageUrl: "/carseat.jpg" },
  ];

  return (
    <div className="product-list">
      {productData.map((product) => (
        <ProductCard key={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl} />
      ))}
    </div>
  );
};

export default ProductList;