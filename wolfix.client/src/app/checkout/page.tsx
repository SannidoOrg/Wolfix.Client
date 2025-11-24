"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";
import api from "@/lib/api";
import { DeliveryOption, OrderPaymentOption, PlaceOrderDto } from "@/types/order";
import { CustomerDto } from "@/types/customer"; // <-- НОВЫЙ ИМПОРТ
import "../../styles/Checkout.css";

const CheckoutPage = () => {
    const router = useRouter();
    const { cart, fetchCart } = useUser();
    const { user } = useAuth();
    const { showNotification, setLoading } = useGlobalContext();

    // --- Данные Заказчика ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // --- Получатель (если отличается) ---
    const [isRecipientSame, setIsRecipientSame] = useState(true);
    const [recFirstName, setRecFirstName] = useState("");
    const [recLastName, setRecLastName] = useState("");
    const [recPhone, setRecPhone] = useState("");

    // --- Доставка ---
    const [deliveryType, setDeliveryType] = useState<DeliveryOption>(DeliveryOption.NovaPoshta);
    const [city, setCity] = useState("");
    const [deptNumber, setDeptNumber] = useState("");
    const [street, setStreet] = useState("");
    const [house, setHouse] = useState("");

    // --- Оплата ---
    const [paymentMethod, setPaymentMethod] = useState<OrderPaymentOption>(OrderPaymentOption.Cash);

    // --- Бонусы ---
    const [bonusesToUse, setBonusesToUse] = useState(0);
    const [appliedBonuses, setAppliedBonuses] = useState(0);

    // --- ЛОГИКА ПРЕДЗАПОЛНЕНИЯ ДАННЫХ ИЗ ПРОФИЛЯ ---
    useEffect(() => {
        const loadProfileData = async () => {
            if (!user?.customerId) return;

            // 1. Загрузка данных профиля
            try {
                const res = await api.get<CustomerDto>(`/api/customers/${user.customerId}`);
                const profile = res.data;

                // 2. Предзаполнение полей заказчика
                setFirstName(profile.fullName?.firstName || '');
                setLastName(profile.fullName?.lastName || '');
                setPhone(profile.phoneNumber || '');
                setEmail(user.email || '');

                // 3. Предзаполнение полей получателя (по умолчанию совпадает с заказчиком)
                setRecFirstName(profile.fullName?.firstName || '');
                setRecLastName(profile.fullName?.lastName || '');
                setRecPhone(profile.phoneNumber || '');

                // 4. Предзаполнение адреса
                if (profile.address) {
                    setCity(profile.address.city || '');
                }

            } catch (e) {
                console.error("Failed to load customer profile for checkout:", e);
            }
        };

        if (user) {
            loadProfileData();
        } else {
            // Если не залогинен, предзаполняем только email, если он есть (маловероятно, но на всякий случай)
            setEmail("");
        }

    }, [user]);

    // Если корзина пуста
    if (!cart || cart.items.length === 0) {
        return (
            <div className="checkout-page">
                <Header logoAlt="Wolfix" />
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Кошик порожній</h2>
                    <button onClick={() => router.push("/")}>На головну</button>
                </div>
                <Footer />
            </div>
        );
    }

    // --- Расчеты ---
    const totalItemsPrice = cart.totalCartPriceWithoutBonuses;
    const deliveryPrice = deliveryType === DeliveryOption.Courier ? 70 : 0;
    const maxBonusAllowed = Math.floor(totalItemsPrice * 0.5);
    const userBonuses = cart.bonusesAmount;

    const handleApplyBonuses = () => {
        const value = bonusesToUse;
        if (value > userBonuses) {
            showNotification(`У вас лише ${userBonuses} бонусів`, "error");
            setAppliedBonuses(userBonuses);
        } else if (value > maxBonusAllowed) {
            showNotification(`Можна списати максимум ${maxBonusAllowed} бонусів`, "error");
            setAppliedBonuses(maxBonusAllowed);
        } else {
            setAppliedBonuses(value);
            showNotification(`Застосовано ${value} бонусів`, "success");
        }
    };

    const grandTotal = totalItemsPrice - appliedBonuses + deliveryPrice;

    // --- Сабмит ---
    const handleSubmit = async () => {
        if (!user?.customerId) {
            showNotification("Необхідна авторизація", "error");
            return;
        }

        if (!firstName || !lastName || !phone || !email || !city) {
            showNotification("Будь ласка, заповніть усі обов'язкові поля Замовника та Адреси", "error");
            return;
        }

        setLoading(true);

        const orderDto: PlaceOrderDto = {
            order: {
                customerId: user.customerId,
                customerFirstName: firstName,
                customerLastName: lastName,
                customerMiddleName: '', // Не используется в этой версии
                customerEmail: email,
                customerPhoneNumber: phone,

                recipientFirstName: isRecipientSame ? firstName : recFirstName,
                recipientLastName: isRecipientSame ? lastName : recLastName,
                recipientMiddleName: '',
                recipientPhoneNumber: isRecipientSame ? phone : recPhone,

                deliveryOption: Number(deliveryType),
                deliveryMethodName: deliveryType === DeliveryOption.NovaPoshta ? "Нова Пошта (Відділення)" :
                    deliveryType === DeliveryOption.UkrPoshta ? "Укрпошта" : "Адресна доставка кур'єром",

                deliveryInfoCity: city,
                deliveryInfoNumber: (deliveryType === DeliveryOption.NovaPoshta || deliveryType === DeliveryOption.UkrPoshta)
                    ? Number(deptNumber) : undefined,
                deliveryInfoStreet: deliveryType === DeliveryOption.Courier ? street : undefined,
                deliveryInfoHouseNumber: deliveryType === DeliveryOption.Courier ? (house ? Number(house) : 0) : 0, // 0 т.к. int32 не nullable

                withBonuses: appliedBonuses > 0,
                usedBonusesAmount: appliedBonuses,
                price: grandTotal
            },
            orderItems: cart.items.map(item => ({
                productId: item.id,
                quantity: 1,
                price: item.price,
                title: item.title,
                photoUrl: item.photoUrl
            }))
        };

        try {
            await api.post("/api/orders", orderDto);
            showNotification("Замовлення успішно створено!", "success");
            await fetchCart();
            router.push("/profile/orders");
        } catch (error) {
            console.error("Order error:", error);
            showNotification("Помилка при створенні замовлення", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <Header logoAlt="Wolfix" />

            <h1 className="checkout-header-title">Оформлення замовлення</h1>

            <div className="checkout-layout">
                {/* ЛЕВАЯ КОЛОНКА: ФОРМЫ */}
                <div className="checkout-form-column">

                    {/* 1. ЗАМОВНИК */}
                    <div className="checkout-section">
                        <h2 className="section-title">Замовник</h2>
                        <div className="form-grid-row">
                            <input
                                className="form-input"
                                placeholder="Прізвище"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                            <input
                                className="form-input"
                                placeholder="Ім'я"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-grid-row">
                            <input
                                className="form-input"
                                placeholder="+38 098 000 00 00"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                            <input
                                className="form-input"
                                placeholder="email@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* 2. СПОСІБ ДОСТАВКИ */}
                    <div className="checkout-section">
                        <h2 className="section-title">Спосіб доставки</h2>
                        <div className="radio-group">
                            {/* Нова Пошта Відділення */}
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        name="delivery"
                                        checked={deliveryType === DeliveryOption.NovaPoshta}
                                        onChange={() => setDeliveryType(DeliveryOption.NovaPoshta)}
                                    />
                                    <span className="radio-text">Самовивіз з відділення Нової пошти</span>
                                </div>
                                <span className="delivery-price">За тарифами перевізника</span>
                            </label>

                            {/* Укрпошта (Поштомат/Відділення) */}
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        name="delivery"
                                        checked={deliveryType === DeliveryOption.UkrPoshta}
                                        onChange={() => setDeliveryType(DeliveryOption.UkrPoshta)}
                                    />
                                    <span className="radio-text">Самовивіз з відділення Укрпошти</span>
                                </div>
                                <span className="delivery-price">За тарифами перевізника</span>
                            </label>

                            {/* Курьер */}
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        name="delivery"
                                        checked={deliveryType === DeliveryOption.Courier}
                                        onChange={() => setDeliveryType(DeliveryOption.Courier)}
                                    />
                                    <span className="radio-text">Адресна доставка кур'єром Нової пошти</span>
                                </div>
                                <span className="delivery-price">За тарифами перевізника</span>
                            </label>

                            {/* Pickup (Wolfix) - ВЫКЛЮЧЕННЫЙ */}
                            <label className="radio-label" style={{opacity: 0.5}}>
                                <div className="radio-content">
                                    <input type="radio" className="custom-radio" disabled />
                                    <span className="radio-text">Самовивіз з пункту видачі Wolfix</span>
                                </div>
                                <span className="free-delivery">Безкоштовно</span>
                            </label>
                        </div>

                        {/* Поля адреса (динамические) */}
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexDirection: 'column' }}>
                            <input
                                className="form-input"
                                placeholder="Місто"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                required
                            />

                            {(deliveryType === DeliveryOption.NovaPoshta || deliveryType === DeliveryOption.UkrPoshta) && (
                                <input
                                    className="form-input"
                                    placeholder="Номер відділення"
                                    type="number"
                                    value={deptNumber}
                                    onChange={e => setDeptNumber(e.target.value)}
                                    required
                                />
                            )}

                            {deliveryType === DeliveryOption.Courier && (
                                <div className="form-grid-row" style={{marginBottom: 0}}>
                                    <input className="form-input" placeholder="Вулиця" value={street} onChange={e => setStreet(e.target.value)} required />
                                    <input className="form-input" placeholder="Буд." value={house} onChange={e => setHouse(e.target.value)} required />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. СПОСІБ ОПЛАТИ */}
                    <div className="checkout-section">
                        <h2 className="section-title">Спосіб оплати</h2>
                        <div className="radio-group">
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        name="payment"
                                        checked={paymentMethod === OrderPaymentOption.Cash}
                                        onChange={() => setPaymentMethod(OrderPaymentOption.Cash)}
                                    />
                                    <span className="radio-text">Оплата під час отримання товару</span>
                                </div>
                            </label>
                            <label className="radio-label" style={{opacity: 0.5}}>
                                <div className="radio-content">
                                    <input type="radio" className="custom-radio" disabled />
                                    <span className="radio-text">Оплатити зараз (У розробці)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 4. ОТРИМУВАЧ */}
                    <div className="checkout-section">
                        <h2 className="section-title">Отримувач</h2>
                        <div className="recipient-block">
                            <div className="recipient-info">
                                {isRecipientSame
                                    ? `${lastName} ${firstName}, ${phone}`
                                    : `${recLastName} ${recFirstName}, ${recPhone}`}
                            </div>
                            <button
                                className="change-recipient-btn"
                                onClick={() => setIsRecipientSame(!isRecipientSame)}
                            >
                                {isRecipientSame ? "Змінити" : "Я отримувач"}
                            </button>
                        </div>

                        {!isRecipientSame && (
                            <div style={{marginTop: '15px'}}>
                                <div className="form-grid-row">
                                    <input className="form-input" placeholder="Прізвище" value={recLastName} onChange={e => setRecLastName(e.target.value)} required />
                                    <input className="form-input" placeholder="Ім'я" value={recFirstName} onChange={e => setRecFirstName(e.target.value)} required />
                                </div>
                                <input className="form-input" placeholder="Телефон" value={recPhone} onChange={e => setRecPhone(e.target.value)} required />
                            </div>
                        )}
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА: САММАРИ */}
                <div className="checkout-summary-column">
                    <h3 className="summary-title">Ваше замовлення</h3>

                    <div className="summary-items-list">
                        {cart.items.map(item => (
                            <div key={item.id} className="summary-item">
                                <img
                                    src={item.photoUrl || "/placeholder.png"}
                                    className="summary-item-img"
                                    alt="product"
                                    onError={(e) => e.currentTarget.src = '/placeholder.png'}
                                />
                                <div className="summary-item-info">
                                    <div className="summary-item-title">{item.title}</div>
                                    <div className="summary-item-meta">1 шт.</div>
                                    <div className="summary-item-price">{item.price.toLocaleString()} грн</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bonuses-section">
                        <div className="bonuses-title">Бонуси</div>
                        <div className="bonuses-balance">
                            <span>На Вашому рахунку</span>
                            <strong>{userBonuses} грн бонусів готових до списання</strong>
                        </div>
                        <p className="bonus-hint">
                            * бонусами можна оплатити до 50% вартості товару.<br/>
                            При цьому мінімальна сума замовлення повинна складати не менше 100 грн.
                        </p>

                        <div className="bonuses-input-group">
                            <input
                                type="number"
                                className="bonus-input"
                                placeholder="0"
                                value={bonusesToUse}
                                onChange={e => setBonusesToUse(Number(e.target.value))}
                                max={Math.min(userBonuses, maxBonusAllowed)}
                            />
                            <button className="apply-bonus-btn" onClick={handleApplyBonuses}>Застосувати</button>
                        </div>
                    </div>

                    <div className="summary-totals">
                        <h3 className="summary-title" style={{textAlign: 'left', marginBottom: '15px'}}>Разом</h3>
                        <div className="total-row">
                            <span>Вартість товару</span>
                            <span>{totalItemsPrice.toLocaleString()} грн</span>
                        </div>
                        <div className="total-row">
                            <span>Знижка (бонуси)</span>
                            <span>{appliedBonuses} грн</span>
                        </div>
                        <div className="total-row">
                            <span>Вартість доставки</span>
                            <span>{deliveryPrice > 0 ? `${deliveryPrice} грн` : 'За тарифами'}</span>
                        </div>
                        <div className="total-main-row">
                            <span>До сплати</span>
                            <span className="grand-total">{grandTotal.toLocaleString()} грн</span>
                        </div>
                    </div>

                    <button className="confirm-order-btn" onClick={handleSubmit}>
                        Підтвердити замовлення
                    </button>

                    <p className="agreement-text">
                        Натискаючи на кнопку, ви погоджуєтеся з <a href="#">умовами Угоди користувача</a> та <a href="#">Політикою конфіденційності</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CheckoutPage;