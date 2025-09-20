"use client";

import { createContext, useState, ReactNode, FC, useContext, useEffect, useCallback } from "react";
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
    removeFromCart: (cartItemId: string) => Promise<void>;
    fetchFavorites: () => Promise<void>;
    addToFavorites: (productId: string) => Promise<void>;
    removeFromFavorites: (favoriteItemId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
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

    const fetchCart = useCallback(async () => {
        if (!user?.profileId) return;
        setLoading(true);
        try {
            const response = await api.get<CustomerCartItemsDto>(`/api/customers/cart-items/${user.profileId}`);
            setCart(response.data);
        } catch (error) {
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, [user, setLoading]);

    const addToCart = async (productId: string) => {
        if (!user?.profileId) return;
        setLoading(true);
        try {
            await api.post(`/api/customers/cart-items`, { customerId: user.profileId, productId });
            showNotification("Товар додано до кошика", "success");
            await fetchCart();
        } catch (error) {
            showNotification("Не вдалося додати товар", "error");
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId: string) => {
        if (!user?.profileId) return;
        setLoading(true);
        try {
            await api.delete(`/api/customers/cart-items/${user.profileId}/${cartItemId}`);
            showNotification("Товар видалено з кошика", "success");
            await fetchCart();
        } catch (error) {
            showNotification("Не вдалося видалити товар", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = useCallback(async () => {
        if (!user?.profileId) return;
        setLoading(true);
        try {
            const response = await api.get<FavoriteItemDto[]>(`/api/customers/favorites/${user.profileId}`);
            setFavorites(response.data);
        } catch (error) {
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, [user, setLoading]);

    const addToFavorites = async (productId: string) => {
        if (!user?.profileId) return;
        setLoading(true);
        try {
            await api.post(`/api/customers/favorites`, { customerId: user.profileId, productId });
            showNotification("Товар додано до обраного", "success");
            await fetchFavorites();
        } catch (error) {
            showNotification("Не вдалося додати до обраного", "error");
        } finally {
            setLoading(false);
        }
    };
    
    const removeFromFavorites = async (favoriteItemId: string) => {
        if (!user?.profileId) return;
        setLoading(true);
        try {
            await api.delete(`/api/customers/favorites/${user.profileId}/${favoriteItemId}`);
            showNotification("Товар видалено з обраного", "success");
            await fetchFavorites();
        } catch (error) {
            showNotification("Не вдалося видалити з обраного", "error");
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (productId: string) => {
        return favorites.some(item => item.id === productId);
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchCart();
            fetchFavorites();
        } else {
            setCart(null);
            setFavorites([]);
        }
    }, [isAuthenticated, user, fetchCart, fetchFavorites]);

    const value = {
        cart,
        favorites,
        fetchCart,
        addToCart,
        removeFromCart,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};