"use client";

import { createContext, useState, ReactNode, FC, useContext } from "react";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { ProductShortDto, CreateProductDto } from "@/types/product";
import { AddProductReviewDto } from "@/types/review";
import {PaginationDto} from "@/types/pagination";

interface ProductContextType {
    products: ProductShortDto[];
    promoProducts: ProductShortDto[];
    recommendedProducts: ProductShortDto[];
    fetchProductsByCategory: (categoryId: string, page: number) => Promise<void>;
    fetchPromoProducts: (page: number) => Promise<void>;
    fetchRecommendedProducts: () => Promise<void>;
    fetchRandomProducts: () => Promise<void>;
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
    const [products, setProducts] = useState<ProductShortDto[]>([{} as ProductShortDto]);
    const [promoProducts, setPromoProducts] = useState<ProductShortDto[]>([{} as ProductShortDto]);
    const [recommendedProducts, setRecommendedProducts] = useState<ProductShortDto[]>([]);
    const { setLoading } = useGlobalContext();

    const fetchProductsByCategory = async (categoryId: string, page: number = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`https://wolfix-api.azurewebsites.net/api/products/category/${categoryId}/page/${page}`);
            const data: PaginationDto<ProductShortDto> = response.data;

            setProducts(data.items);
        } catch (error) {
            console.error("Failed to fetch products by category:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPromoProducts = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`https://wolfix-api.azurewebsites.net/api/products/with-discount/page/${page}`);
            const data: PaginationDto<ProductShortDto> = response.data;

            setPromoProducts(data.items);
        } catch (error) {
            console.error("Failed to fetch promo products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendedProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('https://wolfix-api.azurewebsites.net/api/products/recommended');
            const data: ProductShortDto[] = response.data;

            setRecommendedProducts(data);
        } catch (error) {
            console.error("Failed to fetch recommended products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRandomProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('https://wolfix-api.azurewebsites.net/api/products/random');
            const data: ProductShortDto[] = response.data;

            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch random products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductReviews = async (productId: string) => {
        setLoading(true);
        try {
            const response = await api.get(`https://wolfix-api.azurewebsites.net/api/products/${productId}/reviews`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const addProductReview = async (productId: string, reviewData: AddProductReviewDto) => {
        setLoading(true);
        try {
            const response = await api.post(`https://wolfix-api.azurewebsites.net/api/products/${productId}/reviews`, reviewData);
            return response;
        } catch (error: any) {
            console.error("Failed to add review:", error);
            return error.response;
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (productData: CreateProductDto) => {
        setLoading(true);
        try {
            const response = await api.post('https://wolfix-api.azurewebsites.net/api/products', productData);
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