"use client";

import React, { useState, useMemo } from 'react';
import { Filters } from '../../categories/[category]/[brand]/BrandPageClient';
import { Product } from '../../data/products';
import { categoryFilters, FilterConfig } from '../../(utils)/filter.config';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: any) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  products: Product[];
  filteredProducts: Product[];
  categoryName: string;
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

const CheckboxFilter: React.FC<{
  title: string;
  filterKey: keyof Filters;
  options: (string | number)[];
  counts: { [key: string]: number };
  selectedValues: readonly (string | number)[];
  onFilterChange: (filterType: keyof Filters, value: any) => void;
}> = ({ title, filterKey, options, counts, selectedValues, onFilterChange }) => {
  if (options.length === 0) return null;
  return (
    <FilterSection title={title}>
      {options.map(option => (
        (counts[option] > 0 || selectedValues.includes(option)) &&
        <div key={option} className="filter-item">
          <input
            type="checkbox"
            id={`${filterKey}-${option}`}
            checked={selectedValues.includes(option)}
            onChange={() => onFilterChange(filterKey, option)}
          />
          <label htmlFor={`${filterKey}-${option}`}>{option} ({counts[option] || 0})</label>
        </div>
      ))}
    </FilterSection>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, setFilters, products, categoryName }) => {

  const calculateCounts = (filterKeyToCount: keyof Filters) => {
    const counts: { [key: string]: number } = {};
    const otherFilters = { ...filters };
    //@ts-ignore
    otherFilters[filterKeyToCount] = [];

    products.forEach(product => {
        let isVisible = true;
        for (const key in otherFilters) {
            if (key === 'price') continue;
            const filterValue = otherFilters[key as keyof Filters] as any[];
            if (Array.isArray(filterValue) && filterValue.length > 0) {
                let productValue: any;
                switch(key) {
                    case 'brands': productValue = product.brand; break;
                    case 'seller': productValue = product.seller; break;
                    case 'country': productValue = product.country; break;
                    case 'series': productValue = product.series; break;
                    case 'ram': productValue = product.specs.ram; break;
                    case 'storage': productValue = product.specs.storage; break;
                    case 'colors': productValue = product.specs.color; break;
                    case 'camera_modules': productValue = product.specs.camera_modules; break;
                    case 'type': productValue = product.specs.type; break;
                    case 'purpose': productValue = product.specs.purpose; break;
                    case 'material': productValue = product.specs.material; break;
                    case 'powerSource': productValue = product.specs.powerSource; break;
                    case 'gender': productValue = product.specs.gender; break;
                    case 'ageRange': productValue = product.specs.ageRange; break;
                    case 'petType': productValue = product.specs.petType; break;
                    case 'size': productValue = product.specs.size; break;
                    case 'compatibility': productValue = product.specs.compatibility; break;
                    case 'strapMaterial': productValue = product.specs.strapMaterial; break;
                    case 'powerOutput': productValue = product.specs.powerOutput; break;
                    case 'batteryCapacity': productValue = product.specs.batteryCapacity; break;
                    case 'maxSpeed': productValue = product.specs.maxSpeed; break;
                    case 'range': productValue = product.specs.range; break;
                    case 'productType': productValue = product.specs.productType; break;
                    case 'volume': productValue = product.specs.volume; break;
                    case 'subCategory': productValue = product.specs.subCategory; break;
                    case 'nfc': productValue = product.specs.nfc === true ? 'Так' : 'Ні'; break;
                    case 'sd_slot': productValue = product.specs.sd_slot === true ? 'Є' : 'Немає'; break;
                    default: productValue = null;
                }
                if (productValue && !filterValue.includes(productValue as never)) {
                    isVisible = false;
                    break;
                }
            }
        }
        
        if (isVisible) {
            let value: any;
            switch(filterKeyToCount) {
                case 'brands': value = product.brand; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'seller': value = product.seller; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'country': value = product.country; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'ram': value = product.specs.ram; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'storage': value = product.specs.storage; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'colors': value = product.specs.color; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'series': value = product.series; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'camera_modules': value = product.specs.camera_modules; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'type': value = product.specs.type; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'purpose': value = product.specs.purpose; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'material': value = product.specs.material; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'powerSource': value = product.specs.powerSource; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'gender': value = product.specs.gender; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'ageRange': value = product.specs.ageRange; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'petType': value = product.specs.petType; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'size': value = product.specs.size; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'compatibility': value = product.specs.compatibility; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'strapMaterial': value = product.specs.strapMaterial; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'powerOutput': value = product.specs.powerOutput; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'batteryCapacity': value = product.specs.batteryCapacity; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'maxSpeed': value = product.specs.maxSpeed; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'range': value = product.specs.range; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'productType': value = product.specs.productType; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'volume': value = product.specs.volume; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'subCategory': value = product.specs.subCategory; if(value) counts[value] = (counts[value] || 0) + 1; break;
                case 'nfc': if(product.specs.nfc !== undefined) { value = product.specs.nfc ? 'Так' : 'Ні'; counts[value] = (counts[value] || 0) + 1; } break;
                case 'sd_slot': if(product.specs.sd_slot !== undefined) { value = product.specs.sd_slot ? 'Є' : 'Немає'; counts[value] = (counts[value] || 0) + 1; } break;
                case 'camera_features': if (product.specs.camera_features) { product.specs.camera_features.forEach(f => { counts[f] = (counts[f] || 0) + 1; }); } break;
            }
        }
    });
    return counts;
  };
  
  const allCounts = useMemo(() => {
    const counts: { [key: string]: { [value: string]: number } } = {};
    const filterKeys: (keyof Filters)[] = [
        'brands', 'seller', 'country', 'series', 'storage', 'ram', 'colors', 'nfc', 'sd_slot', 
        'camera_modules', 'camera_mp', 'camera_features', 'type', 'purpose', 'material',
        'powerSource', 'gender', 'ageRange', 'petType', 'size', 'compatibility', 'strapMaterial',
        'powerOutput', 'batteryCapacity', 'maxSpeed', 'range', 'productType', 'volume', 'subCategory'
    ];
    filterKeys.forEach(key => {
        counts[key] = calculateCounts(key);
    });
    return counts;
  }, [products, filters]);

  const onSaleCount = useMemo(() => {
    return products.filter(p => p.onSale).length;
  }, [products]);

  const getAvailableOptions = (key: keyof Filters): (string | number)[] => {
    if (key === 'camera_features') {
        return [...new Set(products.flatMap(p => p.specs.camera_features || []))].sort();
    }

    const values = products.map(p => {
        switch (key) {
            case 'brands': return p.brand;
            case 'country': return p.country;
            case 'series': return p.series;
            case 'ram': return p.specs.ram;
            case 'storage': return p.specs.storage;
            case 'colors': return p.specs.color;
            case 'camera_modules': return p.specs.camera_modules;
            case 'type': return p.specs.type;
            case 'purpose': return p.specs.purpose;
            case 'material': return p.specs.material;
            case 'powerSource': return p.specs.powerSource;
            case 'gender': return p.specs.gender;
            case 'ageRange': return p.specs.ageRange;
            case 'petType': return p.specs.petType;
            case 'size': return p.specs.size;
            case 'compatibility': return p.specs.compatibility;
            case 'strapMaterial': return p.specs.strapMaterial;
            case 'powerOutput': return p.specs.powerOutput;
            case 'batteryCapacity': return p.specs.batteryCapacity;
            case 'maxSpeed': return p.specs.maxSpeed;
            case 'range': return p.specs.range;
            case 'productType': return p.specs.productType;
            case 'volume': return p.specs.volume;
            case 'subCategory': return p.specs.subCategory;
            default: return undefined;
        }
    });

    const filteredValues = values.filter((v): v is string | number => v !== undefined && v !== null);
    const uniqueValues = [...new Set(filteredValues)];

    return uniqueValues.sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value === '' ? (type === 'min' ? 0 : 200000) : Number(e.target.value);
    setFilters(prev => ({ ...prev, price: { ...prev.price, [type]: value } }));
  };

  const renderFilter = (config: FilterConfig) => {
    const { id, title, type } = config;
    
    switch (type) {
        case 'checkbox': {
            const selectedValues = filters[id];
            if (Array.isArray(selectedValues)) {
                return (
                    <CheckboxFilter
                        key={id}
                        title={title}
                        filterKey={id}
                        onFilterChange={onFilterChange}
                        options={getAvailableOptions(id)}
                        counts={allCounts[id] || {}}
                        selectedValues={selectedValues}
                    />
                );
            }
            return null;
        }
        case 'range':
            return (
                <FilterSection title={title} key={id}>
                    <div className="price-inputs">
                        <input type="number" placeholder="від" value={filters.price.min || ''} onChange={e => handlePriceChange(e, 'min')} />
                        <span>–</span>
                        <input type="number" placeholder="до" value={filters.price.max || ''} onChange={e => handlePriceChange(e, 'max')} />
                    </div>
                </FilterSection>
            );
        case 'binary': {
            const options = id === 'sd_slot' ? ['Є', 'Немає'] : ['Так', 'Ні'];
            const currentFilter = filters[id];
            return (
                <FilterSection title={title} key={id}>
                    {options.map(option => {
                        //@ts-ignore
                        const isChecked = Array.isArray(currentFilter) && currentFilter.includes(option);
                        return(
                        (allCounts[id]?.[option] > 0 || isChecked) &&
                        <div key={option} className="filter-item">
                            <input type="checkbox" id={`${id}-${option}`} checked={isChecked} onChange={() => onFilterChange(id, option)} />
                            <label htmlFor={`${id}-${option}`}>{option} ({allCounts[id]?.[option] || 0})</label>
                        </div>
                    )})}
                </FilterSection>
            )
        }
        case 'special':
            switch(id) {
                case 'series': {
                    if (filters.brands.length === 0) return null;
                    const availableSeries = [...new Set(products.filter(p=>p.series && filters.brands.includes(p.brand)).map(p => p.series!))].sort();
                    if (availableSeries.length === 0) return null;
                    
                    return (
                        <CheckboxFilter 
                            key={id} 
                            title={title} 
                            filterKey={id} 
                            onFilterChange={onFilterChange} 
                            options={availableSeries} 
                            counts={allCounts.series || {}} 
                            selectedValues={filters.series}
                        />
                    );
                }
                case 'onSale':
                     return (
                        <FilterSection title={title} key={id}>
                            <div className="filter-item">
                            <input type="checkbox" id="sale" checked={filters.onSale} onChange={() => onFilterChange('onSale', !filters.onSale)} />
                            <label htmlFor="sale">Акційні ({onSaleCount})</label>
                            </div>
                        </FilterSection>
                     );
                default: return null;
            }
        default: return null;
    }
  }

  const activeFilters = categoryFilters[categoryName] || [];

  return (
    <aside className="filter-sidebar">
      <FilterSection title="Продавець">
        {['Wolfix', 'Інші'].map(seller => (
          (allCounts.seller?.[seller] > 0 || filters.seller.includes(seller)) &&
          <div key={seller} className="filter-item">
            <input type="checkbox" id={`seller-${seller}`} checked={filters.seller.includes(seller)} onChange={() => onFilterChange('seller', seller)} />
            <label htmlFor={`seller-${seller}`}>{seller} ({allCounts.seller?.[seller] || 0})</label>
          </div>
        ))}
      </FilterSection>
      
      {activeFilters.map(config => renderFilter(config))}
    </aside>
  );
};

export default FilterSidebar;