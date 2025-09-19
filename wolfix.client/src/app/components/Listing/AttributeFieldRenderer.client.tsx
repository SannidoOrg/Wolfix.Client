"use client";

import React from 'react';
import { CategoryAttribute } from './AddListing.client';

interface AttributeFieldRendererProps {
    attribute: CategoryAttribute;
    value: string | string[];
    onChange: (key: string, value: string | string[]) => void;
}

const AttributeFieldRenderer: React.FC<AttributeFieldRendererProps> = ({ attribute, value, onChange }) => {
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: checkboxValue, checked } = e.target;
        const currentValues = (Array.isArray(value) ? value : []) as string[];

        let newValues: string[];
        if (checked) {
            newValues = [...currentValues, checkboxValue];
        } else {
            newValues = currentValues.filter(v => v !== checkboxValue);
        }
        onChange(attribute.key, newValues);
    };

    switch (attribute.type) {
        case 'SingleSelect':
            return (
                <div className="form-field">
                    <label htmlFor={attribute.key}>{attribute.key}</label>
                    <select 
                        id={attribute.key} 
                        name={attribute.key}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => onChange(attribute.key, e.target.value)}
                    >
                        <option value="">Оберіть...</option>
                        {attribute.values.map(val => (
                            <option key={val.id} value={val.value}>{val.value}</option>
                        ))}
                    </select>
                </div>
            );
        case 'MultiSelect':
            return (
                <div className="form-field-multiselect">
                    <label>{attribute.key}</label>
                    <div className="checkbox-group">
                        {attribute.values.map(val => (
                            <label key={val.id} className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    value={val.value}
                                    checked={Array.isArray(value) && value.includes(val.value)}
                                    onChange={handleMultiSelectChange}
                                />
                                {val.value}
                            </label>
                        ))}
                    </div>
                </div>
            );
        case 'Text':
            return (
                <div className="form-field">
                    <label htmlFor={attribute.key}>{attribute.key}</label>
                    <input 
                        type="text" 
                        id={attribute.key} 
                        name={attribute.key}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => onChange(attribute.key, e.target.value)}
                    />
                </div>
            );
        default:
            return null;
    }
};

export default AttributeFieldRenderer;