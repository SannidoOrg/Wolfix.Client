"use client";

import { createContext, useState, ReactNode, FC, useContext, useCallback } from "react";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { ProductShortDto, CreateProductDto } from "@/types/product";
import { AddProductReviewDto } from "@/types/review";
import { PaginationDto } from "@/types/pagination";

interface ProductContextType {
    products: ProductShortDto[];
    promoProducts: ProductShortDto[];
    recommendedProducts: ProductShortDto[];
    searchResults: ProductShortDto[];
    isSearching: boolean;

    fetchProductsByCategory: (categoryId: string, page: number) => Promise<void>;
    fetchPromoProducts: (page?: number) => Promise<void>;
    fetchRecommendedProducts: () => Promise<void>;

    fetchHomeProducts: (isLoadMore?: boolean) => Promise<void>;
    searchProducts: (query: string) => Promise<void>;
    clearSearch: () => void;

    fetchProductReviews: (productId: string) => Promise<any>;
    addProductReview: (productId: string, reviewData: AddProductReviewDto) => Promise<any>;
    createProduct: (productData: CreateProductDto) => Promise<any>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error("useProducts must be used within a ProductContextProvider");
    return context;
};

export const ProductContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<ProductShortDto[]>([]);
    const [promoProducts, setPromoProducts] = useState<ProductShortDto[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<ProductShortDto[]>([]);
    const [searchResults, setSearchResults] = useState<ProductShortDto[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const { setLoading } = useGlobalContext();

    const fetchProductsByCategory = async (categoryId: string, page: number = 1) => {
        setLoading(true);
        try {
            // БЫЛО: https://wolfix-api.azurewebsites.net/api/...
            // СТАЛО: /api/...
            const response = await api.get(`/api/products/category/${categoryId}/page/${page}`);
            const data: PaginationDto<ProductShortDto> = response.data;
            setProducts(data.items);
        } catch (error) {
            console.error("Failed to fetch products by category:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPromoProducts = async (page: number = 1) => {
        try {
            const response = await api.get(`/api/products/with-discount/page/${page}?pageSize=10`);
            const data: PaginationDto<ProductShortDto> = response.data;
            setPromoProducts(data.items || []);
        } catch (error) {
            console.error("Failed to fetch promo products:", error);
        }
    };

    const fetchRecommendedProducts = async () => {
        try {
            const response = await api.get('/api/products/recommended');
            setRecommendedProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch recommended products:", error);
        }
    };

    const fetchHomeProducts = useCallback(async (isLoadMore: boolean = false) => {
        if (!isLoadMore) setLoading(true);

        try {
            const response = await api.get('/api/products/random?pageSize=12');
            const newItems: ProductShortDto[] = response.data;

            setProducts(prev => {
                if (isLoadMore) {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewItems = newItems.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNewItems];
                }
                return newItems;
            });
        } catch (error) {
            console.error("Failed to fetch home products:", error);
        } finally {
            if (!isLoadMore) setLoading(false);
        }
    }, [setLoading]);

    const searchProducts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        setLoading(true);
        try {
            const response = await api.get(`/api/products/search?searchQuery=${encodeURIComponent(query)}&pageSize=20`);
            setSearchResults(response.data || []);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setIsSearching(false);
    };

    const fetchProductReviews = async (productId: string) => {
        try {
            const response = await api.get(`/api/products/${productId}/reviews`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const addProductReview = async (productId: string, reviewData: AddProductReviewDto) => {
        setLoading(true);
        try {
            return await api.post(`/api/products/${productId}/reviews`, reviewData);
        } catch (error: any) {
            return error.response;
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (productData: CreateProductDto) => {
        setLoading(true);
        try {
            return await api.post('/api/products', productData);
        } catch (error: any) {
            return error.response;
        } finally {
            setLoading(false);
        }
    }

    const value: ProductContextType = {
        products,
        promoProducts,
        recommendedProducts,
        searchResults,
        isSearching,
        fetchProductsByCategory,
        fetchPromoProducts,
        fetchRecommendedProducts,
        fetchHomeProducts,
        searchProducts,
        clearSearch,
        fetchProductReviews,
        addProductReview,
        createProduct,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};