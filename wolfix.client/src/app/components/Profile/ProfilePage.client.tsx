"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useGlobalContext } from "../../../contexts/GlobalContext";

const ProfilePage = () => {
    const { user, assignRole } = useAuth();
    const { loading } = useGlobalContext();

    if (!user) {
        return <div>Будь ласка, увійдіть до свого акаунту.</div>
    }

    const handleBecomeSeller = async () => {
        if (user) {
            const success = await assignRole({
                userId: user.userId,
                email: user.email,
                role: "Seller"
            });
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Профіль користувача</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Ваша роль:</strong> {user.role}</p>
            <hr />

            {user.role === "Customer" && (
                <div>
                    <h3>Стати продавцем</h3>
                    <p>Хочете продавати свої товари на нашій платформі?</p>
                    <button onClick={handleBecomeSeller} disabled={loading}>
                        {loading ? 'Обробка...' : 'Стати продавцем'}
                    </button>
                </div>
            )}

            {user.role === "Seller" && (
                <div>
                    <h3>Ви продавець!</h3>
                    <p>Тепер вам доступні інструменти для управління товарами.</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;