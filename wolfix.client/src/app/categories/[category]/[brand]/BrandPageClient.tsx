"use client";

import { useState, useMemo } from 'react';
import { Product } from '../../../data/products';
import Header from '../../../components/Header/Header.client';
import Footer from '../../../components/Footer/Footer';
import FilterSidebar from '../../../components/FilterSidebar/FilterSidebar';
import ProductCard from '../../../components/ProductCard/ProductCard';
import '../../../../styles/ProductPage.css';

interface Filters {
  brands: string[];
  storage: string[];
  ram: string[];
  colors: string[];
  price: { min: number; max: number };
}

interface BrandPageClientProps {
  initialProducts: Product[];
  brand: string;
}

export default function BrandPageClient({ initialProducts, brand }: BrandPageClientProps) {
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);

  const [filters, setFilters] = useState<Filters>({
    brands: [brandName],
    storage: [],
    ram: [],
    colors: [],
    price: { min: 0, max: 150000 },
  });

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const { storage, ram, colors, price } = filters;
      if (storage.length > 0 && !storage.includes(product.specs?.storage || '')) return false;
      if (ram.length > 0 && !ram.includes(product.specs?.ram || '')) return false;
      if (colors.length > 0 && !colors.includes(product.specs?.color || '')) return false;
      if (product.price < price.min || product.price > price.max) return false;
      return true;
    });
  }, [filters, initialProducts]);
  
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters(prevFilters => {
      const currentFilter = prevFilters[filterType as keyof Omit<Filters, 'price'>];
      if (Array.isArray(currentFilter)) {
        const newFilter = currentFilter.includes(value)
          ? currentFilter.filter(item => item !== value)
          : [...currentFilter, value];
        return { ...prevFilters, [filterType]: newFilter };
      }
      return prevFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      brands: [brandName], storage: [], ram: [], colors: [],
      price: { min: 0, max: 150000 },
    });
  };

  return (
    <div className="page-container">
      <Header logoAlt="Wolfix Logo" />
      <main>
        <div className="page-wrapper">
          <div className="breadcrumbs">Головна / Смартфони та телефони / Смартфони {brandName}</div>
          <h1 className="page-title">Смартфони {brandName}</h1>

          <div className="content-wrapper">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              setFilters={setFilters}
            />
            <div className="product-listing">
              <div className="listing-header">
                <span className="product-count">Кількість товарів: {filteredProducts.length}</span>
                <div className="active-filters">
                  <button onClick={clearFilters} className="clear-filters-btn">Очистити все</button>
                  <span className="filter-tag">Бренд: {brandName} <button>×</button></span>
                </div>
                <select className="sort-dropdown">
                  <option>На основі рейтингу</option>
                </select>
              </div>
              <div className="product-grid">
                {filteredProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    oldPrice={product.oldPrice || 0}
                    price={`${new Intl.NumberFormat('uk-UA').format(product.price)} грн`}
                    rating={product.rating}
                    additionalFee={product.additionalFee}
                    imageSrc={product.imageUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}