"use client";

import React, { useState, useMemo } from 'react';
import { Filters } from '../../categories/[category]/[brand]/BrandPageClient';
import { Product } from '../../data/products';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: any) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  products: Product[];
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="filter-section">
      <h3 className="filter-title" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className={`chevron ${isOpen ? 'expanded' : ''}`}></span>
      </h3>
      {isOpen && <div className="filter-content">{children}</div>}
    </div>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, setFilters, products }) => {
  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))], [products]);
  
  const availableSeries = useMemo(() => {
    if (filters.brands.length === 0) return [];
    
    const seriesForSelectedBrands = products
      .filter(p => filters.brands.includes(p.brand) && p.series)
      .map(p => p.series!);
    return [...new Set(seriesForSelectedBrands)];
  }, [filters.brands, products]);
  
  const availableColors = useMemo(() => {
    const colors = products.map(p => p.specs?.color).filter(Boolean);
    return [...new Set(colors)] as string[];
  }, [products]);

  const [visibleBrands, setVisibleBrands] = useState(7);
  const [visibleSeries, setVisibleSeries] = useState(7);
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value === '' ? (type === 'min' ? 0 : 200000) : Number(e.target.value);
    setFilters(prev => ({ ...prev, price: { ...prev.price, [type]: value } }));
  };

  return (
    <aside className="filter-sidebar">
       <FilterSection title="Продавець">
        {['Wolfix', 'Інші'].map(seller => (
          <div key={seller} className="filter-item">
            <input type="checkbox" id={`seller-${seller}`} checked={filters.seller.includes(seller)} onChange={() => onFilterChange('seller', seller)} />
            <label htmlFor={`seller-${seller}`}>{seller}</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Бренд">
        <input type="text" className="filter-search" placeholder="Пошук" />
        {allBrands.slice(0, visibleBrands).map(brand => (
          <div key={brand} className="filter-item">
            <input type="checkbox" id={`brand-${brand}`} checked={filters.brands.includes(brand)} onChange={() => onFilterChange('brands', brand)} />
            <label htmlFor={`brand-${brand}`}>{brand}</label>
          </div>
        ))}
        {visibleBrands < allBrands.length && (
          <button className="show-more-btn" onClick={() => setVisibleBrands(allBrands.length)}>
            Показати ще ({allBrands.length - visibleBrands})
          </button>
        )}
      </FilterSection>
      
      {filters.brands.length > 0 && availableSeries.length > 0 && (
        <FilterSection title="Серія">
          <input type="text" className="filter-search" placeholder="Пошук" />
          {availableSeries.slice(0, visibleSeries).map(series => (
            <div key={series} className="filter-item">
              <input type="checkbox" id={`series-${series}`} checked={filters.series.includes(series)} onChange={() => onFilterChange('series', series)} />
              <label htmlFor={`series-${series}`}>{series}</label>
            </div>
          ))}
          {visibleSeries < availableSeries.length && (
            <button className="show-more-btn" onClick={() => setVisibleSeries(availableSeries.length)}>
              Показати ще ({availableSeries.length - visibleSeries})
            </button>
          )}
        </FilterSection>
      )}

      <FilterSection title="Колір">
        {availableColors.map(color => (
          <div key={color} className="filter-item">
            <input type="checkbox" id={`color-${color}`} checked={filters.colors.includes(color)} onChange={() => onFilterChange('colors', color)} />
            <label htmlFor={`color-${color}`}>{color}</label>
          </div>
        ))}
      </FilterSection>
      
      <FilterSection title="Ціна">
        <div className="price-inputs">
          <input type="number" placeholder="від" value={filters.price.min || ''} onChange={e => handlePriceChange(e, 'min')} />
          <span>–</span>
          <input type="number" placeholder="до" value={filters.price.max || ''} onChange={e => handlePriceChange(e, 'max')} />
        </div>
      </FilterSection>

      <div className="filter-item sale-only">
        <input type="checkbox" id="sale" checked={filters.onSale} onChange={() => onFilterChange('onSale', !filters.onSale)} />
        <label htmlFor="sale">Тільки акційні товари</label>
      </div>
    </aside>
  );
};

export default FilterSidebar;