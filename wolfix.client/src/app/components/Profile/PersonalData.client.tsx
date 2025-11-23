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
            if (user?.customerId) {
                try {
                    const res = await api.get(`/api/customers/${user.customerId}`);
                    const apiData = res.data;

                    // Нормализация данных при загрузке
                    const normalizedData: CustomerDto = {
                        ...defaultCustomer,
                        ...apiData,
                        fullName: apiData.fullName || defaultCustomer.fullName,
                        address: apiData.address || defaultCustomer.address,
                    };

                    setCustomer(normalizedData);
                    setFormData(normalizedData);
                } catch (error) {
                    console.error("Profile fetch error:", error);
                    setCustomer(defaultCustomer);
                    setFormData(defaultCustomer);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
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
            fullName: { ...(prev.fullName || {}), [field]: value }
        }));
    };

    const handleAddressChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: {
                city: "",
                street: "",
                houseNumber: null,
                apartmentNumber: null,
                ...(prev.address || {}),
                [field]: value
            }
        }));
    };

    const handleSaveChanges = async () => {
        if (!user?.customerId) {
            alert("Помилка: ID користувача не знайдено.");
            return;
        }

        try {
            setLoading(true);
            const requests = [];

            // --- 1. Full Name ---
            const isNameChanged =
                (formData.fullName?.firstName || "") !== (customer?.fullName?.firstName || "") ||
                (formData.fullName?.lastName || "") !== (customer?.fullName?.lastName || "") ||
                (formData.fullName?.middleName || "") !== (customer?.fullName?.middleName || "");

            if (isNameChanged) {
                requests.push(api.patch(`/api/customers/${user.customerId}/full-name`, {
                    firstName: formData.fullName?.firstName || "",
                    lastName: formData.fullName?.lastName || "",
                    middleName: formData.fullName?.middleName || ""
                }));
            }

            // --- 2. Phone ---
            // Сравниваем строки, учитывая null как пустую строку
            const formPhone = formData.phoneNumber || "";
            const dbPhone = customer?.phoneNumber || "";

            if (formPhone !== dbPhone) {
                requests.push(api.patch(`/api/customers/${user.customerId}/phone-number`, {
                    phoneNumber: formPhone || null // Отправляем null если пусто
                }));
            }

            // --- 3. Birth Date ---
            const formDate = formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : null;
            const dbDate = customer?.birthDate ? new Date(customer.birthDate).toISOString().split('T')[0] : null;

            if (formDate !== dbDate) {
                requests.push(api.patch(`/api/customers/${user.customerId}/birth-date`, {
                    birthDate: formDate
                }));
            }

            // --- 4. Address ---
            // Приводим типы для корректного сравнения и отправки
            const formHouse = formData.address?.houseNumber ? Number(formData.address.houseNumber) : 0;
            const dbHouse = customer?.address?.houseNumber || 0;

            const formApt = formData.address?.apartmentNumber ? Number(formData.address.apartmentNumber) : null;
            const dbApt = customer?.address?.apartmentNumber || null;

            const formCity = formData.address?.city || "";
            const dbCity = customer?.address?.city || "";

            const formStreet = formData.address?.street || "";
            const dbStreet = customer?.address?.street || "";

            const isAddressChanged =
                formCity !== dbCity ||
                formStreet !== dbStreet ||
                formHouse !== dbHouse ||
                formApt !== dbApt;

            if (isAddressChanged) {
                requests.push(api.patch(`/api/customers/${user.customerId}/address`, {
                    city: formCity || null,
                    street: formStreet || null,
                    houseNumber: formHouse, // int32
                    apartmentNumber: formApt // int32 | null
                }));
            }

            // Если изменений нет, просто выходим из режима редактирования
            if (requests.length === 0) {
                setIsEditing(false);
                setLoading(false);
                return;
            }

            // Выполняем только нужные запросы
            await Promise.all(requests);

            // Обновляем локальный "чистовик", приводя типы к правильным (числам)
            setCustomer({
                ...formData,
                address: {
                    ...formData.address!,
                    houseNumber: formHouse,
                    apartmentNumber: formApt
                }
            });

            setIsEditing(false);
            alert("Дані успішно збережено!");

        } catch (error: any) {
            console.error("Update error:", error);
            if (error.response?.data?.errors) {
                // Выводим детали валидации, если они есть
                alert(`Помилка валідації: ${JSON.stringify(error.response.data.errors)}`);
            } else {
                alert("Помилка при збереженні даних. Перевірте правильність введених полів.");
            }
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

    const data = formData;
    const fullName = data.fullName || defaultCustomer.fullName;
    const address = data.address || defaultCustomer.address;

    const displayName = [fullName.lastName, fullName.firstName, fullName.middleName]
        .filter(Boolean)
        .join(" ") || "Гість";

    const displayAddress = (address.city || address.street)
        ? `м. ${address.city || '...'}, вул. ${address.street || '...'}, буд. ${address.houseNumber || '...'}${address.apartmentNumber ? `, кв. ${address.apartmentNumber}` : ''}`
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
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', width: '100%', maxWidth: '400px'}}>
                        <input
                            className="profile-input"
                            placeholder="Прізвище"
                            value={fullName.lastName || ""}
                            onChange={e => handleFullNameChange("lastName", e.target.value)}
                        />
                        <input
                            className="profile-input"
                            placeholder="Ім'я"
                            value={fullName.firstName || ""}
                            onChange={e => handleFullNameChange("firstName", e.target.value)}
                        />
                        <input
                            className="profile-input"
                            placeholder="По батькові"
                            value={fullName.middleName || ""}
                            onChange={e => handleFullNameChange("middleName", e.target.value)}
                        />
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
                                value={data.phoneNumber || ""}
                                onChange={e => handleInputChange("phoneNumber", e.target.value)}
                                placeholder="+380..."
                            />
                        ) : (
                            <span className="info-value">{data.phoneNumber || "Не вказано"}</span>
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
                                value={data.birthDate ? String(data.birthDate).split('T')[0] : ""}
                                onChange={e => handleInputChange("birthDate", e.target.value)}
                            />
                        ) : (
                            <span className="info-value">
                                {data.birthDate ? new Date(data.birthDate).toLocaleDateString('uk-UA') : "Не вказано"}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            <section className="profile-section">
                <h2>Мої адреси доставки</h2>
                {isEditing ? (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <input className="profile-input" placeholder="Місто" value={address.city || ""} onChange={e => handleAddressChange("city", e.target.value)} />
                        <input className="profile-input" placeholder="Вулиця" value={address.street || ""} onChange={e => handleAddressChange("street", e.target.value)} />
                        <input className="profile-input" type="number" placeholder="Будинок" value={address.houseNumber || ""} onChange={e => handleAddressChange("houseNumber", e.target.value)} />
                        <input className="profile-input" type="number" placeholder="Квартира" value={address.apartmentNumber || ""} onChange={e => handleAddressChange("apartmentNumber", e.target.value)} />
                    </div>
                ) : (
                    <div className="address-row">
                        <div className="address-text">
                            <div style={{fontSize: '13px', color: '#888', marginBottom: '4px'}}>Адреса доставки:</div>
                            {displayAddress}
                        </div>
                        <span className="address-badge">Основна</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PersonalData;