"use client";

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/app/data/products';
import Header from '../../../components/Header/Header.client';
import Footer from '../../../components/Footer/Footer.server';
import FilterSidebar from '../../../components/FilterSidebar/FilterSidebar.client';
import ProductCard from '../../../components/ProductCard/ProductCard.client';
import "../../../../styles/ProductPage.css";
import { categoryNameMap } from '../../../(utils)/categories.config';

export interface Filters {
  seller: string[];
  brands: string[];
  price: { min: number; max: number };
  series: string[];
  ram: string[];
  storage: string[];
  colors: string[];
  diagonal: string[];
  nfc: string[];
  sd_slot: string[];
  camera_modules: number[];
  camera_mp: string[];
  camera_features: string[];
  country: string[];
  type: string[];
  onSale: boolean;
  purpose: string[];
  material: string[];
  powerSource: string[];
  gender: string[];
  ageRange: string[];
  petType: string[];
  size: string[];
  compatibility: string[];
  strapMaterial: string[];
  powerOutput: string[];
  batteryCapacity: string[];
  maxSpeed: string[];
  range: string[];
  productType: string[];
  volume: string[];
  subCategory: string[];
}

interface BrandPageClientProps {
  initialProducts: Product[];
  brand: string;
  categoryName: string;
}

const initialFiltersState: Filters = {
  seller: [], brands: [], price: { min: 0, max: 200000 }, series: [], ram: [],
  storage: [], colors: [], diagonal: [], nfc: [], sd_slot: [], camera_modules: [],
  camera_mp: [], camera_features: [], country: [], type: [], onSale: false,
  purpose: [], material: [], powerSource: [], gender: [], ageRange: [],
  petType: [], size: [], compatibility: [], strapMaterial: [],
  powerOutput: [], batteryCapacity: [], maxSpeed: [], range: [], 
  productType: [], volume: [], subCategory: [],
};

const filterConfig: { 
  key: keyof Filters; 
  getValue: (p: Product) => any;
  compare?: (productValues: any[], filterValues: any[]) => boolean;
}[] = [
  { key: 'brands', getValue: p => p.brand }, 
  { key: 'seller', getValue: p => p.seller },
  { key: 'country', getValue: p => p.country },
  { key: 'series', getValue: p => p.series },
  { key: 'ram', getValue: p => p.specs.ram },
  { key: 'storage', getValue: p => p.specs.storage },
  { key: 'colors', getValue: p => p.specs.color },
  { key: 'nfc', getValue: p => p.specs.nfc ? 'Так' : 'Ні' },
  { key: 'sd_slot', getValue: p => p.specs.sd_slot ? 'Є' : 'Немає' },
  { 
    key: 'camera_features', 
    getValue: p => p.specs.camera_features,
    compare: (productValues, filterValues) => 
      productValues && filterValues.every(feat => productValues.includes(feat))
  },
];

export default function BrandPageClient({ initialProducts, brand, categoryName }: BrandPageClientProps) {
  const canonicalBrand = useMemo(() => {
    return initialProducts.find(p => p.brand.toLowerCase() === brand.toLowerCase())?.brand || brand;
  }, [initialProducts, brand]);

  const [filters, setFilters] = useState<Filters>({
    ...initialFiltersState,
    brands: [canonicalBrand]
  });

  const internalCategoryName = categoryNameMap[categoryName] || categoryName;

  const categoryProducts = useMemo(() => {
    return initialProducts.filter(p => p.category === internalCategoryName);
  }, [initialProducts, internalCategoryName]);

  useEffect(() => {
    const validSeries = new Set(categoryProducts.filter(p => filters.brands.includes(p.brand)).map(p => p.series));
    if (!filters.series.every(s => validSeries.has(s))) {
      setFilters(prev => ({ ...prev, series: [] }));
    }
  }, [filters.brands, categoryProducts, filters.series]);

  const pageTitle = filters.brands.length === 1 
    ? `${categoryName} ${filters.brands[0]}` 
    : categoryName;

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      const f = filters;
      if (product.price < f.price.min || product.price > f.price.max) return false;
      if (f.onSale && !product.onSale) return false;

      for (const config of filterConfig) {
        const filterValues = f[config.key] as any[];
        if (!filterValues || filterValues.length === 0) continue;
        
        const productValue = config.getValue(product);

        if (config.compare) {
          if (!config.compare(productValue, filterValues)) return false;
        } else {
          if (productValue === undefined || !filterValues.includes(productValue)) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [filters, categoryProducts]);
  
  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    setFilters(prevFilters => {
      const currentFilter = prevFilters[filterType];
      let newFilter;

      if (typeof currentFilter === 'boolean') {
        newFilter = value;
      } else if (Array.isArray(currentFilter)) {
        const arr = currentFilter as any[];
        newFilter = arr.includes(value)
          ? arr.filter((item: any) => item !== value)
          : [...arr, value];
      } else {
        return prevFilters;
      }
      return { ...prevFilters, [filterType]: newFilter };
    });
  };

  const clearFilters = () => {
    setFilters(initialFiltersState);
  };

  return (
    <div className="page-container">
      <Header logoAlt="Wolfix Logo" />
      <main>
        <div className="page-wrapper">
          <div className="breadcrumbs">Головна / {categoryName}</div>
          <h1 className="page-title">{pageTitle}</h1>
          <div className="content-wrapper">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              setFilters={setFilters}
              products={categoryProducts}
              filteredProducts={filteredProducts}
              categoryName={internalCategoryName}
            />
            <div className="product-listing">
              <div className="listing-header">
                <div className="listing-header-left">
                  <span className="product-count">Кількість товарів: {filteredProducts.length}</span>
                  <div className="active-filters">
                    <button onClick={clearFilters} className="clear-filters-btn">Очистити все</button>
                    {filters.brands.map(b => <span key={b} className="filter-tag">{b} <button onClick={() => handleFilterChange('brands', b)}>×</button></span>)}
                  </div>
                </div>
              </div>
              <div className={`product-grid`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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