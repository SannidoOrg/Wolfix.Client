// src/app/categories/[category]/[brand]/page.tsx

// Отключаем SSL для dev
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Исправленные пути импорта (было ../../../../, стало ../../../)
import Header from '../../../components/Header/Header.client';
import Footer from '../../../components/Footer/Footer.server';

import CategoryClientPage from './CategoryClientPage';
import { ProductShortDto } from '@/types/product';
import { PaginationDto } from '@/types/pagination';
import { AttributeValueDto } from '@/types/filter';

// Стили находятся в src/styles, поэтому здесь путь верный (4 уровня вверх до src)
import '../../../../styles/ProductPage.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7168";

// Получение товаров (начальное состояние)
async function getProducts(childCategoryId: string): Promise<ProductShortDto[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/products/category/${childCategoryId}/page/1?pageSize=20`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data: PaginationDto<ProductShortDto> = await res.json();
        return data.items || [];
    } catch (e) {
        console.error("Error fetching products:", e);
        return [];
    }
}

// Получение доступных фильтров
async function getAttributes(childCategoryId: string): Promise<AttributeValueDto[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories/child/${childCategoryId}/attributes-with-values`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Error fetching attributes:", e);
        return [];
    }
}

interface PageProps {
    params: {
        category: string;
        brand: string; // Это ID подкатегории
    }
}

export default async function ProductListingPage({ params }: PageProps) {
    const childCategoryId = params.brand;

    const [initialProducts, attributes] = await Promise.all([
        getProducts(childCategoryId),
        getAttributes(childCategoryId)
    ]);

    return (
        <div className="page-container">
            <Header logoAlt="Wolfix" />
            <main className="page-wrapper">
                <div className="breadcrumbs">Головна / Каталог</div>
                <h1 className="page-title">Каталог товарів</h1>

                <CategoryClientPage
                    initialProducts={initialProducts}
                    attributes={attributes}
                    childCategoryId={childCategoryId}
                    categoryName=""
                />
            </main>
            <Footer />
        </div>
    );
}