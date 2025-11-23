"use client";

import { useState, useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import ProductCard from "../ProductCard/ProductCard.client";
import { ProductShortDto } from "@/types/product";
import { FavoriteItemDto } from "@/types/favorites";
import "../../../styles/Favorites.css";

const FavoritesClient = () => {
    const { favorites, removeFromFavorites, addToCart } = useUser();
    const { showNotification, setLoading } = useGlobalContext();

    // Состояние выбранных товаров (массив ID)
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Преобразование для карточки
    const mapFavoriteToProduct = (fav: FavoriteItemDto): ProductShortDto => ({
        id: fav.id,
        title: fav.title,
        price: fav.price,
        finalPrice: fav.finalPrice,
        averageRating: fav.averageRating,
        bonuses: fav.bonuses,
        mainPhoto: fav.photoUrl
    });

    // --- ЛОГИКА ВЫБОРА ---

    // Выбраны ли все товары?
    const isAllSelected = favorites.length > 0 && selectedIds.length === favorites.length;

    // Обработчик чекбокса "Выбрать все"
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(favorites.map(f => f.id));
        }
    };

    // Обработчик одиночного чекбокса
    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    // --- ЛОГИКА ДЕЙСТВИЙ ---

    // Удаление выбранных
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            showNotification("Оберіть товари для видалення", "error");
            return;
        }

        if (!confirm(`Ви впевнені, що хочете видалити ${selectedIds.length} товарів з обраного?`)) {
            return;
        }

        setLoading(true);
        try {
            // Удаляем параллельно
            await Promise.all(selectedIds.map(id => removeFromFavorites(id)));
            setSelectedIds([]); // Очищаем выбор
            // showNotification вызовется внутри removeFromFavorites, но можно добавить общий
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Купить все (добавить выбранные или все в корзину)
    const handleBuyAll = async () => {
        const itemsToBuy = selectedIds.length > 0 ? selectedIds : favorites.map(f => f.id);

        if (itemsToBuy.length === 0) return;

        setLoading(true);
        try {
            // Добавляем в корзину по очереди
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

            {/* Action Bar */}
            <div className="favorites-actions-bar">
                <div className="actions-left">
                    <button className="buy-all-btn" onClick={handleBuyAll}>
                        {selectedIds.length > 0 ? `Купити обрані (${selectedIds.length})` : "Купити все"}
                    </button>

                    <label className="select-all-label">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            disabled={favorites.length === 0}
                        />
                        Обрати все
                    </label>
                </div>

                <div className="actions-right">
                    {/* Кнопка редактирования удалена */}

                    <button
                        className={`icon-btn delete-btn ${selectedIds.length === 0 ? 'disabled' : ''}`}
                        title="Видалити обрані"
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.length === 0}
                    >
                        <span style={{fontSize: '14px', marginRight: '5px', verticalAlign: 'middle'}}>Видалити обрані</span>
                        🗑
                    </button>
                </div>
            </div>

            {/* Grid */}
            {favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="fav-card-wrapper">
                            <input
                                type="checkbox"
                                className="card-checkbox"
                                checked={selectedIds.includes(fav.id)}
                                onChange={() => handleSelectOne(fav.id)}
                            />
                            {/* Оборачиваем в div, чтобы клик по карточке не конфликтовал с чекбоксом, если нужно */}
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