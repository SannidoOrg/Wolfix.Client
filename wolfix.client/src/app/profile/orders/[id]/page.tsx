"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
    OrderDetailsDto,
    OrderPaymentStatus,
    OrderDeliveryStatus,
    OrderPaymentOption
} from "@/types/order";
import "../../../../styles/OrderDetailsPage.css";

export default function OrderDetailsPage() {
    const params = useParams();
    const { id } = params;

    const [order, setOrder] = useState<OrderDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await api.get<OrderDetailsDto>(`/api/orders/${id}/details`);
                setOrder(response.data);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError("Не вдалося завантажити деталі замовлення.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Завантаження...</div>;
    }

    if (error || !order) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'red', marginBottom: '10px' }}>{error || "Замовлення не знайдено"}</p>
                <Link href="/profile/orders" style={{ textDecoration: 'underline' }}>
                    Повернутися до списку
                </Link>
            </div>
        );
    }

    // --- Хелперы для отображения ---

    const getDeliveryAddress = () => {
        const parts = [];
        if (order.deliveryCity) parts.push(order.deliveryCity);
        if (order.deliveryStreet) parts.push(order.deliveryStreet);
        if (order.deliveryHouseNumber) parts.push(`буд. ${order.deliveryHouseNumber}`);
        if (order.deliveryNumber) parts.push(`Відділення №${order.deliveryNumber}`);

        return parts.join(", ") || "Адреса не вказана";
    };

    const getDeliveryStatusLabel = (status: OrderDeliveryStatus) => {
        switch (status) {
            case OrderDeliveryStatus.Preparing: return "Готується до відправки";
            case OrderDeliveryStatus.OnTheWay: return "В дорозі";
            default: return "В обробці";
        }
    };

    const getPaymentOptionLabel = (option: OrderPaymentOption) => {
        switch (option) {
            case OrderPaymentOption.WhileReceiving: return "При отриманні";
            case OrderPaymentOption.Card: return "Картою онлайн";
            default: return "Невідомо";
        }
    };

    const getPaymentStatusLabel = (status: OrderPaymentStatus) => {
        switch (status) {
            case OrderPaymentStatus.Paid: return { text: "Оплачено", color: "#22c55e" };
            case OrderPaymentStatus.Pending: return { text: "В обробці", color: "#f59e0b" }; // Yellow/Orange
            case OrderPaymentStatus.Unpaid: return { text: "Не оплачено", color: "#ef4444" }; // Red
            default: return { text: "Невідомо", color: "#000" };
        }
    };

    const paymentStatusInfo = getPaymentStatusLabel(order.paymentStatus);

    return (
        <div className="details-container">
            <div className="details-header">
                <Link href="/profile/orders" className="back-link">
                    ← До списку замовлень
                </Link>
                <div className="details-title-row">
                    <h1 className="details-title">
                        Замовлення №{order.number || order.id.slice(0, 8)}
                    </h1>
                    <span className="details-status-badge">
                        {getDeliveryStatusLabel(order.deliveryStatus)}
                    </span>
                </div>
            </div>

            <div className="details-grid">
                {/* Список товаров */}
                <div className="items-card">
                    <h2 className="items-title">Товари ({order.orderItems?.length || 0})</h2>

                    {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item) => (
                            <div key={item.id} className="item-row">
                                <img
                                    src={item.photoUrl || "/placeholder.png"}
                                    alt={item.title || "Product"}
                                    className="item-image"
                                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                                />
                                <div className="item-info">
                                    <Link href={`/products/${item.productId}`} className="item-name">
                                        {item.title || "Товар без назви"}
                                    </Link>
                                    <div className="item-meta">
                                        Кількість: {item.quantity} шт.
                                    </div>
                                </div>
                                <div className="item-total">
                                    {(item.price * item.quantity).toLocaleString()} ₴
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Немає товарів у замовленні</p>
                    )}
                </div>

                {/* Информация справа */}
                <div className="info-card">
                    <div className="info-section">
                        <div className="info-label">Отримувач</div>
                        <div className="info-value">
                            <strong>{order.recipientFirstName} {order.recipientLastName}</strong><br/>
                            {order.recipientPhoneNumber}
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="info-label">Доставка</div>
                        <div className="info-value">
                            <strong>{order.deliveryMethodName || "Доставка"}</strong><br/>
                            {getDeliveryAddress()}
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="info-label">Оплата</div>
                        <div className="info-value">
                            {getPaymentOptionLabel(order.paymentOption)}<br/>
                            <span style={{ color: paymentStatusInfo.color, fontWeight: 600 }}>
                                {paymentStatusInfo.text}
                            </span>
                        </div>
                    </div>

                    <div className="total-divider"></div>

                    <div className="total-row">
                        <div className="total-label">До сплати:</div>
                        <div className="total-price">{order.price.toLocaleString()} ₴</div>
                    </div>
                </div>
            </div>
        </div>
    );
}