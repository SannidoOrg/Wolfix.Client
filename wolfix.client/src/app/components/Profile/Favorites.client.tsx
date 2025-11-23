"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import ProductCard from "../ProductCard/ProductCard.client";
import { ProductShortDto } from "@/types/product";
import { FavoriteItemDto } from "@/types/favorites";
import "../../../styles/Favorites.css";

const FavoritesClient = () => {
    const { favorites, removeFromFavorites, addToCart } = useUser();
    const { showNotification, setLoading } = useGlobalContext();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // ВАЖНО: Используем productId если он есть, иначе id.
    // Это чинит баг с добавлением в корзину.
    const mapFavoriteToProduct = (fav: FavoriteItemDto): ProductShortDto => ({
        id: fav.productId || fav.id,
        title: fav.title,
        price: fav.price,
        finalPrice: fav.finalPrice,
        averageRating: fav.averageRating,
        bonuses: fav.bonuses,
        mainPhoto: fav.photoUrl
    });

    const isAllSelected = favorites.length > 0 && selectedIds.length === favorites.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            // Выбираем ID для операций (productId)
            setSelectedIds(favorites.map(f => f.productId || f.id));
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Видалити ${selectedIds.length} товарів?`)) return;

        setLoading(true);
        try {
            await Promise.all(selectedIds.map(id => removeFromFavorites(id)));
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyAll = async () => {
        const itemsToBuy = selectedIds.length > 0 ? selectedIds : favorites.map(f => f.productId || f.id);
        if (itemsToBuy.length === 0) return;

        setLoading(true);
        try {
            // Последовательно добавляем, чтобы не перегрузить (можно и Promise.all)
            for (const id of itemsToBuy) {
                await addToCart(id);
            }
            showNotification(`Додано ${itemsToBuy.length} товарів до кошика`, "success");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="favorites-container">
            <div className="favorites-header-block">
                <h1 className="favorites-title">Обране</h1>
                <span className="items-count">{favorites.length} товарів</span>
            </div>

            <div className="favorites-actions-bar">
                <div className="actions-left">
                    <button className="buy-all-btn" onClick={handleBuyAll}>
                        {selectedIds.length > 0 ? "Купити обрані" : "Купити все"}
                    </button>
                    <label className="select-all-label">
                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={favorites.length === 0} />
                        Обрати все
                    </label>
                </div>
                <div className="actions-right">
                    <button
                        className={`icon-btn delete-btn ${selectedIds.length === 0 ? 'disabled' : ''}`}
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.length === 0}
                        title="Видалити обрані"
                    >
                        🗑
                    </button>
                </div>
            </div>

            {favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map((fav) => {
                        const prodId = fav.productId || fav.id;
                        return (
                            <div key={fav.id} className="fav-card-wrapper">
                                <input
                                    type="checkbox"
                                    className="card-checkbox"
                                    checked={selectedIds.includes(prodId)}
                                    onChange={() => handleSelectOne(prodId)}
                                />
                                <ProductCard product={mapFavoriteToProduct(fav)} />
                            </div>
                        );
                    })}
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