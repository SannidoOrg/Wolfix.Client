"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { CustomerDto } from "@/types/customer";
import "../../../styles/ProfilePage.css";

const defaultCustomer: CustomerDto = {
    id: "",
    photoUrl: null,
    fullName: { firstName: "", lastName: "", middleName: "" },
    phoneNumber: "",
    address: { city: "", street: "", houseNumber: null, apartmentNumber: null },
    birthDate: null,
    bonusesAmount: 0
};

const PersonalData = () => {
    const { user } = useAuth();
    const [customer, setCustomer] = useState<CustomerDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.userId) {
                try {
                    const res = await api.get(`/api/customers/${user.userId}`);
                    setCustomer(res.data);
                } catch (error) {
                    console.error("Profile fetch error:", error);
                    setCustomer(defaultCustomer);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="profile-main-content" style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight: '400px'}}>
                <span style={{color: '#888'}}>Завантаження профілю...</span>
            </div>
        );
    }

    const data = customer || defaultCustomer;
    const { fullName, address, phoneNumber, birthDate } = data;

    const displayName = [fullName?.lastName, fullName?.firstName, fullName?.middleName]
        .filter(Boolean)
        .join(" ") || "Гість";

    const fullAddress = address && address.city
        ? `м. ${address.city}, вул. ${address.street || ''}, буд. ${address.houseNumber || ''}${address.apartmentNumber ? `, кв. ${address.apartmentNumber}` : ''}`
        : "Адреса не додана";

    return (
        <div className="profile-main-content">

            {/* Аватар и Имя */}
            <div className="profile-title-center">
                <img
                    src={data.photoUrl || "/icons/prof.png"}
                    alt="Avatar"
                    className="profile-avatar-center"
                />
                <h1>{displayName}</h1>
            </div>

            {/* Кнопки */}
            <div className="profile-actions-right">
                <button className="btn-text">Видалити</button>
                <button className="btn-outline">Редагувати</button>
            </div>

            {/* Личные данные */}
            <section className="data-section">
                <h2>Особисті дані</h2>
                <div className="data-grid-row">
                    {/* Левая колонка */}
                    <div>
                        <div className="data-field">
                            <span className="data-label">Телефон</span>
                            <span className="data-value">{phoneNumber || "Не вказано"}</span>
                        </div>
                        <div className="data-field">
                            <span className="data-label">Дата народження</span>
                            <span className="data-value">
                                {birthDate ? new Date(birthDate).toLocaleDateString('uk-UA') : "Не вказано"}
                            </span>
                        </div>
                    </div>

                    {/* Правая колонка */}
                    <div>
                        <div className="data-field">
                            <span className="data-label">Електронна пошта</span>
                            <span className="data-value">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Адреса */}
            <section className="data-section">
                <h2>Мої адреси доставки</h2>
                <div className="address-item">
                    <div>
                        <span className="data-label">Адреса доставки замовлення:</span>
                        <div className="address-text">{fullAddress}</div>
                    </div>
                    <span className="address-status">Адреса за замовчуванням</span>
                </div>
            </section>
        </div>
    );
};

export default PersonalData;