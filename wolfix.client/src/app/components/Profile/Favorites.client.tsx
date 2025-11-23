"use client";

import { useUser } from "@/contexts/UserContext";
import ProductCard from "../ProductCard/ProductCard.client";
import { ProductShortDto } from "@/types/product";
import { FavoriteItemDto } from "@/types/favorites";
import "../../../styles/Favorites.css";

const FavoritesClient = () => {
    const { favorites } = useUser();

    // Преобразуем FavoriteItemDto в ProductShortDto для переиспользования ProductCard
    const mapFavoriteToProduct = (fav: FavoriteItemDto): ProductShortDto => ({
        id: fav.id,
        title: fav.title,
        price: fav.price,
        finalPrice: fav.finalPrice,
        averageRating: fav.averageRating,
        bonuses: fav.bonuses,
        mainPhoto: fav.photoUrl
    });

    return (
        <div className="favorites-container">
            <div className="favorites-header-block">
                <h1 className="favorites-title">Обране</h1>
                <span className="items-count">{favorites.length} товарів</span>
            </div>

            {/* Action Bar */}
            <div className="favorites-actions-bar">
                <div className="actions-left">
                    <button className="buy-all-btn">Купити все</button>

                    <label className="select-all-label">
                        <input type="checkbox" />
                        Обрати все
                    </label>
                </div>

                <div className="actions-right">
                    <button className="icon-btn edit-btn" title="Редагувати">✎</button>
                    <button className="icon-btn delete-btn" title="Видалити">🗑</button>
                </div>
            </div>

            {/* Grid */}
            {favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="fav-card-wrapper">
                            {/* Чекбокс выбора для массовых действий */}
                            <input type="checkbox" className="card-checkbox" />
                            <ProductCard product={mapFavoriteToProduct(fav)} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="favorites-empty">
                    <p>Ваш список обраного порожній</p>
                </div>
            )}
        </div>
    );
};

export default FavoritesClient;