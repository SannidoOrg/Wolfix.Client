"use client";

import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import ProductListItem from "../components/ProductListItem/ProductListItem";
import Link from "next/link";
import "../../styles/lists.css";

export default function FavoritesPage() {
    const { favorites, removeFromFavorites } = useUser();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="list-container">
                <h1>Обрані товари</h1>
                <p>Будь ласка, <Link href="/login">увійдіть</Link>, щоб переглянути обрані товари.</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="list-container">
                <h1>Обрані товари</h1>
                <p>У вас немає обраних товарів.</p>
            </div>
        );
    }

    return (
        <div className="list-container">
            <h1>Обрані товари</h1>
            <div className="list-items">
                {favorites.map((item) => (
                     <ProductListItem 
                        key={item.id} 
                        product={{...item, price: item.finalPrice}} 
                        onRemove={removeFromFavorites}
                     />
                ))}
            </div>
        </div>
    );
}