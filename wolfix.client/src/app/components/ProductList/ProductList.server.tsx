import ProductListClient from "./ProductList.client";
import { allProducts, promoProducts } from "../../data/products";

const ProductList = () => {
  const promotionalProducts = promoProducts || [];
  const allAvailableProducts = allProducts || [];

  return (
    <ProductListClient
      promoProducts={promotionalProducts}
      allProducts={allAvailableProducts}
    />
  );
};

export default ProductList;