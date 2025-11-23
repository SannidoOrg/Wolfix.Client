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
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CustomerDto>(defaultCustomer);

    useEffect(() => {
        const fetchData = async () => {
            // ВАЖНО: Используем customerId
            if (user?.customerId) {
                try {
                    const res = await api.get(`/api/customers/${user.customerId}`);
                    setCustomer(res.data);
                    setFormData(res.data);
                } catch (error) {
                    console.error("Profile fetch error:", error);
                    setCustomer(defaultCustomer);
                    setFormData(defaultCustomer);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFullNameChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            fullName: { ...prev.fullName, [field]: value }
        }));
    };

    const handleAddressChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            address: {
                city: prev.address?.city || "",
                street: prev.address?.street || "",
                houseNumber: prev.address?.houseNumber || 0,
                apartmentNumber: prev.address?.apartmentNumber || null,
                ...prev.address!,
                [field]: value
            }
        }));
    };

    const handleSaveChanges = async () => {
        // ВАЖНО: Используем customerId
        if (!user?.customerId) return;

        try {
            setLoading(true);
            const requests = [];

            // Patch fullName
            requests.push(api.patch(`/api/customers/${user.customerId}/full-name`, {
                firstName: formData.fullName.firstName,
                lastName: formData.fullName.lastName,
                middleName: formData.fullName.middleName
            }));

            // Patch phone if changed
            if (formData.phoneNumber !== customer?.phoneNumber) {
                requests.push(api.patch(`/api/customers/${user.customerId}/phone-number`, {
                    phoneNumber: formData.phoneNumber
                }));
            }

            // Patch birth date if changed
            if (formData.birthDate !== customer?.birthDate) {
                requests.push(api.patch(`/api/customers/${user.customerId}/birth-date`, {
                    birthDate: formData.birthDate
                }));
            }

            // Patch address
            requests.push(api.patch(`/api/customers/${user.customerId}/address`, {
                city: formData.address?.city,
                street: formData.address?.street,
                houseNumber: Number(formData.address?.houseNumber),
                apartmentNumber: Number(formData.address?.apartmentNumber)
            }));

            await Promise.all(requests);

            setCustomer(formData);
            setIsEditing(false);
            alert("Дані успішно збережено!");
        } catch (error) {
            console.error("Update error:", error);
            alert("Помилка при збереженні даних.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(customer || defaultCustomer);
        setIsEditing(false);
    };

    if (loading && !isEditing) {
        return (
            <div className="profile-card-content" style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight: '400px'}}>
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
        : "Адреса не вказана";

    return (
        <div className="profile-card-content">
            <div className="profile-header-center">
                <img
                    src={data.photoUrl || "/icons/prof.png"}
                    alt="Avatar"
                    className="profile-big-avatar"
                />
                {isEditing ? (
                    <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                        <input className="profile-input" placeholder="Прізвище" value={formData.fullName.lastName || ""} onChange={e => handleFullNameChange("lastName", e.target.value)} />
                        <input className="profile-input" placeholder="Ім'я" value={formData.fullName.firstName || ""} onChange={e => handleFullNameChange("firstName", e.target.value)} />
                        <input className="profile-input" placeholder="По батькові" value={formData.fullName.middleName || ""} onChange={e => handleFullNameChange("middleName", e.target.value)} />
                    </div>
                ) : (
                    <h1>{displayName}</h1>
                )}
            </div>

            <div className="profile-actions">
                {isEditing ? (
                    <div className="edit-actions">
                        <button className="btn-cancel" onClick={handleCancel}>Скасувати</button>
                        <button className="btn-save" onClick={handleSaveChanges}>Зберегти</button>
                    </div>
                ) : (
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>Редагувати</button>
                )}
            </div>

            <section className="profile-section">
                <h2>Особисті дані</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Телефон</span>
                        {isEditing ? (
                            <input
                                className="profile-input"
                                value={formData.phoneNumber || ""}
                                onChange={e => handleInputChange("phoneNumber", e.target.value)}
                                placeholder="+380..."
                            />
                        ) : (
                            <span className="info-value">{phoneNumber || "Не вказано"}</span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="info-label">Електронна пошта</span>
                        <span className="info-value">{user?.email}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Дата народження</span>
                        {isEditing ? (
                            <input
                                type="date"
                                className="profile-input"
                                value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ""}
                                onChange={e => handleInputChange("birthDate", e.target.value)}
                            />
                        ) : (
                            <span className="info-value">
                                {birthDate ? new Date(birthDate).toLocaleDateString('uk-UA') : "Не вказано"}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            <section className="profile-section">
                <h2>Мої адреси доставки</h2>
                {isEditing ? (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <input className="profile-input" placeholder="Місто" value={formData.address?.city || ""} onChange={e => handleAddressChange("city", e.target.value)} />
                        <input className="profile-input" placeholder="Вулиця" value={formData.address?.street || ""} onChange={e => handleAddressChange("street", e.target.value)} />
                        <input className="profile-input" type="number" placeholder="Будинок" value={formData.address?.houseNumber || ""} onChange={e => handleAddressChange("houseNumber", e.target.value)} />
                        <input className="profile-input" type="number" placeholder="Квартира" value={formData.address?.apartmentNumber || ""} onChange={e => handleAddressChange("apartmentNumber", e.target.value)} />
                    </div>
                ) : (
                    <div className="address-row">
                        <div className="address-text">
                            <div style={{fontSize: '13px', color: '#888', marginBottom: '4px'}}>Адреса доставки:</div>
                            {fullAddress}
                        </div>
                        <span className="address-badge">Основна</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PersonalData;