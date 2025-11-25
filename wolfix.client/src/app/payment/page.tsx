"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import stripePromise from "@/lib/stripe";
import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";
import PaymentForm from "../components/Payment/PaymentForm.client";
import "../../styles/PaymentPage.css";

const PaymentPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const clientSecretParam = searchParams.get("clientSecret");
    const orderIdParam = searchParams.get("orderId"); // Получаем ID заказа

    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        if (clientSecretParam) {
            setClientSecret(clientSecretParam);
        }
    }, [clientSecretParam]);

    const options = {
        clientSecret: clientSecret || "",
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#000000',
            },
        },
    };

    return (
        <div className="payment-page-wrapper">
            <Header logoAlt="Wolfix" />

            <div className="payment-container">
                <div className="payment-card">
                    <h1 className="payment-title">Оплата замовлення</h1>
                    <p className="payment-subtitle">Введіть дані картки для завершення покупки</p>

                    {clientSecret && orderIdParam ? (
                        <Elements stripe={stripePromise} options={options}>
                            {/* Передаем orderId в форму */}
                            <PaymentForm orderId={orderIdParam} />
                        </Elements>
                    ) : (
                        <div className="loading-payment">Завантаження платіжної системи...</div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentPage;