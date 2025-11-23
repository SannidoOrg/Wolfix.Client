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

    // Режим редактирования
    const [isEditing, setIsEditing] = useState(false);

    // Временное состояние формы
    const [formData, setFormData] = useState<CustomerDto>(defaultCustomer);

    useEffect(() => {
        const fetchData = async () => {
            // ИЗМЕНЕНИЕ: Проверяем customerId
            if (user?.customerId) {
                try {
                    // ИЗМЕНЕНИЕ: Используем customerId в URL
                    const res = await api.get(`/api/customers/${user.customerId}`);
                    setCustomer(res.data);
                    setFormData(res.data);
                } catch (error) {
                    // ...
                } finally {
                    setLoading(false);
                }
            } else if (user) {
                // Если пользователь есть, но customerId нет (например, Админ зашел в профиль покупателя)
                console.warn("No customerId found in token");
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Обработчики изменений в инпутах
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
                ...prev.address!, // Non-null assertion т.к. мы инициализировали дефолт
                [field]: value
            }
        }));
    };

    // Сохранение данных
    const handleSaveChanges = async () => {
        if (!user?.customerId) return;

        try {
            setLoading(true);

            // Отправляем запросы параллельно согласно Swagger
            const requests = [];

            // 1. ФИО
            requests.push(api.patch(`/api/customers/${user.customerId}/full-name`, {
                firstName: formData.fullName.firstName,
                lastName: formData.fullName.lastName,
                middleName: formData.fullName.middleName
            }));

            // 2. Телефон
            if (formData.phoneNumber !== customer?.phoneNumber) {
                requests.push(api.patch(`/api/customers/${user.customerId}/phone-number`, {
                    phoneNumber: formData.phoneNumber
                }));
            }

            // 3. Дата рождения
            if (formData.birthDate !== customer?.birthDate) {
                requests.push(api.patch(`/api/customers/${user.customerId}/birth-date`, {
                    birthDate: formData.birthDate
                }));
            }

            // 4. Адрес
            requests.push(api.patch(`/api/customers/${user.customerId}/address`, {
                city: formData.address?.city,
                street: formData.address?.street,
                houseNumber: Number(formData.address?.houseNumber),
                apartmentNumber: Number(formData.address?.apartmentNumber)
            }));

            await Promise.all(requests);

            // Обновляем основные данные
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
        setFormData(customer || defaultCustomer); // Сбрасываем изменения
        setIsEditing(false);
    };

    if (loading && !isEditing) {
        return (
            <div className="profile-card-content" style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight: '400px'}}>
                <span style={{color: '#888'}}>Завантаження...</span>
            </div>
        );
    }

    const displayName = [formData.fullName?.lastName, formData.fullName?.firstName, formData.fullName?.middleName]
        .filter(Boolean)
        .join(" ") || "Гість";

    const fullAddress = formData.address && formData.address.city
        ? `м. ${formData.address.city}, вул. ${formData.address.street || ''}, буд. ${formData.address.houseNumber || ''}${formData.address.apartmentNumber ? `, кв. ${formData.address.apartmentNumber}` : ''}`
        : "Адреса не вказана";

    return (
        <div className="profile-card-content">

            {/* Шапка */}
            <div className="profile-header-center">
                <img
                    src={formData.photoUrl || "/icons/prof.png"}
                    alt="Avatar"
                    className="profile-big-avatar"
                />
                {/* В режиме редактирования показываем инпуты для имени */}
                {isEditing ? (
                    <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                        <input className="profile-input" placeholder="Прізвище" value={formData.fullName.lastName || ""} onChange={e => handleFullNameChange("lastName", e.target.value)} />
                        <input className="profile-input" placeholder="Ім'я" value={formData.fullName.firstName || ""} onChange={e => handleFullNameChange("firstName", e.target.value)} />
                        <input className="profile-input" placeholder="По батькові" value={formData.fullName.middleName || ""} onChange={e => handleFullNameChange("middleName", e.target.value)} />
                    </div>
                ) : (
                    <h1>{displayName}</h1>
                )}
            </div>

            {/* Кнопки управления */}
            <div className="profile-actions">
                {/* Кнопку "Видалити" убрали по запросу */}

                {isEditing ? (
                    <div className="edit-actions">
                        <button className="btn-cancel" onClick={handleCancel}>Скасувати</button>
                        <button className="btn-save" onClick={handleSaveChanges}>Зберегти</button>
                    </div>
                ) : (
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>Редагувати</button>
                )}
            </div>

            {/* Секция: Личные данные */}
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
                            <span className="info-value">{formData.phoneNumber || "Не вказано"}</span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="info-label">Електронна пошта</span>
                        {/* Email обычно read-only или меняется через отдельный процесс, оставляем текстом */}
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
                                {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('uk-UA') : "Не вказано"}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Секция: Адреса */}
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