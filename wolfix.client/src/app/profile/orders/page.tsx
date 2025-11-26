"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { CustomerOrderDto, OrderPaymentStatus, OrderDeliveryStatus } from "@/types/order";
import "../../../styles/Orders.css";
import Link from "next/link";

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<CustomerOrderDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.customerId) return;

            try {
                setLoading(true);
                const response = await api.get<CustomerOrderDto[]>(`/api/orders/${user.customerId}`);
                const sortedOrders = response.data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?.customerId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Обновлено под новые статусы: Unpaid, Pending, Paid
    const getPaymentStatusInfo = (status: OrderPaymentStatus) => {
        switch (status) {
            case OrderPaymentStatus.Paid:
                return { label: "Оплачено", className: "status-paid" };
            case OrderPaymentStatus.Pending:
                return { label: "В обробці", className: "status-pending" };
            case OrderPaymentStatus.Unpaid:
                return { label: "Не оплачено", className: "status-failed" };
            default:
                return { label: "Невідомо", className: "" };
        }
    };

    // Обновлено под новые статусы: Preparing, OnTheWay
    const getDeliveryStatusInfo = (status: OrderDeliveryStatus) => {
        switch (status) {
            case OrderDeliveryStatus.Preparing:
                return { label: "Готується до відправки", color: "#eab308" };
            case OrderDeliveryStatus.OnTheWay:
                return { label: "В дорозі", color: "#22c55e" };
            default:
                return { label: "Обробка", color: "#6b7280" };
        }
    };

    const formatProductNames = (names: string[]) => {
        if (!names || names.length === 0) return "Товари не вказано";
        return names.join(", ");
    };

    if (loading) {
        return <div className="orders-container" style={{padding: '40px', textAlign: 'center'}}>Завантаження історії замовлень...</div>;
    }

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1 className="orders-title">Мої замовлення</h1>
                <div className="orders-tabs">
                    <div className="orders-tab active">Історія</div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>У вас ще немає замовлень.</p>
                    <Link href="/" style={{color: '#000', textDecoration:'underline', marginTop: '10px', display: 'inline-block'}}>
                        Перейти до покупок
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
                        const deliveryStatusInfo = getDeliveryStatusInfo(order.deliveryStatus);

                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-left">
                                    <div className="order-number-row">
                                        <span className="order-number">
                                            № {order.number || order.id.slice(0, 8)}
                                        </span>
                                        <span className={`order-status ${paymentStatusInfo.className}`}>
                                            {paymentStatusInfo.label}
                                        </span>
                                        <span
                                            className="order-delivery-status"
                                            style={{ color: deliveryStatusInfo.color }}
                                        >
                                            | {deliveryStatusInfo.label}
                                        </span>
                                    </div>

                                    <div className="order-products-preview">
                                        {formatProductNames(order.productsNames)}
                                    </div>

                                    <div className="order-meta">
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                        <span className="order-method">{order.deliveryMethodName || "Доставка"}</span>
                                    </div>
                                </div>

                                <div className="order-right">
                                    <div className="order-price">
                                        {order.price.toLocaleString()} ₴
                                    </div>
                                    <Link href={`/profile/orders/${order.id}`} className="order-details-btn">
                                        Деталі замовлення
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}