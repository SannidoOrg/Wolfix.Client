"use client";

import { useState } from 'react';
import FilterSidebar from '../../../components/FilterSidebar/FilterSidebar.client';
import ProductCard from '../../../components/ProductCard/ProductCard.client';
import api from '@/lib/api';
import { ProductShortDto } from '@/types/product';
import { AttributeValueDto } from '@/types/filter';
import '../../../../styles/ProductPage.css';

interface Props {
    initialProducts: ProductShortDto[];
    attributes: AttributeValueDto[];
    childCategoryId: string;
    categoryName: string; // Имя подкатегории (бренда)
}

export default function CategoryClientPage({ initialProducts, attributes, childCategoryId, categoryName }: Props) {
    const [products, setProducts] = useState<ProductShortDto[]>(initialProducts);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    // Обработчик клика по чекбоксу
    const handleFilterChange = async (key: string, value: string, attributeId: string) => {
        // 1. Обновляем UI стейт фильтров
        const newFilters = { ...selectedFilters };
        if (!newFilters[key]) newFilters[key] = [];

        if (newFilters[key].includes(value)) {
            newFilters[key] = newFilters[key].filter(v => v !== value);
            if (newFilters[key].length === 0) delete newFilters[key];
        } else {
            newFilters[key].push(value);
        }
        setSelectedFilters(newFilters);

        // 2. Формируем запрос к API
        // Нам нужно превратить объект selectedFilters обратно в массив DTO для бэкенда
        // Нам нужны ID атрибутов. Мы их берем из props.attributes или сохраняем в мапу.
        // Для простоты я передаю attributeId прямо в change handler.

        // Соберем все выбранные фильтры в плоский массив для API
        const filtrationAttribute: { attributeId: string; key: string; value: string }[] = [];

        Object.entries(newFilters).forEach(([filterKey, values]) => {
            // Находим ID атрибута
            const attrObj = attributes.find(a => a.key === filterKey);
            if (attrObj) {
                values.forEach(val => {
                    filtrationAttribute.push({
                        attributeId: attrObj.attributeId,
                        key: filterKey,
                        value: val
                    });
                });
            }
        });

        // 3. Делаем запрос
        setLoading(true);
        try {
            if (filtrationAttribute.length === 0) {
                // Если фильтров нет, грузим дефолтную страницу (сброс)
                const res = await api.get(`/api/products/category/${childCategoryId}/page/1?pageSize=20`);
                setProducts(res.data.items);
            } else {
                // Фильтрация
                const res = await api.post('/api/products/filter-by-attributes', {
                    categoryId: childCategoryId,
                    filtrationAttribute,
                    pageSize: 20 // Пока хардкод, можно добавить пагинацию
                });
                setProducts(res.data);
            }
        } catch (error) {
            console.error("Filter error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="filter-sidebar-wrapper">
                <FilterSidebar
                    attributes={attributes}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="product-listing">
                <div className="listing-header">
                    <span className="product-count">
                        Знайдено товарів: {products.length}
                        {loading && <span style={{marginLeft: '10px', color: '#FF6B00'}}>Оновлення...</span>}
                    </span>
                </div>

                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
                        Товарів за вибраними фільтрами не знайдено.
                    </div>
                )}
            </div>
        </div>
    );
}