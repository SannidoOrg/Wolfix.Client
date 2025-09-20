"use client";

import Image from "next/image";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import { useGlobalContext } from "../../../contexts/GlobalContext";

const FavoritesPage = () => {
    const { isAuthenticated } = useAuth();
    const { favorites, removeFromFavorites } = useUser();
    const { loading } = useGlobalContext();

    if (!isAuthenticated) {
        return <div style={{ padding: '2rem' }}>Будь ласка, увійдіть до свого акаунту, щоб переглянути обрані товари.</div>;
    }

    if (loading) {
        return <div style={{ padding: '2rem' }}>Завантаження...</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Обрані товари</h1>
            {favorites && favorites.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {favorites.map(item => {
                        const imageUrl = item.photoUrl && item.photoUrl.startsWith('http')
                            ? item.photoUrl
                            : 'https://placehold.co/100x100/eee/ccc?text=No+Image';

                        return (
                            <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <Image
                                    src={imageUrl}
                                    alt={item.title}
                                    width={100}
                                    height={100}
                                    style={{ marginRight: '1rem' }}
                                />
                                <div style={{ flexGrow: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                                    <p style={{ margin: 0 }}><strong>Ціна:</strong> {new Intl.NumberFormat('uk-UA').format(item.finalPrice)} грн</p>
                                </div>
                                <button onClick={() => removeFromFavorites(item.id)} style={{ background: 'tomato', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>
                                    Видалити
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>У вас ще немає обраних товарів.</p>
            )}
        </div>
    );
};

export default FavoritesPage;