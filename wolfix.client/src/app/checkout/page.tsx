"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";
import api from "@/lib/api";
import { DeliveryOption, OrderPaymentOption, PlaceOrderDto } from "@/types/order";
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
    const [deptNumber, setDeptNumber] = useState(""); // Номер отделения
    const [street, setStreet] = useState(""); // Для курьера
    const [house, setHouse] = useState(""); // Для курьера

    // --- Оплата ---
    const [paymentMethod, setPaymentMethod] = useState<OrderPaymentOption>(OrderPaymentOption.Cash);

    // --- Бонусы ---
    const [bonusesToUse, setBonusesToUse] = useState(0);
    const [appliedBonuses, setAppliedBonuses] = useState(0);

    // Загрузка данных пользователя (в идеале - из профиля)
    useEffect(() => {
        if (!user) {
            // Если не залогинен - на логин или главную
            // router.push("/");
        } else {
            setEmail(user.email || "");
            // Если бы в user были имя/телефон, заполнили бы их тут
        }
    }, [user]);

    // Если корзина пуста
    if (!cart || cart.items.length === 0) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Кошик порожній</h2>
                <button onClick={() => router.push("/")}>На головну</button>
            </div>
        );
    }

    // --- Расчеты ---
    const totalItemsPrice = cart.totalCartPriceWithoutBonuses;
    const deliveryPrice = deliveryType === DeliveryOption.Courier ? 70 : 0; // Пример: курьер 70 грн, остальное по тарифам
    const maxBonusAllowed = Math.floor(totalItemsPrice * 0.5); // Макс 50%
    const userBonuses = cart.bonusesAmount; // Доступные бонусы

    // Применить бонусы
    const handleApplyBonuses = () => {
        if (bonusesToUse > userBonuses) {
            showNotification(`У вас лише ${userBonuses} бонусів`, "error");
            setBonusesToUse(userBonuses);
            return;
        }
        if (bonusesToUse > maxBonusAllowed) {
            showNotification(`Можна списати максимум ${maxBonusAllowed} бонусів`, "error");
            setBonusesToUse(maxBonusAllowed);
            return;
        }
        setAppliedBonuses(bonusesToUse);
        showNotification(`Застосовано ${bonusesToUse} бонусів`, "success");
    };

    const grandTotal = totalItemsPrice - appliedBonuses + deliveryPrice;

    // --- Сабмит ---
    const handleSubmit = async () => {
        if (!user?.customerId) return;
        setLoading(true);

        const orderDto: PlaceOrderDto = {
            order: {
                customerId: user.customerId,
                // Данные заказчика
                customerFirstName: firstName,
                customerLastName: lastName,
                customerEmail: email,
                customerPhoneNumber: phone,

                // Данные получателя (если тот же, дублируем заказчика)
                recipientFirstName: isRecipientSame ? firstName : recFirstName,
                recipientLastName: isRecipientSame ? lastName : recLastName,
                recipientPhoneNumber: isRecipientSame ? phone : recPhone,

                // Доставка
                deliveryOption: Number(deliveryType),
                deliveryMethodName: deliveryType === DeliveryOption.NovaPoshta ? "Нова Пошта (Відділення)" :
                    deliveryType === DeliveryOption.UkrPoshta ? "Укрпошта" : "Кур'єр Нова Пошта",

                deliveryInfoCity: city,
                deliveryInfoNumber: (deliveryType === DeliveryOption.NovaPoshta || deliveryType === DeliveryOption.UkrPoshta)
                    ? Number(deptNumber) : undefined,
                deliveryInfoStreet: deliveryType === DeliveryOption.Courier ? street : undefined,
                deliveryInfoHouseNumber: deliveryType === DeliveryOption.Courier ? Number(house) : undefined,

                // Финансы
                withBonuses: appliedBonuses > 0,
                usedBonusesAmount: appliedBonuses,
                price: grandTotal
            },
            orderItems: cart.items.map(item => ({
                productId: item.id,
                quantity: 1, // API не поддерживает кол-во > 1 пока что
                price: item.price,
                title: item.title,
                photoUrl: item.photoUrl
            }))
        };

        try {
            await api.post("/api/orders", orderDto);
            showNotification("Замовлення успішно створено!", "success");
            await fetchCart(); // Обновляем корзину (она очистится)
            router.push("/profile/orders"); // Редирект на историю
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
                            />
                            <input
                                className="form-input"
                                placeholder="Ім'я"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="form-grid-row">
                            <input
                                className="form-input"
                                placeholder="+38 098 000 00 00"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                            <input
                                className="form-input"
                                placeholder="email@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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

                            {/* Укрпошта (используем как аналог Поштомата для примера, или добавляем в Enum) */}
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

                            {/* Pickup (Wolfix) - пока не реализован в API, можно сделать заглушкой */}
                            <label className="radio-label" style={{opacity: 0.5}}>
                                <div className="radio-content">
                                    <input type="radio" className="custom-radio" disabled />
                                    <span className="radio-text">Самовивіз з пункту видачі Wolfix (недоступно)</span>
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
                            />

                            {(deliveryType === DeliveryOption.NovaPoshta || deliveryType === DeliveryOption.UkrPoshta) && (
                                <input
                                    className="form-input"
                                    placeholder="Номер відділення"
                                    type="number"
                                    value={deptNumber}
                                    onChange={e => setDeptNumber(e.target.value)}
                                />
                            )}

                            {deliveryType === DeliveryOption.Courier && (
                                <div className="form-grid-row" style={{marginBottom: 0}}>
                                    <input className="form-input" placeholder="Вулиця" value={street} onChange={e => setStreet(e.target.value)} />
                                    <input className="form-input" placeholder="Буд." value={house} onChange={e => setHouse(e.target.value)} />
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
                                    <span className="radio-text">Оплатити зараз (В розробці)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 4. ОТРИМУВАЧ */}
                    <div className="checkout-section">
                        <h2 className="section-title" style={{marginBottom: '10px'}}>Отримувач</h2>
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
                                    <input className="form-input" placeholder="Прізвище" value={recLastName} onChange={e => setRecLastName(e.target.value)} />
                                    <input className="form-input" placeholder="Ім'я" value={recFirstName} onChange={e => setRecFirstName(e.target.value)} />
                                </div>
                                <input className="form-input" placeholder="Телефон" value={recPhone} onChange={e => setRecPhone(e.target.value)} />
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
                            Введіть суму бонусів для списання.
                        </p>

                        <div className="bonuses-input-group">
                            <input
                                type="number"
                                className="bonus-input"
                                placeholder="0"
                                value={bonusesToUse}
                                onChange={e => setBonusesToUse(Number(e.target.value))}
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