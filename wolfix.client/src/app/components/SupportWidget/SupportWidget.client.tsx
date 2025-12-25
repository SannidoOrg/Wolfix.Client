"use client";

import { useState } from "react";
import SupportModal from "../SupportModal/SupportModal.client"; // Импорт твоей модалки
import "../../../styles/SupportWidget.css"; // Стили для кнопки (см. ниже)

export default function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Сама плавающая кнопка */}
            <button
                className="support-widget-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Підтримка"
            >
                {/* Иконка (можно картинку, можно svg, пока сделал простым символом) */}
                <div className="support-icon">💬</div>
            </button>

            {/* Модалка, которую мы уже сделали */}
            <SupportModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}