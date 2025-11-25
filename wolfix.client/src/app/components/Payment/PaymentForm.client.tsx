"use client";

import { FC, FormEvent, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useGlobalContext } from "@/contexts/GlobalContext";

const PaymentForm: FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { fetchCart } = useUser();
    const { showNotification } = useGlobalContext();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setMessage(null);

        // Получаем URL сайта для редиректа
        const returnUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/profile/orders`
            : undefined;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl || "",
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "Сталася помилка під час оплати.");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            showNotification("Оплата пройшла успішно!", "success");
            await fetchCart(); // Очищаем корзину
            router.push("/profile/orders");
        } else {
            setMessage("Платіж не пройшов. Спробуйте ще раз.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <PaymentElement id="payment-element" />

            {message && <div className="payment-error-message">{message}</div>}

            <button disabled={isLoading || !stripe || !elements} className="pay-now-btn">
                {isLoading ? "Обробка..." : "Сплатити зараз"}
            </button>
        </form>
    );
};

export default PaymentForm;