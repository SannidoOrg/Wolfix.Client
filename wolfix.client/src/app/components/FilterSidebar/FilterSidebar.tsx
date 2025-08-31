"use client";

import React, { useState, useMemo } from 'react';
import { Filters } from '../../categories/[category]/[brand]/BrandPageClient';
import { Product } from '../../data/products';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: any) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  products: Product[];
  filteredProducts: Product[];
}

export const DIAGONAL_RANGES = {
  '7" та більше': { min: 7, max: Infinity },
  '6,5"–6,9"': { min: 6.5, max: 7 },
  '6"–6,4"': { min: 6, max: 6.5 },
};

export const MEGAPIXEL_RANGES = {
  '100 Мп і більше': { min: 100, max: Infinity },
  '49 - 64 Мп': { min: 49, max: 64 },
  '21 - 48 Мп': { min: 21, max: 48 },
  '16 - 20.7 Мп': { min: 16, max: 20.7 },
  '15 Мп і менше': { min: 0, max: 15 },
};

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

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, setFilters, products, filteredProducts }) => {

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
                    case 'ram': productValue = product.specs.ram; break;
                    case 'storage': productValue = product.specs.storage; break;
                    case 'colors': productValue = product.specs.color; break;
                    case 'series': productValue = product.series; break;
                    case 'camera_modules': productValue = product.specs.camera_modules; break;
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
            switch(filterKeyToCount) {
                case 'brands': if(product.brand) counts[product.brand] = (counts[product.brand] || 0) + 1; break;
                case 'seller': if(product.seller) counts[product.seller] = (counts[product.seller] || 0) + 1; break;
                case 'country': if(product.country) counts[product.country] = (counts[product.country] || 0) + 1; break;
                case 'ram': if(product.specs.ram) counts[product.specs.ram] = (counts[product.specs.ram] || 0) + 1; break;
                case 'storage': if(product.specs.storage) counts[product.specs.storage] = (counts[product.specs.storage] || 0) + 1; break;
                case 'colors': if(product.specs.color) counts[product.specs.color] = (counts[product.specs.color] || 0) + 1; break;
                case 'series': if(product.series) counts[product.series] = (counts[product.series] || 0) + 1; break;
                case 'camera_modules': if(product.specs.camera_modules) counts[product.specs.camera_modules] = (counts[product.specs.camera_modules] || 0) + 1; break;
                case 'nfc': if(product.specs.nfc !== undefined) { const val = product.specs.nfc ? 'Так' : 'Ні'; counts[val] = (counts[val] || 0) + 1; } break;
                case 'sd_slot': if(product.specs.sd_slot !== undefined) { const val = product.specs.sd_slot ? 'Є' : 'Немає'; counts[val] = (counts[val] || 0) + 1; } break;
                case 'camera_features': if (product.specs.camera_features) { product.specs.camera_features.forEach(f => { counts[f] = (counts[f] || 0) + 1; }); } break;
                case 'camera_mp':
                    const productMp = product.specs.camera_mp || 0;
                    if (productMp > 0) {
                        for (const [key, range] of Object.entries(MEGAPIXEL_RANGES)) {
                            if (productMp >= range.min && productMp <= range.max) { counts[key] = (counts[key] || 0) + 1; break; }
                        }
                    }
                    break;
            }
        }
    });
    return counts;
  };
  
  const brandCounts = useMemo(() => calculateCounts('brands'), [products, filters]);
  const sellerCounts = useMemo(() => calculateCounts('seller'), [products, filters]);
  const countryCounts = useMemo(() => calculateCounts('country'), [products, filters]);
  const seriesCounts = useMemo(() => calculateCounts('series'), [products, filters]);
  const storageCounts = useMemo(() => calculateCounts('storage'), [products, filters]);
  const ramCounts = useMemo(() => calculateCounts('ram'), [products, filters]);
  const colorCounts = useMemo(() => calculateCounts('colors'), [products, filters]);
  const nfcCounts = useMemo(() => calculateCounts('nfc'), [products, filters]);
  const sdSlotCounts = useMemo(() => calculateCounts('sd_slot'), [products, filters]);
  const cameraModuleCounts = useMemo(() => calculateCounts('camera_modules'), [products, filters]);
  const megapixelCounts = useMemo(() => calculateCounts('camera_mp'), [products, filters]);
  const cameraFeatureCounts = useMemo(() => calculateCounts('camera_features'), [products, filters]);

  const onSaleCount = useMemo(() => {
    const tempFilters = { ...filters, onSale: false };
    return products.filter(product => {
        if (!product.onSale) return false;
        
        const { seller, brands, country, series, ram, storage, colors, nfc, sd_slot, camera_modules } = tempFilters;
        if (brands.length > 0 && !brands.includes(product.brand)) return false;
        if (seller.length > 0 && !seller.includes(product.seller)) return false;
        if (country.length > 0 && !country.includes(product.country)) return false;
        if (series.length > 0 && !series.includes(product.series || '')) return false;
        if (ram.length > 0 && !ram.includes(product.specs.ram || '')) return false;
        if (storage.length > 0 && !storage.includes(product.specs.storage || '')) return false;
        if (colors.length > 0 && !colors.includes(product.specs.color || '')) return false;
        if (nfc.length > 0) { const p = product.specs.nfc === true; if (!nfc.includes(p ? 'Так' : 'Ні')) return false; }
        if (sd_slot.length > 0) { const p = product.specs.sd_slot === true; if (!sd_slot.includes(p ? 'Є' : 'Немає')) return false; }
        if (camera_modules.length > 0) { if (!product.specs.camera_modules || !camera_modules.includes(product.specs.camera_modules)) return false; }
        
        return true;
    }).length;
  }, [products, filters]);

  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products]);
  const allCountries = useMemo(() => [...new Set(products.map(p => p.country))].sort(), [products]);
  const allCameraFeatures = useMemo(() => [...new Set(products.flatMap(p => p.specs.camera_features || []))].sort(), [products]);
  const availableSeries = useMemo(() => {
    if (filters.brands.length === 0) return [];
    return [...new Set(products.filter(p=>p.series && filters.brands.includes(p.brand)).map(p => p.series!))].sort();
  }, [products, filters.brands]);
  const availableStorage = useMemo(() => [...new Set(products.filter(p=>p.specs.storage).map(p => p.specs.storage!))].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)), [products]);
  const availableRam = useMemo(() => [...new Set(products.filter(p=>p.specs.ram).map(p => p.specs.ram!))].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)), [products]);
  const availableColors = useMemo(() => [...new Set(products.filter(p=>p.specs.color).map(p => p.specs.color!))].sort(), [products]);
  const availableCameraModules = useMemo(() => [...new Set(products.filter(p=>p.specs.camera_modules).map(p => p.specs.camera_modules!))].sort((a, b) => a - b), [products]);

  const [visibleBrands, setVisibleBrands] = useState(7);
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value === '' ? (type === 'min' ? 0 : 200000) : Number(e.target.value);
    setFilters(prev => ({ ...prev, price: { ...prev.price, [type]: value } }));
  };

  return (
    <aside className="filter-sidebar">
      <FilterSection title="Продавець">
        {['Wolfix', 'Інші'].map(seller => (
          (sellerCounts[seller] > 0 || filters.seller.includes(seller)) &&
          <div key={seller} className="filter-item">
            <input type="checkbox" id={`seller-${seller}`} checked={filters.seller.includes(seller)} onChange={() => onFilterChange('seller', seller)} />
            <label htmlFor={`seller-${seller}`}>{seller} ({sellerCounts[seller] || 0})</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Бренд">
        {allBrands.slice(0, visibleBrands).map(brand => (
          (brandCounts[brand] > 0 || filters.brands.includes(brand)) &&
          <div key={brand} className="filter-item">
            <input type="checkbox" id={`brand-${brand}`} checked={filters.brands.includes(brand)} onChange={() => onFilterChange('brands', brand)} />
            <label htmlFor={`brand-${brand}`}>{brand} ({brandCounts[brand] || 0})</label>
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
      
      {filters.brands.length > 0 && availableSeries.length > 0 && (
        <FilterSection title="Серія">
          {availableSeries.map(series => (
            (seriesCounts[series] > 0 || filters.series.includes(series)) &&
            <div key={series} className="filter-item">
              <input type="checkbox" id={`series-${series}`} checked={filters.series.includes(series)} onChange={() => onFilterChange('series', series)} />
              <label htmlFor={`series-${series}`}>{series} ({seriesCounts[series] || 0})</label>
            </div>
          ))}
        </FilterSection>
      )}

      {availableColors.length > 0 && (
        <FilterSection title="Колір">
          {availableColors.map(color => (
             (colorCounts[color] > 0 || filters.colors.includes(color)) &&
            <div key={color} className="filter-item">
              <input type="checkbox" id={`color-${color}`} checked={filters.colors.includes(color)} onChange={() => onFilterChange('colors', color)} />
              <label htmlFor={`color-${color}`}>{color} ({colorCounts[color] || 0})</label>
            </div>
          ))}
        </FilterSection>
      )}

      {availableStorage.length > 0 && (
        <FilterSection title="Вбудована пам’ять">
          {availableStorage.map(storage => (
             (storageCounts[storage] > 0 || filters.storage.includes(storage)) &&
            <div key={storage} className="filter-item">
              <input type="checkbox" id={`storage-${storage}`} checked={filters.storage.includes(storage)} onChange={() => onFilterChange('storage', storage)} />
              <label htmlFor={`storage-${storage}`}>{storage} ({storageCounts[storage] || 0})</label>
            </div>
          ))}
        </FilterSection>
      )}

      {availableRam.length > 0 && (
        <FilterSection title="Оперативна пам’ять">
          {availableRam.map(ram => (
             (ramCounts[ram] > 0 || filters.ram.includes(ram)) &&
            <div key={ram} className="filter-item">
              <input type="checkbox" id={`ram-${ram}`} checked={filters.ram.includes(ram)} onChange={() => onFilterChange('ram', ram)} />
              <label htmlFor={`ram-${ram}`}>{ram} ({ramCounts[ram] || 0})</label>
            </div>
          ))}
        </FilterSection>
      )}

      <FilterSection title="Діагональ екрану">
        {Object.keys(DIAGONAL_RANGES).map(rangeKey => (
          (true) &&
            <div key={rangeKey} className="filter-item">
              <input type="checkbox" id={`diagonal-${rangeKey}`} checked={filters.diagonal.includes(rangeKey)} onChange={() => onFilterChange('diagonal', rangeKey)} />
              <label htmlFor={`diagonal-${rangeKey}`}>{rangeKey}</label>
            </div>
          ))}
      </FilterSection>
      
      <FilterSection title="NFC">
        {['Так', 'Ні'].map(nfcOption => (
           (nfcCounts[nfcOption] > 0 || filters.nfc.includes(nfcOption)) &&
          <div key={nfcOption} className="filter-item">
            <input type="checkbox" id={`nfc-${nfcOption}`} checked={filters.nfc.includes(nfcOption)} onChange={() => onFilterChange('nfc', nfcOption)} />
            <label htmlFor={`nfc-${nfcOption}`}>{nfcOption} ({nfcCounts[nfcOption] || 0})</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Окремий слот для картки пам’яті">
        {['Є', 'Немає'].map(option => (
            (sdSlotCounts[option] > 0 || filters.sd_slot.includes(option)) &&
            <div key={option} className="filter-item">
                <input type="checkbox" id={`sd-slot-${option}`} checked={filters.sd_slot.includes(option)} onChange={() => onFilterChange('sd_slot', option)} />
                <label htmlFor={`sd-slot-${option}`}>{option} ({sdSlotCounts[option] || 0})</label>
            </div>
        ))}
      </FilterSection>

      {availableCameraModules.length > 0 && (
          <FilterSection title="Кількість модулів основної камери">
              {availableCameraModules.map(moduleCount => (
                  (cameraModuleCounts[moduleCount] > 0 || filters.camera_modules.includes(moduleCount)) &&
                  <div key={moduleCount} className="filter-item">
                      <input type="checkbox" id={`cam-module-${moduleCount}`} checked={filters.camera_modules.includes(moduleCount)} onChange={() => onFilterChange('camera_modules', moduleCount)} />
                      <label htmlFor={`cam-module-${moduleCount}`}>{moduleCount} ({cameraModuleCounts[moduleCount] || 0})</label>
                  </div>
              ))}
          </FilterSection>
      )}

      <FilterSection title="Основна камера">
        {Object.keys(MEGAPIXEL_RANGES).map(rangeKey => (
          (megapixelCounts[rangeKey] > 0 || filters.camera_mp.includes(rangeKey)) &&
          <div key={rangeKey} className="filter-item">
            <input type="checkbox" id={`mp-${rangeKey}`} checked={filters.camera_mp.includes(rangeKey)} onChange={() => onFilterChange('camera_mp', rangeKey)} />
            <label htmlFor={`mp-${rangeKey}`}>{rangeKey} ({megapixelCounts[rangeKey] || 0})</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Особливості основної камери">
        {allCameraFeatures.map(feature => (
          (cameraFeatureCounts[feature] > 0 || filters.camera_features.includes(feature)) &&
          <div key={feature} className="filter-item">
            <input type="checkbox" id={`feature-${feature}`} checked={filters.camera_features.includes(feature)} onChange={() => onFilterChange('camera_features', feature)} />
            <label htmlFor={`feature-${feature}`}>{feature} ({cameraFeatureCounts[feature] || 0})</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Країна-виробник">
        {allCountries.map(country => (
          (countryCounts[country] > 0 || filters.country.includes(country)) &&
          <div key={country} className="filter-item">
            <input type="checkbox" id={`country-${country}`} checked={filters.country.includes(country)} onChange={() => onFilterChange('country', country)} />
            <label htmlFor={`country-${country}`}>{country} ({countryCounts[country] || 0})</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Вигідні пропозиції">
        <div className="filter-item">
          <input type="checkbox" id="sale" checked={filters.onSale} onChange={() => onFilterChange('onSale', !filters.onSale)} />
          <label htmlFor="sale">Акційні ({onSaleCount})</label>
        </div>
      </FilterSection>

    </aside>
  );
};

export default FilterSidebar;