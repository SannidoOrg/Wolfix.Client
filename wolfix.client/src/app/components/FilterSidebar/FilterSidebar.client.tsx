"use client";

import React, { useState } from 'react';
import { AttributeValueDto } from '@/types/filter';
import '../../../styles/ProductPage.css'; // Используем существующие стили

interface FilterSidebarProps {
    attributes: AttributeValueDto[];
    selectedFilters: Record<string, string[]>; // key (название атрибута) -> массив выбранных значений
    onFilterChange: (key: string, value: string, attributeId: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ attributes, selectedFilters, onFilterChange }) => {
    // Состояние для сворачивания/разворачивания секций
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Если атрибутов нет, не рендерим ничего (или заглушку)
    if (!attributes || attributes.length === 0) {
        return null;
    }

    return (
        <aside className="filter-sidebar">
            {attributes.map((attr) => {
                const isOpen = openSections[attr.key] !== false; // По умолчанию открыто

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