"use client";

import React, { useState, useEffect } from 'react';
import { AttributeValueDto } from '@/types/filter';
import '../../../styles/ProductPage.css';

interface FilterSidebarProps {
    attributes: AttributeValueDto[];
    selectedFilters: Record<string, string[]>;
    // Новые пропсы для цены
    priceRange: { min: string; max: string };
    onFilterChange: (key: string, value: string, attributeId: string) => void;
    onPriceChange: (min: string, max: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
                                                         attributes,
                                                         selectedFilters,
                                                         priceRange,
                                                         onFilterChange,
                                                         onPriceChange
                                                     }) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    // Локальный стейт для инпутов, чтобы не дёргать API при каждом нажатии
    const [localMin, setLocalMin] = useState(priceRange.min);
    const [localMax, setLocalMax] = useState(priceRange.max);

    // Синхронизация, если родитель сбросит фильтры
    useEffect(() => {
        setLocalMin(priceRange.min);
        setLocalMax(priceRange.max);
    }, [priceRange]);

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePriceSubmit = () => {
        // Валидация: если min > max, меняем их местами (UX improvement)
        let finalMin = localMin;
        let finalMax = localMax;

        if (finalMin && finalMax && Number(finalMin) > Number(finalMax)) {
            finalMin = localMax;
            finalMax = localMin;
            setLocalMin(finalMin);
            setLocalMax(finalMax);
        }

        onPriceChange(finalMin, finalMax);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handlePriceSubmit();
        }
    };

    if (!attributes && !priceRange) return null;

    return (
        <aside className="filter-sidebar">
            {/* --- Секция Цены --- */}
            <div className="filter-section filter-price-container">
                <h3 className="filter-title">Цена</h3>
                <div className="price-inputs">
                    <div className="price-input-group">
                        <input
                            type="number"
                            placeholder="От"
                            value={localMin}
                            onChange={(e) => setLocalMin(e.target.value)}
                            onKeyDown={handleKeyDown}
                            min="0"
                        />
                    </div>
                    <span style={{color: '#999'}}>-</span>
                    <div className="price-input-group">
                        <input
                            type="number"
                            placeholder="До"
                            value={localMax}
                            onChange={(e) => setLocalMax(e.target.value)}
                            onKeyDown={handleKeyDown}
                            min="0"
                        />
                    </div>
                    <button
                        className="price-submit-btn"
                        onClick={handlePriceSubmit}
                    >
                        OK
                    </button>
                </div>
            </div>

            {/* --- Секция Атрибутов --- */}
            {attributes.map((attr) => {
                const isOpen = openSections[attr.key] !== false;

                return (
                    <div className="filter-section" key={attr.attributeId}>
                        <h3 className="filter-title" onClick={() => toggleSection(attr.key)}>
                            <span>{attr.key}</span>
                            <span className={`chevron ${isOpen ? '' : 'expanded'}`}></span>
                        </h3>

                        {isOpen && (
                            <div className="filter-content">
                                {attr.values.map((val) => {
                                    const isChecked = selectedFilters[attr.key]?.includes(val) || false;
                                    return (
                                        <div key={val} className="filter-item">
                                            <input
                                                type="checkbox"
                                                id={`${attr.key}-${val}`}
                                                checked={isChecked}
                                                onChange={() => onFilterChange(attr.key, val, attr.attributeId)}
                                            />
                                            <label htmlFor={`${attr.key}-${val}`}>{val}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </aside>
    );
};

export default FilterSidebar;