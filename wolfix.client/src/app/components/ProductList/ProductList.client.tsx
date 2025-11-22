"use client";

import { FC, useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard.client";
import ProductCarousel from "../ProductCarousel/ProductCarousel.client";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton.client";
import { useProducts } from "@/contexts/ProductContext";
import "../../../styles/ProductList.css";

const ProductListClient: FC = () => {
    const {
        products,
        promoProducts,
        fetchHomeProducts,
        fetchPromoProducts
    } = useProducts();

    const [carouselIndex, setCarouselIndex] = useState<number>(0);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);

    // Инициализация данных при монтировании
    useEffect(() => {
        fetchHomeProducts(false);
        fetchPromoProducts(1);
    }, []); // Пустой массив зависимостей - вызываем один раз при загрузке

    // Логика карусели
    const safePromoProducts = promoProducts || [];
    const handlePrev = () => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : safePromoProducts.length - 4));
    const handleNext = () => setCarouselIndex((prev) => (prev < safePromoProducts.length - 4 ? prev + 1 : 0));

    const totalSteps = safePromoProducts.length > 4 ? safePromoProducts.length - 4 : 0;
    const progressWidth = totalSteps > 0 ? `${(carouselIndex / totalSteps) * 100}%` : "0%";

    // Логика "Показати ще"
    const handleLoadMore = async () => {
        setIsLoadMoreLoading(true);
        await fetchHomeProducts(true); // true означает append mode
        setIsLoadMoreLoading(false);
    };

    // Разделение товаров для вставки баннера (согласно дизайну баннер разрывает сетку)
    const firstGridPart = products.slice(0, 12);
    const secondGridPart = products.slice(12);

    return (
        <div className="product-list-wrapper">
            {/* Секция акций */}
            {safePromoProducts.length > 0 && (
                <>
                    <div className="separator-container">
                        <span className="separator-text">Акційні товари</span>
                        <div className="separator-line" />
                    </div>
                    <ProductCarousel
                        products={safePromoProducts}
                        currentIndex={carouselIndex}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: progressWidth }}></div>
                    </div>
                </>
            )}

            {/* Секция всех товаров (Верхняя часть) */}
            <div className="separator-container">
                <span className="separator-text">Всі товари</span>
                <div className="separator-line" />
            </div>

            <div className="products-grid">
                {firstGridPart.map((product) => (
                    <ProductCard key={`${product.id}-top`} product={product} />
                ))}
            </div>

            {/* Баннер "Продавайте легко" - вставляем после 12 товаров если они есть */}
            <div className="custom-separator" />
            <div className="custom-banner">
                <img src="/banners/Banner_4.png" alt="Продавайте легко з Wolfix" />
            </div>
            <div className="custom-separator" />

            {/* Секция всех товаров (Нижняя часть) */}
            {secondGridPart.length > 0 && (
                <div className="products-grid">
                    {secondGridPart.map((product) => (
                        <ProductCard key={`${product.id}-bottom`} product={product} />
                    ))}
                </div>
            )}

            {/* Кнопка загрузки */}
            <div className="load-more-container">
                <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoadMoreLoading} />
            </div>
        </div>
    );
};

export default ProductListClient;