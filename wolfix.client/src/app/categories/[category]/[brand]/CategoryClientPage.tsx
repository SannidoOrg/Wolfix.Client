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
    categoryName: string;
}

export default function CategoryClientPage({ initialProducts, attributes, childCategoryId, categoryName }: Props) {
    const [products, setProducts] = useState<ProductShortDto[]>(initialProducts);
    const [loading, setLoading] = useState(false);

    // Стейт фильтров
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    // Стейт цены (храним как строки для инпутов, но конвертируем перед отправкой)
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Единая функция получения данных.
    // Она принимает параметры аргументами, чтобы мы могли вызвать её с НОВЫМ состоянием до того, как React обновит стейт.
    const fetchFilteredProducts = async (
        filters: Record<string, string[]>,
        price: { min: string, max: string }
    ) => {
        setLoading(true);

        // 1. Собираем атрибуты
        const filtrationAttribute: { attributeId: string; key: string; value: string }[] = [];
        Object.entries(filters).forEach(([filterKey, values]) => {
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

        // 2. Формируем Payload
        // Важно: если инпуты пустые, отправляем null или не отправляем поле вовсе
        const payload: any = {
            categoryId: childCategoryId,
            pageSize: 20,
            filtrationAttribute // Можно отправлять пустой массив, backend должен это понять
        };

        if (price.min) payload.minPrice = parseFloat(price.min);
        if (price.max) payload.maxPrice = parseFloat(price.max);

        try {
            // Если фильтров совсем нет, можно дергать простой GET,
            // но для унификации проще всегда дергать POST endpoint фильтрации,
            // если он корректно обрабатывает пустые фильтры (обычно так и делают).
            // Но сохраним твою логику ветвления, если backend этого требует.

            const hasAttributes = filtrationAttribute.length > 0;
            const hasPrice = price.min || price.max;

            if (!hasAttributes && !hasPrice) {
                // Сброс к дефолту
                const res = await api.get(`/api/products/category/${childCategoryId}/page/1?pageSize=20`);
                setProducts(res.data.items || res.data); // Support both paginated and list responses
            } else {
                const res = await api.post('/api/products/filter-by-attributes', payload);
                setProducts(res.data.items || res.data); // Если бэк возвращает PagedResult, берем .items
            }
        } catch (error) {
            console.error("Filter error:", error);
            // Тут можно добавить тост уведомление об ошибке
        } finally {
            setLoading(false);
        }
    };

    // Хендлер изменения чекбоксов атрибутов
    const handleAttributeChange = (key: string, value: string, attributeId: string) => {
        const newFilters = { ...selectedFilters };

        if (!newFilters[key]) newFilters[key] = [];

        if (newFilters[key].includes(value)) {
            newFilters[key] = newFilters[key].filter(v => v !== value);
            if (newFilters[key].length === 0) delete newFilters[key];
        } else {
            newFilters[key].push(value);
        }

        setSelectedFilters(newFilters);
        // Вызываем загрузку с НОВЫМИ фильтрами и ТЕКУЩЕЙ ценой
        fetchFilteredProducts(newFilters, priceRange);
    };

    // Хендлер изменения цены (срабатывает по кнопке ОК из сайдбара)
    const handlePriceChange = (min: string, max: string) => {
        const newPrice = { min, max };
        setPriceRange(newPrice);
        // Вызываем загрузку с ТЕКУЩИМИ фильтрами и НОВОЙ ценой
        fetchFilteredProducts(selectedFilters, newPrice);
    };

    return (
        <div className="content-wrapper">
            <FilterSidebar
                attributes={attributes}
                selectedFilters={selectedFilters}
                priceRange={priceRange}
                onFilterChange={handleAttributeChange}
                onPriceChange={handlePriceChange}
            />

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
                    <div style={{ padding: '40px', textAlign: 'center', width: '100%', color: '#666' }}>
                        Товарів за вибраними фільтрами не знайдено.
                    </div>
                )}
            </div>
        </div>
    );
}