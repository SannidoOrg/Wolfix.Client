"use client";

import { createContext, useState, ReactNode, FC, useContext, useEffect } from "react";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { useAuth } from "./AuthContext";
import { CustomerCartItemsDto } from "../types/cart";
import { FavoriteItemDto } from "../types/favorites";

interface UserContextType {
    cart: CustomerCartItemsDto | null;
    favorites: FavoriteItemDto[];
    fetchCart: () => Promise<void>;
    addToCart: (productId: string) => Promise<void>;
    fetchFavorites: () => Promise<void>;
    addToFavorites: (productId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserContextProvider");
    return context;
};

export const UserContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CustomerCartItemsDto | null>(null);
    const [favorites, setFavorites] = useState<FavoriteItemDto[]>([]);
    const { setLoading } = useGlobalContext();
    const { user, isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            const response = await api.get(`/api/customer/cart-items/${user.userId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: string) => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            await api.post('/api/customer/cart-items', { customerId: user.userId, productId });
            await fetchCart();
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            const response = await api.get(`/api/customer/favorites/${user.userId}`);
            setFavorites(response.data);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (productId: string) => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            await api.post('/api/customer/favorites', { customerId: user.userId, productId });
            await fetchFavorites();
        } catch (error) {
            console.error("Failed to add to favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchFavorites();
        } else {
            setCart(null);
            setFavorites([]);
        }
    }, [isAuthenticated]);

    const value = {
        cart,
        favorites,
        fetchCart,
        addToCart,
        fetchFavorites,
        addToFavorites,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};