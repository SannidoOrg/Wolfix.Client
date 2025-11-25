"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";
import api from "@/lib/api";
import { DeliveryOption, OrderPaymentOption, PlaceOrderDto, OrderPlacedWithPaymentDto } from "@/types/order";
import { CustomerDto } from "@/types/customer";
import { DeliveryMethodDto } from "@/types/delivery";
import "../../styles/Checkout.css";

const CheckoutPage = () => {
    const router = useRouter();
    const { cart, fetchCart } = useUser();
    const { user } = useAuth();
    const { showNotification, setLoading } = useGlobalContext();

    // --- Данные Заказчика ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // --- Получатель ---
    const [isRecipientSame, setIsRecipientSame] = useState(true);
    const [recFirstName, setRecFirstName] = useState("");
    const [recLastName, setRecLastName] = useState("");
    const [recMiddleName, setRecMiddleName] = useState("");
    const [recPhone, setRecPhone] = useState("");

    // --- Данные для доставки (API) ---
    const [apiDeliveryMethods, setApiDeliveryMethods] = useState<DeliveryMethodDto[]>([]);

    // --- Выбор пользователя ---
    const [deliveryOptionEnum, setDeliveryOptionEnum] = useState<DeliveryOption>(DeliveryOption.NovaPoshta);

    // ID выбранных объектов
    const [selectedMethodId, setSelectedMethodId] = useState<string>("");
    const [selectedCityId, setSelectedCityId] = useState<string>("");
    const [selectedDeptId, setSelectedDeptId] = useState<string>("");

    // Поля для ручного ввода (Курьер)
    const [manualCity, setManualCity] = useState("");
    const [street, setStreet] = useState("");
    const [house, setHouse] = useState("");

    // --- Оплата ---
    const [paymentMethod, setPaymentMethod] = useState<OrderPaymentOption>(OrderPaymentOption.Cash);

    // --- Бонусы ---
    const [bonusesToUse, setBonusesToUse] = useState(0);
    const [appliedBonuses, setAppliedBonuses] = useState(0);

    // 1. Загрузка методов доставки
    useEffect(() => {
        const fetchDeliveryData = async () => {
            try {
                const res = await api.get<DeliveryMethodDto[]>("/api/delivery-methods/delivery-methods");
                setApiDeliveryMethods(res.data);

                if (res.data.length > 0) {
                    const firstMethod = res.data[0];
                    setSelectedMethodId(firstMethod.id);
                    const lowerName = firstMethod.name.toLowerCase();
                    if (lowerName.includes("укр") || lowerName.includes("ukr")) {
                        setDeliveryOptionEnum(DeliveryOption.UkrPoshta);
                    } else {
                        setDeliveryOptionEnum(DeliveryOption.NovaPoshta);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch delivery methods", e);
            }
        };
        fetchDeliveryData();
    }, []);

    // 2. Предзаполнение профиля
    useEffect(() => {
        const loadProfileData = async () => {
            if (!user?.customerId) return;
            try {
                const res = await api.get<CustomerDto>(`/api/customers/${user.customerId}`);
                const profile = res.data;

                setFirstName(profile.fullName?.firstName || '');
                setLastName(profile.fullName?.lastName || '');
                setMiddleName(profile.fullName?.middleName || '');
                setPhone(profile.phoneNumber || '');
                setEmail(user.email || '');

                setRecFirstName(profile.fullName?.firstName || '');
                setRecLastName(profile.fullName?.lastName || '');
                setRecMiddleName(profile.fullName?.middleName || '');
                setRecPhone(profile.phoneNumber || '');

                if (profile.address) {
                    if (profile.address.city) setManualCity(profile.address.city);
                    if (profile.address.street) setStreet(profile.address.street);
                    if (profile.address.houseNumber) setHouse(String(profile.address.houseNumber));
                }
            } catch (e) { console.error(e); }
        };

        if (user) loadProfileData();
    }, [user]);

    // --- ОПТИМИЗАЦИЯ: Мемоизация ---
    const currentApiMethod = useMemo(() => {
        return apiDeliveryMethods.find(m => m.id === selectedMethodId);
    }, [apiDeliveryMethods, selectedMethodId]);

    const currentCityList = useMemo(() => {
        return currentApiMethod?.cities || [];
    }, [currentApiMethod]);

    const currentCity = useMemo(() => {
        return currentCityList.find(c => c.id === selectedCityId);
    }, [currentCityList, selectedCityId]);

    const currentDepartmentList = useMemo(() => {
        return currentCity?.departments || [];
    }, [currentCity]);

    // Обработчик смены метода (API методы)
    const handleMethodChange = (methodId: string, methodName: string) => {
        setSelectedMethodId(methodId);
        // Сбрасываем селекты
        setSelectedCityId("");
        setSelectedDeptId("");

        const lowerName = methodName.toLowerCase();

        if (lowerName.includes("укр") || lowerName.includes("ukr")) {
            setDeliveryOptionEnum(DeliveryOption.UkrPoshta);
        } else {
            setDeliveryOptionEnum(DeliveryOption.NovaPoshta);
        }
    };

    // Обработчик курьера
    const handleCourierSelect = () => {
        setDeliveryOptionEnum(DeliveryOption.Courier);
        setSelectedMethodId("courier");
    };

    // --- Сабмит ---
    const handleSubmit = async () => {
        if (!user?.customerId) {
            showNotification("Необхідна авторизація", "error");
            return;
        }

        if (!firstName || !lastName || !phone) {
            showNotification("Заповніть контактні дані", "error");
            return;
        }

        let finalCity = "";
        let finalDeptNumber: number | undefined = undefined;
        let finalStreet: string | undefined = undefined;
        let finalHouse: number | undefined = undefined;
        let methodNameString = "";

        if (deliveryOptionEnum === DeliveryOption.Courier) {
            if (!manualCity || !street || !house) {
                showNotification("Заповніть адресу для кур'єра", "error");
                return;
            }
            finalCity = manualCity;
            finalStreet = street;
            finalHouse = Number(house);
            methodNameString = "Адресна доставка кур'єром";
        } else {
            if (!selectedCityId || !selectedDeptId) {
                showNotification("Оберіть місто та відділення", "error");
                return;
            }
            const dept = currentDepartmentList.find(d => d.id === selectedDeptId);
            if (!currentCity || !dept) return;

            finalCity = currentCity.name;
            finalDeptNumber = dept.number;
            // ИСПРАВЛЕНИЕ ЗДЕСЬ: Заполняем улицу и дом из выбранного отделения
            finalStreet = dept.street || undefined;
            finalHouse = dept.houseNumber || undefined;
            methodNameString = currentApiMethod?.name || "Доставка";
        }

        setLoading(true);

        const totalItemsPrice = cart?.totalCartPriceWithoutBonuses || 0;
        const deliveryPrice = deliveryOptionEnum === DeliveryOption.Courier ? 70 : 0;
        const grandTotal = totalItemsPrice - appliedBonuses + deliveryPrice;

        const orderDto: PlaceOrderDto = {
            order: {
                customerId: user.customerId,
                customerFirstName: firstName,
                customerLastName: lastName,
                customerMiddleName: middleName,
                customerEmail: email,
                customerPhoneNumber: phone,

                recipientFirstName: isRecipientSame ? firstName : recFirstName,
                recipientLastName: isRecipientSame ? lastName : recLastName,
                recipientMiddleName: isRecipientSame ? middleName : recMiddleName,
                recipientPhoneNumber: isRecipientSame ? phone : recPhone,

                deliveryOption: deliveryOptionEnum,
                deliveryMethodName: methodNameString,

                deliveryInfoCity: finalCity,
                deliveryInfoNumber: finalDeptNumber,
                deliveryInfoStreet: finalStreet,
                deliveryInfoHouseNumber: finalHouse,

                withBonuses: appliedBonuses > 0,
                usedBonusesAmount: appliedBonuses,
                price: grandTotal
            },
            orderItems: (cart?.items || []).map(item => ({
                cartItemId: item.id,
                productId: item.productId,
                quantity: 1,
                price: item.price,
                title: item.title,
                photoUrl: item.photoUrl
            }))
        };

        try {
            const endpoint = paymentMethod === OrderPaymentOption.Card ? "/api/orders/with-payment" : "/api/orders";

            const response = await api.post<any>(endpoint, orderDto);

            if (paymentMethod === OrderPaymentOption.Card) {
                const data = response.data as OrderPlacedWithPaymentDto;

                if (data && data.clientSecret && data.orderId) {
                    router.push(`/payment?clientSecret=${encodeURIComponent(data.clientSecret)}&orderId=${data.orderId}`);
                } else {
                    showNotification("Помилка отримання даних для оплати", "error");
                }
            } else {
                showNotification("Замовлення успішно оформлено!", "success");
                await fetchCart();
                router.push("/profile/orders");
            }

        } catch (error: any) {
            console.error("Order error:", error);
            showNotification("Помилка оформлення", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="checkout-page">
                <Header logoAlt="Wolfix" />
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Кошик порожній</h2>
                    <button onClick={() => router.push("/")} className="checkout-btn" style={{width: 'auto', marginTop: '20px'}}>
                        На головну
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const totalItemsPrice = cart.totalCartPriceWithoutBonuses;
    const deliveryPrice = deliveryOptionEnum === DeliveryOption.Courier ? 70 : 0;
    const grandTotal = totalItemsPrice - appliedBonuses + deliveryPrice;
    const userBonuses = cart.bonusesAmount;

    return (
        <div className="checkout-page">
            <Header logoAlt="Wolfix" />
            <h1 className="checkout-header-title">Оформлення замовлення</h1>

            <div className="checkout-layout">
                <div className="checkout-form-column">

                    {/* 1. ЗАМОВНИК */}
                    <div className="checkout-section">
                        <h2 className="section-title">Замовник</h2>
                        <div className="form-grid-row">
                            <div className="form-control">
                                <input className="form-input" placeholder="Прізвище" value={lastName} onChange={e => setLastName(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <input className="form-input" placeholder="Ім'я" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-grid-row">
                            <div className="form-control">
                                <input className="form-input" placeholder="По батькові" value={middleName} onChange={e => setMiddleName(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <input className="form-input" placeholder="Телефон (+380...)" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-grid-row">
                            <div className="form-control">
                                <input className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* 2. СПОСІБ ДОСТАВКИ */}
                    <div className="checkout-section">
                        <h2 className="section-title">Спосіб доставки</h2>
                        <div className="radio-group">

                            {/* API Методы (Нова Пошта, Укрпошта) */}
                            {apiDeliveryMethods.map(method => (
                                <label key={method.id} className="radio-label">
                                    <div className="radio-content">
                                        <input
                                            type="radio"
                                            className="custom-radio"
                                            name="delivery"
                                            checked={selectedMethodId === method.id}
                                            onChange={() => handleMethodChange(method.id, method.name)}
                                        />
                                        <span className="radio-text">{method.name} (Відділення)</span>
                                    </div>
                                    <span className="delivery-price">За тарифами</span>
                                </label>
                            ))}

                            {/* Курьер */}
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        name="delivery"
                                        checked={deliveryOptionEnum === DeliveryOption.Courier}
                                        onChange={handleCourierSelect}
                                    />
                                    <span className="radio-text">Адресна доставка кур'єром</span>
                                </div>
                                <span className="delivery-price">70 грн</span>
                            </label>
                        </div>

                        {/* БЛОК ВЫБОРА: ВЗАИМОИСКЛЮЧАЮЩИЙ РЕНДЕРИНГ */}

                        {/* 1. Если выбрана доставка в отделение (ЛЮБОЕ кроме курьера) */}
                        {deliveryOptionEnum !== DeliveryOption.Courier && (
                            <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <select
                                    className="form-input"
                                    value={selectedCityId}
                                    onChange={e => setSelectedCityId(e.target.value)}
                                >
                                    <option value="">Оберіть місто</option>
                                    {currentCityList.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>

                                <select
                                    className="form-input"
                                    value={selectedDeptId}
                                    onChange={e => setSelectedDeptId(e.target.value)}
                                    disabled={!selectedCityId}
                                >
                                    <option value="">Оберіть відділення</option>
                                    {currentDepartmentList.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            №{dept.number} - {dept.street}, {dept.houseNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* 2. Если выбран курьер */}
                        {deliveryOptionEnum === DeliveryOption.Courier && (
                            <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <input className="form-input" placeholder="Місто" value={manualCity} onChange={e => setManualCity(e.target.value)} />
                                <div className="form-grid-row" style={{marginBottom: 0}}>
                                    <input className="form-input" placeholder="Вулиця" value={street} onChange={e => setStreet(e.target.value)} />
                                    <input className="form-input" placeholder="Будинок" value={house} onChange={e => setHouse(e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. ОПЛАТА */}
                    <div className="checkout-section">
                        <h2 className="section-title">Спосіб оплати</h2>
                        <div className="radio-group">
                            {/* Оплата при получении */}
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        checked={paymentMethod === OrderPaymentOption.Cash}
                                        onChange={() => setPaymentMethod(OrderPaymentOption.Cash)}
                                    />
                                    <span className="radio-text">Оплата під час отримання</span>
                                </div>
                            </label>

                            {/* Оплата картой */}
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input
                                        type="radio"
                                        className="custom-radio"
                                        checked={paymentMethod === OrderPaymentOption.Card}
                                        onChange={() => setPaymentMethod(OrderPaymentOption.Card)}
                                    />
                                    <span className="radio-text">Оплатити карткою</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 4. ОТРИМУВАЧ */}
                    <div className="checkout-section">
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                            <h2 className="section-title" style={{margin:0}}>Отримувач</h2>
                            <button className="change-recipient-btn" onClick={() => setIsRecipientSame(!isRecipientSame)}>
                                {isRecipientSame ? "Змінити" : "Я отримувач"}
                            </button>
                        </div>

                        {isRecipientSame ? (
                            <div className="recipient-block">
                                <div className="recipient-info">
                                    {lastName} {firstName} {middleName}, {phone}
                                </div>
                            </div>
                        ) : (
                            <div style={{marginTop: '10px'}}>
                                <div className="form-grid-row">
                                    <input className="form-input" placeholder="Прізвище" value={recLastName} onChange={e => setRecLastName(e.target.value)} />
                                    <input className="form-input" placeholder="Ім'я" value={recFirstName} onChange={e => setRecFirstName(e.target.value)} />
                                </div>
                                <div className="form-grid-row">
                                    <input className="form-input" placeholder="По батькові" value={recMiddleName} onChange={e => setRecMiddleName(e.target.value)} />
                                    <input className="form-input" placeholder="Телефон" value={recPhone} onChange={e => setRecPhone(e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА */}
                <div className="checkout-summary-column">
                    <h3 className="summary-title">Разом</h3>

                    <div className="summary-items-list">
                        {cart.items.map(item => (
                            <div key={item.id} className="summary-item">
                                <img
                                    src={item.photoUrl || "/placeholder.png"}
                                    className="summary-item-img"
                                    onError={e => e.currentTarget.src='/placeholder.png'}
                                    alt={item.title}
                                />
                                <div className="summary-item-info">
                                    <div className="summary-item-title">{item.title}</div>
                                    <div className="summary-item-price">{item.price.toLocaleString()} грн</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bonuses-section">
                        <div className="bonuses-balance">
                            <span>Бонусів доступно:</span>
                            <strong>{userBonuses}</strong>
                        </div>
                        <div className="bonuses-input-group">
                            <input
                                type="number"
                                className="bonus-input"
                                value={bonusesToUse}
                                onChange={e => setBonusesToUse(Number(e.target.value))}
                            />
                            <button
                                className="apply-bonus-btn"
                                onClick={() => {
                                    const max = Math.floor(cart.totalCartPriceWithoutBonuses * 0.5);
                                    const valid = Math.min(bonusesToUse, userBonuses, max);
                                    setAppliedBonuses(valid);
                                    setBonusesToUse(valid);
                                    showNotification(`Списано ${valid} бонусів`, "success");
                                }}
                            >
                                ОК
                            </button>
                        </div>
                    </div>

                    <div className="summary-totals">
                        <div className="total-row">
                            <span>Товари</span>
                            <span>{totalItemsPrice.toLocaleString()} грн</span>
                        </div>
                        <div className="total-row">
                            <span>Доставка</span>
                            <span>{deliveryPrice > 0 ? `${deliveryPrice} грн` : 'За тарифами'}</span>
                        </div>
                        <div className="total-row" style={{color: '#28a745'}}>
                            <span>Знижка</span>
                            <span>-{appliedBonuses} грн</span>
                        </div>
                        <div className="total-main-row">
                            <span>До сплати</span>
                            <span className="grand-total">{grandTotal.toLocaleString()} грн</span>
                        </div>
                    </div>

                    <button className="confirm-order-btn" onClick={handleSubmit}>
                        Підтвердити замовлення
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CheckoutPage;