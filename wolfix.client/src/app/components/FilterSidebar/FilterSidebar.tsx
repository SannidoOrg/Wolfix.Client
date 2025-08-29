"use client";

import React, { useState } from 'react';
import { Filters } from '../../categories/[category]/[brand]/BrandPageClient';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: any) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
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

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, setFilters }) => {
  const allBrands = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Oppo', 'Poco', 'Infinix', 'realme', 'Nokia', 'OnePlus', 'Google', 'Asus'];
  const [visibleBrands, setVisibleBrands] = useState(7);
  
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