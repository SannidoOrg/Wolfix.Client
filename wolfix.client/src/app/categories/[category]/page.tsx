// Отключаем проверку SSL для локальной разработки (Fix DEPTH_ZERO_SELF_SIGNED_CERT)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { notFound } from 'next/navigation';
import Header from '../../components/Header/Header.client';
import Footer from '../../components/Footer/Footer.server';
import BrandCardClient from '../../components/BrandCard/BrandCard.client';
import StandaloneCarousel from '../../components/ProductCarousel/StandaloneCarousel.client';
import { CategoryFullDto } from '@/types/category';
import { ProductShortDto } from '@/types/product';
import '../../../styles/CategoryPage.css';

// Устанавливаем базовый URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7168";

// Получение дочерних категорий
async function getChildCategories(parentId: string): Promise<CategoryFullDto[]> {
    try {
        console.log(`Fetching: ${API_BASE_URL}/api/categories/child/${parentId}`);

        const res = await fetch(`${API_BASE_URL}/api/categories/child/${parentId}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`API Error: ${res.status} ${res.statusText}`);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Network Error fetching child categories:", error);
        return [];
    }
}

// Получение популярных товаров
async function getPopularProducts(): Promise<ProductShortDto[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/products/recommended`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching popular products:", error);
        return [];
    }
}

// Получение имени родительской категории
async function getParentCategoryName(parentId: string): Promise<string> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories/parent`, {
            cache: 'force-cache',
        });
        if(!res.ok) return "Категорія";
        const parents: CategoryFullDto[] = await res.json();
        const current = parents.find(p => p.id === parentId);
        return current ? current.name : "Категорія";
    } catch {
        return "Категорія";
    }
}

interface CategoryPageProps {
    params: {
        category: string;
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const parentId = params.category;

    const [childCategories, popularProducts, categoryName] = await Promise.all([
        getChildCategories(parentId),
        getPopularProducts(),
        getParentCategoryName(parentId)
    ]);

    if (!childCategories) {
        // return notFound();
    }

    return (
        <div className="page-container">
            <Header logoAlt="Wolfix Logo" />
            <main className="main-content-category">
                <div className="breadcrumbs">Головна / {categoryName}</div>

                <h1 className="category-title">{categoryName}</h1>

                {childCategories.length > 0 ? (
                    <div className="cards-grid">
                        {childCategories.map((child) => (
                            <BrandCardClient
                                key={child.id}
                                parentId={parentId}
                                childId={child.id}
                                brandName={child.name}
                                imageUrl={child.photoUrl || null}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: '#666' }}>
                        У цій категорії поки немає підкатегорій.
                    </div>
                )}

                {popularProducts.length > 0 && (
                    <div className="popular-section" style={{ marginTop: '60px' }}>
                        <div className="separator-container">
                            <span className="separator-text">Популярні товари</span>
                            <div className="separator-line" />
                        </div>
                        <StandaloneCarousel products={popularProducts} />
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};