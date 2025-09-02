"use client";

import { useState, useMemo, useEffect } from 'react';
import { Product } from '../../../data/products';
import Header from '../../../components/Header/Header.client';
import Footer from '../../../components/Footer/Footer';
import FilterSidebar from '../../../components/FilterSidebar/FilterSidebar';
import ProductCard from '../../../components/ProductCard/ProductCard';
import '../../../../styles/ProductPage.css';
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

const filterConfig: { key: keyof Filters; getValue: (p: Product) => any }[] = [
    { key: 'brands', getValue: p => p.brand }, 
    { key: 'seller', getValue: p => p.seller },
    { key: 'country', getValue: p => p.country }, 
    { key: 'series', getValue: p => p.series },
    { key: 'ram', getValue: p => p.specs.ram }, 
    { key: 'storage', getValue: p => p.specs.storage },
    { key: 'colors', getValue: p => p.specs.color }, 
    { key: 'camera_modules', getValue: p => p.specs.camera_modules },
    { key: 'type', getValue: p => p.specs.type },
    { key: 'purpose', getValue: p => p.specs.purpose },
    { key: 'material', getValue: p => p.specs.material },
    { key: 'powerSource', getValue: p => p.specs.powerSource },
    { key: 'gender', getValue: p => p.specs.gender },
    { key: 'ageRange', getValue: p => p.specs.ageRange },
    { key: 'petType', getValue: p => p.specs.petType },
    { key: 'size', getValue: p => p.specs.size },
    { key: 'compatibility', getValue: p => p.specs.compatibility },
    { key: 'strapMaterial', getValue: p => p.specs.strapMaterial },
    { key: 'powerOutput', getValue: p => p.specs.powerOutput },
    { key: 'batteryCapacity', getValue: p => p.specs.batteryCapacity },
    { key: 'maxSpeed', getValue: p => p.specs.maxSpeed },
    { key: 'range', getValue: p => p.specs.range },
    { key: 'productType', getValue: p => p.specs.productType },
    { key: 'volume', getValue: p => p.specs.volume },
    { key: 'subCategory', getValue: p => p.specs.subCategory },
];

export default function BrandPageClient({ initialProducts, brand, categoryName }: BrandPageClientProps) {
  const [filters, setFilters] = useState<Filters>({
    seller: [], brands: [], price: { min: 0, max: 200000 }, series: [], ram: [],
    storage: [], colors: [], diagonal: [], nfc: [], sd_slot: [], camera_modules: [],
    camera_mp: [], camera_features: [], country: [], type: [], onSale: false,
    purpose: [], material: [], powerSource: [], gender: [], ageRange: [],
    petType: [], size: [], compatibility: [], strapMaterial: [],
    powerOutput: [], batteryCapacity: [], maxSpeed: [], range: [], 
    productType: [], volume: [], subCategory: [],
  });

  const internalCategoryName = categoryNameMap[categoryName] || categoryName;

  const categoryProducts = useMemo(() => {
    return initialProducts.filter(p => p.category === internalCategoryName);
  }, [initialProducts, internalCategoryName]);

  useEffect(() => {
    const validSeries = new Set(categoryProducts.filter(p => filters.brands.includes(p.brand)).map(p => p.series));
    const selectedSeriesAreValid = filters.series.every(s => validSeries.has(s));
    if (!selectedSeriesAreValid) {
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
        if (filterValues && filterValues.length > 0) {
          const productValue = config.getValue(product);
          if (productValue === undefined || !filterValues.includes(productValue)) {
            return false;
          }
        }
      }

      if (f.nfc.length > 0) { const p = product.specs.nfc === true; if (!f.nfc.includes(p ? 'Так' : 'Ні')) return false; }
      if (f.sd_slot.length > 0) { const p = product.specs.sd_slot === true; if (!f.sd_slot.includes(p ? 'Є' : 'Немає')) return false; }
      if (f.camera_features.length > 0) { if (!product.specs.camera_features || !f.camera_features.every(feat => product.specs.camera_features!.includes(feat as any))) return false; }
      
      return true;
    });
  }, [filters, categoryProducts]);
  
  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    setFilters(prevFilters => {
      const currentFilter = prevFilters[filterType];
      let newFilter;
      if (typeof currentFilter === 'boolean') {
        newFilter = !currentFilter;
      } else if (Array.isArray(currentFilter)) {
        newFilter = currentFilter.includes(value as never)
          ? currentFilter.filter(item => item !== value)
          : [...currentFilter, value as never];
      } else {
        return prevFilters;
      }
      return { ...prevFilters, [filterType]: newFilter };
    });
  };

  const clearFilters = () => {
    setFilters({
        seller: [], brands: [], price: { min: 0, max: 200000 }, series: [], ram: [],
        storage: [], colors: [], diagonal: [], nfc: [], sd_slot: [], camera_modules: [],
        camera_mp: [], camera_features: [], country: [], type: [], onSale: false,
        purpose: [], material: [], powerSource: [], gender: [], ageRange: [],
        petType: [], size: [], compatibility: [], strapMaterial: [],
        powerOutput: [], batteryCapacity: [], maxSpeed: [], range: [], 
        productType: [], volume: [], subCategory: [],
    });
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