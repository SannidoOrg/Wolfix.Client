"use client";

import React from 'react';

interface Filters {
  brands: string[];
  storage: string[];
  ram: string[];
  colors: string[];
  price: { min: number; max: number };
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, setFilters }) => {
  const ramOptions = ['8GB', '12GB', '16GB'];
  const storageOptions = ['128GB', '256GB', '512GB', '1TB'];
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value === '' ? (type === 'min' ? 0 : 150000) : Number(e.target.value);
    setFilters(prev => ({
      ...prev,
      price: { ...prev.price, [type]: value }
    }));
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">Ціна</h3>
        <div className="price-inputs">
          <input 
            type="number" 
            placeholder="від"
            value={filters.price.min || ''}
            onChange={(e) => handlePriceChange(e, 'min')}
          />
          <span>–</span>
          <input 
            type="number" 
            placeholder="до"
            value={filters.price.max || ''}
            onChange={(e) => handlePriceChange(e, 'max')}
          />
        </div>
      </div>
      <div className="filter-section">
        <h3 className="filter-title">Обсяг оперативної пам'яті</h3>
        {ramOptions.map(ram => (
          <div key={ram} className="filter-item">
            <input
              type="checkbox"
              id={ram}
              checked={filters.ram.includes(ram)}
              onChange={() => onFilterChange('ram', ram)}
            />
            <label htmlFor={ram}>{ram}</label>
          </div>
        ))}
      </div>
       <div className="filter-section">
        <h3 className="filter-title">Обсяг вбудованої пам'яті</h3>
        {storageOptions.map(storage => (
          <div key={storage} className="filter-item">
            <input
              type="checkbox"
              id={storage}
              checked={filters.storage.includes(storage)}
              onChange={() => onFilterChange('storage', storage)}
            />
            <label htmlFor={storage}>{storage}</label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;