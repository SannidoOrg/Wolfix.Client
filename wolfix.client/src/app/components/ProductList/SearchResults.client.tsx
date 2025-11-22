// src/app/components/ProductList/SearchResults.client.tsx
"use client";

import { FC } from "react";
import ProductCard from "../ProductCard/ProductCard.client";
import { ProductShortDto } from "@/types/product"; // Используем DTO

interface ISearchResultsProps {
    products: ProductShortDto[]; // Обновленный тип
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
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;