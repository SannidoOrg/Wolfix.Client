"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import "../../../styles/ProfilePage.css";

const BonusesClient = () => {
    const { user } = useAuth();
    const [bonuses, setBonuses] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBonuses = async () => {
            if (user?.customerId) {
                try {
                    const res = await api.get(`/api/customers/${user.customerId}`);
                    // Если API вернул данные, берем бонусы
                    if (res.data) {
                        setBonuses(res.data.bonusesAmount || 0);
                    }
                } catch (error) {
                    console.error("Bonus fetch error:", error);
                    // В случае ошибки просто показываем 0, чтобы не ломать UI
                    setBonuses(0);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBonuses();
    }, [user]);

    const formatBonus = (amount: number) => new Intl.NumberFormat('uk-UA').format(amount);

    return (
        <div className="profile-content">
            <div className="profile-title-center" style={{textAlign:'left'}}>
                <h1 style={{fontSize:'28px', marginBottom: '20px'}}>Бонуси</h1>
            </div>

            <div className="bonuses-tabs">
                <div className="bonus-tab active">Баланс</div>
                <div className="bonus-tab">Історія списання/нарахування</div>
            </div>

            <div className="bonuses-grid">
                {/* Карточка 1: Загальна сума */}
                <div className="bonus-card card-orange-light card-circles">
                    <div className="bonus-card-title">Загальна сума бонусів на Wolfix</div>
                    <div className="bonus-card-amount">
                        {loading ? "..." : formatBonus(bonuses)} грн
                    </div>
                </div>

                {/* Карточка 2: Готові до списання */}
                <div className="bonus-card card-teal card-circles">
                    <div className="bonus-card-title">Бонуси готові до списання</div>
                    <div className="bonus-card-amount">
                        {loading ? "..." : formatBonus(bonuses)} грн
                    </div>
                </div>

                {/* Карточка 3: Чекають активації */}
                <div className="bonus-card card-grey card-circles">
                    <div className="bonus-card-title">Бонуси, які чекають активації</div>
                    <div className="bonus-card-amount">0 грн</div>
                </div>

                {/* Карточка 4: Подарункові */}
                <div className="bonus-card card-orange-light card-circles">
                    <div className="bonus-card-title">Подарункові бонуси</div>
                    <div className="bonus-card-amount">0 грн</div>
                </div>
            </div>

            <div className="bonuses-info-text">
                <h3>Як накопичувати бонуси?</h3>
                <ol>
                    <li>Зробіть замовлення на Wolfix.</li>
                    <li>Отримуйте за кожні 100 гривень витрачених на Wolfix 1 бонусную гривню.</li>
                    <li>Отримуйте додаткові подарункові бонуси під час акцій.</li>
                </ol>
                <p>* бонуси стають активними через 14 днів після покупки.</p>

                <h3 style={{marginTop: '20px'}}>Як використовувати бонуси?</h3>
                <ol>
                    <li>Додайте у кошик товар і перейдіть до оформлення замовлення.</li>
                    <li>Введіть суму бонусних гривень у відповідному полі.</li>
                    <li>Отримайте знижку!</li>
                </ol>
                <p>* бонусами можна оплатити до 50% вартості товару.</p>
            </div>
        </div>
    );
};

export default BonusesClient;