"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";
import api from "@/lib/api";
import { DeliveryOption, OrderPaymentOption, PlaceOrderDto } from "@/types/order";
import { CustomerDto } from "@/types/customer";
import { DeliveryMethodDto, CityDto, DepartmentDto } from "@/types/delivery"; // Импорт новых типов
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

    // --- Получатель ---
    const [isRecipientSame, setIsRecipientSame] = useState(true);
    const [recFirstName, setRecFirstName] = useState("");
    const [recLastName, setRecLastName] = useState("");
    const [recPhone, setRecPhone] = useState("");

    // --- Данные для доставки (API) ---
    const [apiDeliveryMethods, setApiDeliveryMethods] = useState<DeliveryMethodDto[]>([]);

    // --- Выбор пользователя ---
    // 0 = NovaPoshta, 1 = UkrPoshta, 2 = Courier (Enum с сервера)
    const [deliveryOptionEnum, setDeliveryOptionEnum] = useState<DeliveryOption>(DeliveryOption.NovaPoshta);

    // Состояние для селекторов (ID выбранных объектов)
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

                // По умолчанию выбираем первый метод, если есть
                if (res.data.length > 0) {
                    setSelectedMethodId(res.data[0].id);
                    determineDeliveryEnum(res.data[0].name);
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
                setPhone(profile.phoneNumber || '');
                setEmail(user.email || '');
                setRecFirstName(profile.fullName?.firstName || '');
                setRecLastName(profile.fullName?.lastName || '');
                setRecPhone(profile.phoneNumber || '');

                if (profile.address?.city) setManualCity(profile.address.city);
                if (profile.address?.street) setStreet(profile.address.street);
                if (profile.address?.houseNumber) setHouse(String(profile.address.houseNumber));
            } catch (e) { console.error(e); }
        };
        if (user) loadProfileData();
    }, [user]);

    // --- Хелперы для выборки данных ---
    const currentApiMethod = apiDeliveryMethods.find(m => m.id === selectedMethodId);

    const currentCityList = currentApiMethod?.cities || [];
    const currentCity = currentCityList.find(c => c.id === selectedCityId);

    const currentDepartmentList = currentCity?.departments || [];
    const currentDepartment = currentDepartmentList.find(d => d.id === selectedDeptId);

    // Определяем Enum (0, 1) на основе имени метода с сервера
    const determineDeliveryEnum = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("нова") || lowerName.includes("nova")) {
            setDeliveryOptionEnum(DeliveryOption.NovaPoshta);
        } else if (lowerName.includes("укр") || lowerName.includes("ukr")) {
            setDeliveryOptionEnum(DeliveryOption.UkrPoshta);
        }
    };

    // Обработчик смены метода
    const handleMethodChange = (methodId: string) => {
        setSelectedMethodId(methodId);
        const method = apiDeliveryMethods.find(m => m.id === methodId);
        if (method) determineDeliveryEnum(method.name);

        // Сброс вложенных выборов
        setSelectedCityId("");
        setSelectedDeptId("");
    };

    // Обработчик выбора курьера
    const handleCourierSelect = () => {
        setDeliveryOptionEnum(DeliveryOption.Courier);
        // Сбрасываем ID метода API, чтобы скрыть селекты
        setSelectedMethodId("courier");
    };

    // --- Валидация и Сабмит ---
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
        let methodName = "";

        // Логика сбора данных доставки
        if (deliveryOptionEnum === DeliveryOption.Courier) {
            if (!manualCity || !street || !house) {
                showNotification("Заповніть адресу доставки", "error");
                return;
            }
            finalCity = manualCity;
            finalStreet = street;
            finalHouse = Number(house);
            methodName = "Адресна доставка кур'єром";
        } else {
            // Доставка в отделение (API)
            if (!selectedCityId || !selectedDeptId || !currentCity || !currentDepartment) {
                showNotification("Оберіть місто та відділення", "error");
                return;
            }
            finalCity = currentCity.name;
            finalDeptNumber = currentDepartment.number;
            methodName = currentApiMethod?.name || "Доставка у відділення";
        }

        setLoading(true);

        const orderDto: PlaceOrderDto = {
            order: {
                customerId: user.customerId,
                customerFirstName: firstName,
                customerLastName: lastName,
                customerEmail: email,
                customerPhoneNumber: phone,

                recipientFirstName: isRecipientSame ? firstName : recFirstName,
                recipientLastName: isRecipientSame ? lastName : recLastName,
                recipientPhoneNumber: isRecipientSame ? phone : recPhone,

                deliveryOption: deliveryOptionEnum,
                deliveryMethodName: methodName,

                deliveryInfoCity: finalCity,
                deliveryInfoNumber: finalDeptNumber,
                deliveryInfoStreet: finalStreet,
                deliveryInfoHouseNumber: finalHouse,

                withBonuses: appliedBonuses > 0,
                usedBonusesAmount: appliedBonuses,
                price: cart!.totalCartPriceWithoutBonuses - appliedBonuses + (deliveryOptionEnum === DeliveryOption.Courier ? 70 : 0)
            },
            orderItems: cart!.items.map(item => ({
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
            console.error(error);
            showNotification("Помилка створення замовлення", "error");
        } finally {
            setLoading(false);
        }
    };

    // --- Render Helpers ---
    if (!cart || cart.items.length === 0) return null; // Или лоадер

    const totalItemsPrice = cart.totalCartPriceWithoutBonuses;
    const courierPrice = 70;
    const deliveryCost = deliveryOptionEnum === DeliveryOption.Courier ? courierPrice : 0;
    const grandTotal = totalItemsPrice - appliedBonuses + deliveryCost;

    return (
        <div className="checkout-page">
            <Header logoAlt="Wolfix" />
            <h1 className="checkout-header-title">Оформлення замовлення</h1>

            <div className="checkout-layout">
                <div className="checkout-form-column">
                    {/* 1. Контакты */}
                    <div className="checkout-section">
                        <h2 className="section-title">Замовник</h2>
                        <div className="form-grid-row">
                            <input className="form-input" placeholder="Прізвище" value={lastName} onChange={e => setLastName(e.target.value)} />
                            <input className="form-input" placeholder="Ім'я" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-grid-row">
                            <input className="form-input" placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} />
                            <input className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>

                    {/* 2. Доставка */}
                    <div className="checkout-section">
                        <h2 className="section-title">Спосіб доставки</h2>
                        <div className="radio-group">

                            {/* Динамические методы с сервера (Отделения) */}
                            {apiDeliveryMethods.map(method => (
                                <label key={method.id} className="radio-label">
                                    <div className="radio-content">
                                        <input
                                            type="radio"
                                            className="custom-radio"
                                            name="delivery"
                                            checked={selectedMethodId === method.id}
                                            onChange={() => handleMethodChange(method.id)}
                                        />
                                        <span className="radio-text">{method.name} (Відділення)</span>
                                    </div>
                                    <span className="delivery-price">За тарифами</span>
                                </label>
                            ))}

                            {/* Статический метод: Курьер */}
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
                                <span className="delivery-price">{courierPrice} грн</span>
                            </label>
                        </div>

                        {/* Селекторы для API методов */}
                        {selectedMethodId !== "courier" && selectedMethodId !== "" && (
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

                        {/* Поля для Курьера */}
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

                    {/* 3. Оплата */}
                    <div className="checkout-section">
                        <h2 className="section-title">Спосіб оплати</h2>
                        <div className="radio-group">
                            <label className="radio-label">
                                <div className="radio-content">
                                    <input type="radio" className="custom-radio" checked={paymentMethod === OrderPaymentOption.Cash} onChange={() => setPaymentMethod(OrderPaymentOption.Cash)} />
                                    <span className="radio-text">Оплата під час отримання</span>
                                </div>
                            </label>
                            <label className="radio-label" style={{opacity: 0.5}}>
                                <div className="radio-content">
                                    <input type="radio" className="custom-radio" disabled />
                                    <span className="radio-text">Оплатити карткою (Скоро)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 4. Получатель */}
                    <div className="checkout-section">
                        <h2 className="section-title">Отримувач</h2>
                        <div className="recipient-block">
                            <div className="recipient-info">
                                {isRecipientSame ? `${lastName} ${firstName}, ${phone}` : `${recLastName} ${recFirstName}, ${recPhone}`}
                            </div>
                            <button className="change-recipient-btn" onClick={() => setIsRecipientSame(!isRecipientSame)}>
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

                {/* Правая колонка (Итоги) */}
                <div className="checkout-summary-column">
                    <h3 className="summary-title">Разом</h3>
                    <div className="summary-items-list">
                        {cart.items.map(item => (
                            <div key={item.id} className="summary-item">
                                <img src={item.photoUrl || '/placeholder.png'} className="summary-item-img" onError={e => e.currentTarget.src='/placeholder.png'}/>
                                <div className="summary-item-info">
                                    <div className="summary-item-title">{item.title}</div>
                                    <div className="summary-item-price">{item.price.toLocaleString()} грн</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Бонусы */}
                    <div className="bonuses-section">
                        <div className="bonuses-balance"><span>Бонусів доступно:</span><strong>{cart.bonusesAmount}</strong></div>
                        <div className="bonuses-input-group">
                            <input
                                type="number"
                                className="bonus-input"
                                value={bonusesToUse}
                                onChange={e => setBonusesToUse(Number(e.target.value))}
                                placeholder="Сума списання"
                            />
                            <button className="apply-bonus-btn" onClick={() => {
                                const max = Math.floor(cart.totalCartPriceWithoutBonuses * 0.5);
                                const valid = Math.min(bonusesToUse, cart.bonusesAmount, max);
                                setAppliedBonuses(valid);
                                showNotification(`Списано ${valid} бонусів`, "success");
                            }}>ОК</button>
                        </div>
                    </div>

                    <div className="summary-totals">
                        <div className="total-row"><span>Товари</span><span>{totalItemsPrice.toLocaleString()} грн</span></div>
                        <div className="total-row"><span>Доставка</span><span>{deliveryCost} грн</span></div>
                        <div className="total-row" style={{color:'green'}}><span>Знижка</span><span>-{appliedBonuses} грн</span></div>
                        <div className="total-main-row"><span>До сплати</span><span className="grand-total">{grandTotal.toLocaleString()} грн</span></div>
                    </div>

                    <button className="confirm-order-btn" onClick={handleSubmit}>Підтвердити замовлення</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CheckoutPage;