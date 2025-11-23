"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { CustomerDto } from "@/types/customer";
// Убедитесь, что путь импорта CSS правильный
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
            <div className="profile-card-content" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'400px'}}>
                Завантаження профілю...
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
        : "Адреса не вказана";

    return (
        <div className="profile-card-content">

            {/* Шапка: Аватар и Имя */}
            <div className="profile-header-center">
                <img
                    src={data.photoUrl || "/icons/prof.png"}
                    alt="Avatar"
                    className="profile-big-avatar"
                />
                <h1>{displayName}</h1>
            </div>

            {/* Кнопки */}
            <div className="profile-actions">
                <button className="btn-text">Видалити</button>
                <button className="btn-edit">Редагувати</button>
            </div>

            {/* Личные данные */}
            <section className="profile-section">
                <h2>Особисті дані</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Телефон</span>
                        <span className="info-value">{phoneNumber || "Не вказано"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Електронна пошта</span>
                        <span className="info-value">{user?.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Дата народження</span>
                        <span className="info-value">
                            {birthDate ? new Date(birthDate).toLocaleDateString('uk-UA') : "Не вказано"}
                        </span>
                    </div>
                </div>
            </section>

            {/* Адреса */}
            <section className="profile-section">
                <h2>Мої адреси доставки</h2>
                <div className="address-row">
                    <div className="address-text">
                        <div style={{fontSize: '13px', color: '#888', marginBottom: '4px'}}>Адреса доставки:</div>
                        {fullAddress}
                    </div>
                    <span className="address-badge">Основна</span>
                </div>
            </section>
        </div>
    );
};

export default PersonalData;