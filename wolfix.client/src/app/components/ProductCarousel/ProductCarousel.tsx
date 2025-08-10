import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard";
import "../../../styles/ProductCarousel.css";

interface IProductCarouselProps {
  products: {
    id: string;
    name: string;
    oldPrice: number;
    price: string;
    rating: number;
    additionalFee: number;
    imageUrl: string;
  }[];
}

const ProductCarousel: FC<IProductCarouselProps> = ({ products }) => {
  return (
    <div className="product-carousel">
      {products.map((product) => (
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

export default ProductCarousel;