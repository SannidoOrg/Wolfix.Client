"use client";

import { useState, useMemo, useEffect } from 'react';
import { Product } from '../../../data/products';
import Header from '../../../components/Header/Header.client';
import Footer from '../../../components/Footer/Footer';
import FilterSidebar, { DIAGONAL_RANGES, MEGAPIXEL_RANGES } from '../../../components/FilterSidebar/FilterSidebar';
import ProductCard from '../../../components/ProductCard/ProductCard';
import '../../../../styles/ProductPage.css';

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
  onSale: boolean;
}

interface BrandPageClientProps {
  initialProducts: Product[];
  brand: string;
  categoryName: string;
}

export default function BrandPageClient({ initialProducts, brand, categoryName }: BrandPageClientProps) {
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<Filters>({
    seller: [],
    brands: brand ? [brandName] : [],
    price: { min: 0, max: 200000 },
    series: [],
    ram: [],
    storage: [],
    colors: [],
    diagonal: [],
    nfc: [],
    sd_slot: [],
    camera_modules: [],
    camera_mp: [],
    camera_features: [],
    country: [],
    onSale: false,
  });

  useEffect(() => {
    const validSeries = new Set(initialProducts.filter(p => filters.brands.includes(p.brand)).map(p => p.series));
    const selectedSeriesAreValid = filters.series.every(s => validSeries.has(s));
    if (!selectedSeriesAreValid) {
      setFilters(prev => ({ ...prev, series: [] }));
    }
  }, [filters.brands, initialProducts, filters.series]);

  const pageTitle = filters.brands.length === 1 
    ? `${categoryName} ${filters.brands[0]}` 
    : categoryName;

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const { seller, brands, price, series, ram, storage, colors, diagonal, nfc, sd_slot, camera_modules, camera_mp, camera_features, country, onSale } = filters;
      if (brands.length > 0 && !brands.includes(product.brand)) return false;
      if (seller.length > 0 && !seller.includes(product.seller)) return false;
      if (country.length > 0 && !country.includes(product.country)) return false;
      if (product.price < price.min || product.price > price.max) return false;
      if (series.length > 0 && !series.includes(product.series || '')) return false;
      if (ram.length > 0 && !ram.includes(product.specs?.ram || '')) return false;
      if (storage.length > 0 && !storage.includes(product.specs?.storage || '')) return false;
      if (colors.length > 0 && !colors.includes(product.specs?.color || '')) return false;
      if (onSale && !product.onSale) return false;

      if (nfc.length > 0) {
        const productHasNfc = product.specs?.nfc === true;
        if (!nfc.includes(productHasNfc ? 'Так' : 'Ні')) return false;
      }
      
      if (sd_slot.length > 0) {
        const productHasSdSlot = product.specs?.sd_slot === true;
        if (!sd_slot.includes(productHasSdSlot ? 'Є' : 'Немає')) return false;
      }
      
      if (camera_modules.length > 0) {
        if (!product.specs?.camera_modules || !camera_modules.includes(product.specs.camera_modules)) {
            return false;
        }
      }

      if (camera_features.length > 0) {
        if (!product.specs.camera_features || !camera_features.every(feat => product.specs.camera_features!.includes(feat as any))) return false;
      }

      if (diagonal.length > 0) {
        const productDiagonal = parseFloat(product.specs?.diagonal || '0');
        if (!productDiagonal) return false;
        const matches = diagonal.some(rangeKey => {
          const range = DIAGONAL_RANGES[rangeKey as keyof typeof DIAGONAL_RANGES];
          if (!range) return false;
          return productDiagonal >= range.min && productDiagonal < range.max;
        });
        if (!matches) return false;
      }
      if (camera_mp.length > 0) {
        const productMp = product.specs.camera_mp || 0;
        if (!productMp) return false;
        const matches = camera_mp.some(rangeKey => {
          const range = MEGAPIXEL_RANGES[rangeKey as keyof typeof MEGAPIXEL_RANGES];
          if (!range) return false;
          return productMp >= range.min && productMp <= range.max;
        });
        if (!matches) return false;
      }

      return true;
    });
  }, [filters, initialProducts]);
  
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
      seller: [], brands: [], price: { min: 0, max: 200000 }, series: [],
      ram: [], storage: [], colors: [], diagonal: [], nfc: [], sd_slot: [],
      camera_modules: [], camera_mp: [], camera_features: [], country: [], onSale: false,
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
              products={initialProducts}
              filteredProducts={filteredProducts}
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
                <div className="listing-header-right">
                    <select className="sort-dropdown">
                      <option>На основі рейтингу</option>
                    </select>
                    <div className="view-switcher">
                        <button className={`view-btn grid-view ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}></button>
                        <button className={`view-btn list-view ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}></button>
                    </div>
                </div>
              </div>
              <div className={`product-grid ${view === 'list' ? 'list-view' : ''}`}>
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