"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { OrderDetailsDto } from "@/types/order";
import "../../../../styles/OrderDetailsPage.css";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params; // Получаем ID заказа из URL

    const [order, setOrder] = useState<OrderDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // Запрос к новому эндпоинту: /api/orders/{orderId}/details
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

    // Формирование адреса доставки
    const getDeliveryAddress = () => {
        const parts = [];
        if (order.deliveryCity) parts.push(order.deliveryCity);
        if (order.deliveryStreet) parts.push(order.deliveryStreet);
        if (order.deliveryHouseNumber) parts.push(`буд. ${order.deliveryHouseNumber}`);
        if (order.deliveryNumber) parts.push(`Відділення №${order.deliveryNumber}`);

        return parts.join(", ") || "Адреса не вказана";
    };

    return (
        <div className="details-container">
            {/* Header Section */}
            <div className="details-header">
                <Link href="/profile/orders" className="back-link">
                    ← До списку замовлень
                </Link>
                <div className="details-title-row">
                    <h1 className="details-title">
                        Замовлення №{order.number || order.id.slice(0, 8)}
                    </h1>
                    <span className="details-status-badge">
                        {order.deliveryStatus || "Статус невідомий"}
                    </span>
                </div>
            </div>

            <div className="details-grid">
                {/* Left Column: Products */}
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

                {/* Right Column: Info Summary */}
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
                            <strong>{order.deliveryMethodName || "Самовивіз"}</strong><br/>
                            {getDeliveryAddress()}
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="info-label">Оплата</div>
                        <div className="info-value">
                            {order.paymentOption || "Готівка"}<br/>
                            <span style={{
                                color: order.paymentStatus === 'Paid' ? '#22c55e' : '#f59e0b',
                                fontWeight: 500
                            }}>
                                {order.paymentStatus === 'Paid' ? "Оплачено" : order.paymentStatus || "Очікує оплати"}
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