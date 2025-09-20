"use client";

import Image from "next/image";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import { useGlobalContext } from "../../../contexts/GlobalContext";

const CartPage = () => {
    const { isAuthenticated } = useAuth();
    const { cart, removeFromCart } = useUser();
    const { loading } = useGlobalContext();

    if (!isAuthenticated) {
        return <div style={{ padding: '2rem' }}>Будь ласка, увійдіть до свого акаунту, щоб переглянути кошик.</div>;
    }

    if (loading) {
        return <div style={{ padding: '2rem' }}>Завантаження...</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Кошик</h1>
            {cart && cart.items.length > 0 ? (
                <div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.items.map(item => {
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
                                        <p style={{ margin: 0 }}><strong>Ціна:</strong> {new Intl.NumberFormat('uk-UA').format(item.price)} грн</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'tomato', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>
                                        Видалити
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <h3>Загальна сума: {new Intl.NumberFormat('uk-UA').format(cart.totalCartPriceWithoutBonuses)} грн</h3>
                        <p>Доступно бонусів: {cart.bonusesAmount}</p>
                        <button style={{ background: 'darkorange', color: 'white', border: 'none', padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            ) : (
                <p>Ваш кошик порожній.</p>
            )}
        </div>
    );
};

export default CartPage;