"use client";

import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import ProductListItem from "../components/ProductListItem/ProductListItem";
import Link from "next/link";
import "../../styles/lists.css";

export default function CartPage() {
    const { cart, removeFromCart } = useUser();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="list-container">
                <h1>Кошик</h1>
                <p>Будь ласка, <Link href="/login">увійдіть</Link>, щоб переглянути свій кошик.</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="list-container">
                <h1>Кошик</h1>
                <p>Ваш кошик порожній.</p>
            </div>
        );
    }

    return (
        <div className="list-container">
            <h1>Кошик</h1>
            <div className="list-items">
                {cart.items.map((item) => (
                    <ProductListItem key={item.id} product={item} onRemove={removeFromCart} />
                ))}
            </div>
            <div className="list-summary">
                <h2>Загальна сума: {new Intl.NumberFormat('uk-UA').format(cart.totalCartPriceWithoutBonuses)} грн</h2>
                <button className="checkout-button">Оформити замовлення</button>
            </div>
        </div>
    );
}