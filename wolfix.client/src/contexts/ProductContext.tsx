"use client";

import { createContext, useState, ReactNode, FC, useContext } from "react";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { ProductShortDto } from "@/types/product";
import { AddProductReviewDto } from "@/types/review";
import { PaginationDto } from "@/types/pagination";

interface ProductContextType {
    products: ProductShortDto[];
    promoProducts: ProductShortDto[];
    recommendedProducts: ProductShortDto[];
    fetchProductsByCategory: (categoryId: string, page: number) => Promise<void>;
    fetchPromoProducts: (page: number) => Promise<void>;
    fetchRecommendedProducts: () => Promise<void>;
    fetchRandomProducts: () => Promise<void>;
    fetchProductReviews: (productId: string, params?: { pageSize?: number; lastId?: string }) => Promise<any>;
    addProductReview: (productId: string, reviewData: AddProductReviewDto) => Promise<any>;
    createProduct: (productData: FormData) => Promise<any>;
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
    const { setLoading } = useGlobalContext();

    const getUniqueProducts = (products: ProductShortDto[]): ProductShortDto[] => {
        if (!Array.isArray(products)) return [];
        return Array.from(new Map(products.map(item => [item.id, item])).values());
    };

    const fetchProductsByCategory = async (categoryId: string, page: number = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/products/category/${categoryId}/page/${page}`);
            const data: PaginationDto<ProductShortDto> = response.data;
            setProducts(getUniqueProducts(data.items));
        } catch (error) {
            console.error("Failed to fetch products by category:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPromoProducts = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/products/with-discount/page/${page}`);
            const data: PaginationDto<ProductShortDto> = response.data;
            setPromoProducts(getUniqueProducts(data.items));
        } catch (error) {
            console.error("Failed to fetch promo products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendedProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/products/recommended');
            const data: ProductShortDto[] = response.data;
            setRecommendedProducts(getUniqueProducts(data));
        } catch (error) {
            console.error("Failed to fetch recommended products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRandomProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/products/random');
            const data: ProductShortDto[] = response.data;
            setProducts(getUniqueProducts(data));
        } catch (error) {
            console.error("Failed to fetch random products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductReviews = async (productId: string, params: { pageSize?: number; lastId?: string } = {}) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/products/${productId}/reviews`, { params });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addProductReview = async (productId: string, reviewData: AddProductReviewDto) => {
        setLoading(true);
        try {
            const response = await api.post(`/api/products/${productId}/reviews`, reviewData);
            return response;
        } catch (error: any) {
            console.error("Failed to add review:", error);
            return error.response;
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (productData: FormData) => {
        setLoading(true);
        try {
            const response = await api.post('/api/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error: any) {
            console.error("Failed to create product:", error);
            return error.response;
        } finally {
            setLoading(false);
        }
    }

    const value : ProductContextType = {
        products,
        promoProducts,
        recommendedProducts,
        fetchProductsByCategory,
        fetchPromoProducts,
        fetchRecommendedProducts,
        fetchRandomProducts,
        fetchProductReviews,
        addProductReview,
        createProduct,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};