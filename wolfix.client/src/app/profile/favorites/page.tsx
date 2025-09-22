"use client";

import Image from "next/image";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import api from "../../../lib/api";

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
                        let imageUrl = null;
                        if (item.photoUrl && item.photoUrl.trim() !== '') {
                            imageUrl = item.photoUrl.startsWith('http')
                                ? item.photoUrl
                                : `${api.defaults.baseURL || ''}${item.photoUrl}`;
                        }
                        return (
                            <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={item.title}
                                            width={100}
                                            height={100}
                                            style={{ marginRight: '1rem', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: 100, height: 100, marginRight: '1rem', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '12px', textAlign: 'center' }}>
                                            Немає фото
                                        </div>
                                    )}
                                    <div style={{ flexGrow: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                                        <p style={{ margin: 0 }}><strong>Ціна:</strong> {new Intl.NumberFormat('uk-UA').format(item.finalPrice)} грн</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromFavorites(item.id)} style={{ background: 'tomato', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', marginLeft: '1rem' }}>
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