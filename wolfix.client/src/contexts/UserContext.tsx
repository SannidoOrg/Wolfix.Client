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
    removeFromFavorites: (productId: string) => Promise<void>;
    isProductInFavorites: (productId: string) => boolean;
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
    const { setLoading, showNotification } = useGlobalContext();
    const { user, isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!user?.customerId) return;
        try {
            const response = await api.get(`/api/customers/cart-items/${user.customerId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const addToCart = async (productId: string) => {
        if (!user?.customerId) return;
        setLoading(true);
        try {
            await api.post('/api/customers/cart-items', {
                customerId: user.customerId,
                productId
            });
            showNotification("Товар додано до кошика", "success");
            await fetchCart();
        } catch (error) {
            console.error("Failed to add to cart:", error);
            showNotification("Помилка додавання до кошика", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        if (!user?.customerId) return;
        try {
            const response = await api.get(`/api/customers/favorites/${user.customerId}`);
            setFavorites(response.data);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
    };

    const addToFavorites = async (productId: string) => {
        if (!user?.customerId) return;
        // Оптимистичное обновление UI (чтобы сердечко загоралось мгновенно)
        setLoading(true);
        try {
            await api.post('/api/customers/favorites', {
                customerId: user.customerId,
                productId
            });
            showNotification("Додано до обраного", "success");
            await fetchFavorites();
        } catch (error) {
            console.error("Failed to add to favorites:", error);
            showNotification("Помилка додавання до обраного", "error");
        } finally {
            setLoading(false);
        }
    };

    const removeFromFavorites = async (productId: string) => {
        if (!user?.customerId) return;
        setLoading(true);
        try {
            // Важно: используем productId как favoriteItemId согласно нашей логике
            await api.delete(`/api/customers/favorites/${user.customerId}/${productId}`);
            showNotification("Видалено з обраного", "success");

            // Обновляем локальный стейт мгновенно
            setFavorites(prev => prev.filter(item => item.id !== productId));
        } catch (error) {
            console.error("Failed to remove from favorites:", error);
            showNotification("Помилка видалення", "error");
        } finally {
            setLoading(false);
        }
    };

    const isProductInFavorites = (productId: string): boolean => {
        return favorites.some(item => item.id === productId);
    };

    useEffect(() => {
        if (isAuthenticated && user?.customerId) {
            fetchCart();
            fetchFavorites();
        } else {
            setCart(null);
            setFavorites([]);
        }
    }, [isAuthenticated, user?.customerId]);

    const value = {
        cart,
        favorites,
        fetchCart,
        addToCart,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
        isProductInFavorites
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};