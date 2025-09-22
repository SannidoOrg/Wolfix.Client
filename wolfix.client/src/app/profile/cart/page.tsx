"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import api from "../../../lib/api";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("your_stripe_publishable_key");

const CartPage = () => {
    const { user, isAuthenticated } = useAuth();
    const { cart, removeFromCart } = useUser();
    
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handlePlaceOrder = async () => {
        if (!cart || !user) return;

        const orderData = {
            customerFirstName: user.firstName || '',
            customerLastName: user.lastName || '',
            customerMiddleName: user.middleName || '',
            customerPhoneNumber: user.phoneNumber || '',
            customerEmail: user.email,
            customerId: user.profileId,
            recipientFirstName: user.firstName || '',
            recipientLastName: user.lastName || '',
            recipientMiddleName: user.middleName || '',
            recipientPhoneNumber: user.phoneNumber || '',
            deliveryMethodName: "Default",
            deliveryInfoCity: user.address?.city || '',
            deliveryInfoStreet: user.address?.street || '',
            deliveryInfoHouseNumber: user.address?.houseNumber || '',
            withBonuses: false,
            usedBonusesAmount: 0,
            price: cart.totalCartPriceWithoutBonuses,
            orderItems: cart.items.map(item => ({
                productId: item.id,
                photoUrl: item.photoUrl || '',
                title: item.title,
                quantity: 1,
                price: item.price
            }))
        };

        try {
            const response = await api.post('/api/orders/with-payment', orderData);
            const { clientSecret } = response.data;
            setClientSecret(clientSecret);
        } catch (error) {
            console.error("Не удалось создать заказ:", error);
        }
    };

    if (!isAuthenticated) {
        return <div style={{ padding: '2rem' }}>Будь ласка, увійдіть до свого акаунту, щоб переглянути кошик.</div>;
    }
    
    if (clientSecret) {
        const options = { clientSecret };
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Підтвердьте ваш платіж</h2>
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Кошик</h1>
            {cart && cart.items.length > 0 ? (
                <div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.items.map(item => {
                            let imageUrl = null;
                            if (item.photoUrl) {
                                imageUrl = item.photoUrl.startsWith('http')
                                    ? item.photoUrl
                                    : `${api.defaults.baseURL}${item.photoUrl}`;
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
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => e.currentTarget.style.display = 'none'}
                                            />
                                        ) : <div style={{width: 100, height: 100, marginRight: '1rem', backgroundColor: '#f0f0f0'}}></div>}
                                        <div style={{ flexGrow: 1 }}>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                                            <p style={{ margin: 0 }}><strong>Ціна:</strong> {new Intl.NumberFormat('uk-UA').format(item.price)} грн</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'tomato', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', marginLeft: '1rem' }}>
                                        Видалити
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <h3>Загальна сума: {new Intl.NumberFormat('uk-UA').format(cart.totalCartPriceWithoutBonuses)} грн</h3>
                        <p>Доступно бонусів: {cart.bonusesAmount}</p>
                        <button 
                            onClick={handlePlaceOrder} 
                            style={{ background: 'darkorange', color: 'white', border: 'none', padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
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