"use client";

import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard.client";
import { Product } from "../../data/products";

interface ISearchResultsProps {
  products: Product[];
}

const SearchResults: FC<ISearchResultsProps> = ({ products }) => {
  return (
    <div className="product-list-wrapper">
      <div className="separator-container">
        <span className="separator-text">
          {products.length > 0 ? `Знайдено товарів: ${products.length}` : 'Товари не знайдено'}
        </span>
        <div className="separator-line" />
      </div>
      <div className="products-grid">
        
      </div>
    </div>
  );
};

export default SearchResults;