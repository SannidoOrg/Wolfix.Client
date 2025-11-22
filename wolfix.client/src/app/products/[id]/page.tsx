// src/app/products/[id]/page.tsx

// Отключаем SSL для dev
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { notFound } from 'next/navigation';
import Header from '../../components/Header/Header.client';
import Footer from '../../components/Footer/Footer.server';
import ProductDetailClient from './ProductDetail.client';
import { ProductFullDto } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7168";

async function getProduct(id: string): Promise<ProductFullDto | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/products/product/${id}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

interface PageProps {
    params: {
        id: string;
    }
}

export default async function ProductPage({ params }: PageProps) {
    const product = await getProduct(params.id);

    if (!product) {
        return notFound();
    }

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header logoAlt="Wolfix" />
            <main style={{ flex: 1 }}>
                {/* Хлебные крошки: Главная / Категория / Товар */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 40px', fontSize: '14px', color: '#666' }}>
                    Головна / {product.categories?.[0]?.categoryName || 'Каталог'} / {product.title}
                </div>

                <ProductDetailClient product={product} />
            </main>
            <Footer />
        </div>
    );
}