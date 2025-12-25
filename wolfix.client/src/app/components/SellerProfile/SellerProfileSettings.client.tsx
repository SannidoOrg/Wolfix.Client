"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    getSellerProfile,
    changeSellerFullName,
    changeSellerPhoneNumber,
    changeSellerAddress,
    changeSellerBirthDate,
    SellerProfileDto,
} from "@/services/userProfileService"; // Убедитесь, что путь к файлу верный
import "@/styles/SellerProfile.css";

// Helper type to track initial state for comparison
type ProfileState = {
    firstName: string;
    lastName: string;
    middleName: string;
    phoneNumber: string;
    birthDate: string;
    city: string;
    street: string;
    houseNumber: string;
    apartmentNumber: string;
};

const SellerProfileSettings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // --- Form State ---
    // Full Name
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");

    // Contacts
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");

    // Address
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");

    // Initial state to check dirty fields
    const [initialState, setInitialState] = useState<ProfileState | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.customerId) return;

            try {
                const data: SellerProfileDto = await getSellerProfile(user.customerId);

                // Parse dates safely
                let formattedDate = "";
                if (data.birthDate) {
                    const d = new Date(data.birthDate);
                    if (!isNaN(d.getTime())) {
                        formattedDate = d.toISOString().split("T")[0];
                    }
                }

                const state: ProfileState = {
                    firstName: data.fullName?.firstName || "",
                    lastName: data.fullName?.lastName || "",
                    middleName: data.fullName?.middleName || "",
                    phoneNumber: data.phoneNumber || "",
                    birthDate: formattedDate,
                    city: data.address?.city || "",
                    street: data.address?.street || "",
                    houseNumber: data.address?.houseNumber?.toString() || "",
                    apartmentNumber: data.address?.apartmentNumber?.toString() || "",
                };

                // Set inputs
                setFirstName(state.firstName);
                setLastName(state.lastName);
                setMiddleName(state.middleName);
                setPhoneNumber(state.phoneNumber);
                setBirthDate(state.birthDate);
                setCity(state.city);
                setStreet(state.street);
                setHouseNumber(state.houseNumber);
                setApartmentNumber(state.apartmentNumber);

                setInitialState(state);
            } catch (error) {
                console.error("Failed to load seller profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || !initialState) return;

        setIsSaving(true);
        const promises = [];

        try {
            // 1. Check Full Name changes
            if (
                firstName !== initialState.firstName ||
                lastName !== initialState.lastName ||
                middleName !== initialState.middleName
            ) {
                promises.push(
                    changeSellerFullName(user.id, {
                        firstName,
                        lastName,
                        middleName,
                    })
                );
            }

            // 2. Check Phone Number
            if (phoneNumber !== initialState.phoneNumber) {
                promises.push(changeSellerPhoneNumber(user.id, phoneNumber));
            }

            // 3. Check Address changes
            if (
                city !== initialState.city ||
                street !== initialState.street ||
                houseNumber !== initialState.houseNumber ||
                apartmentNumber !== initialState.apartmentNumber
            ) {
                // Convert numbers
                const hNum = parseInt(houseNumber, 10);
                const aptNum = apartmentNumber ? parseInt(apartmentNumber, 10) : null;

                if (!isNaN(hNum)) {
                    promises.push(
                        changeSellerAddress(user.id, {
                            city,
                            street,
                            houseNumber: hNum,
                            apartmentNumber: aptNum,
                        })
                    );
                } else {
                    console.warn("House number is invalid, skipping address update");
                }
            }

            // 4. Check Birth Date
            if (birthDate !== initialState.birthDate) {
                promises.push(changeSellerBirthDate(user.id, birthDate));
            }

            if (promises.length === 0) {
                alert("Немає змін для збереження.");
                setIsSaving(false);
                return;
            }

            await Promise.all(promises);

            // Update initial state
            setInitialState({
                firstName,
                lastName,
                middleName,
                phoneNumber,
                birthDate,
                city,
                street,
                houseNumber,
                apartmentNumber,
            });

            alert("Профіль успішно оновлено!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Сталася помилка при збереженні. Перевірте консоль.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-state">Завантаження профілю...</div>;

    return (
        <div className="profile-settings-wrapper">
            <div className="profile-header">
                <h2>Особистий профіль</h2>
                <p>Керуйте своїми особистими даними та адресою</p>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Block: Personal Info */}
                <div className="form-section">
                    <h3 className="section-title">Основна інформація</h3>
                    <div className="form-grid three-cols">
                        <div className="input-group">
                            <label>Прізвище</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Шевченко"
                            />
                        </div>
                        <div className="input-group">
                            <label>Ім'я</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Тарас"
                            />
                        </div>
                        <div className="input-group">
                            <label>По батькові</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                placeholder="Григорович"
                            />
                        </div>
                    </div>

                    <div className="form-grid two-cols mt-4">
                        <div className="input-group">
                            <label>Дата народження</label>
                            <input
                                type="date"
                                className="wolfix-input"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Телефон</label>
                            <input
                                type="tel"
                                className="wolfix-input"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+380..."
                            />
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* Block: Address */}
                <div className="form-section">
                    <h3 className="section-title">Адреса</h3>
                    <div className="form-grid two-cols">
                        <div className="input-group">
                            <label>Місто</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Київ"
                            />
                        </div>
                        <div className="input-group">
                            <label>Вулиця</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="Хрещатик"
                            />
                        </div>
                    </div>

                    <div className="form-grid two-cols mt-4 small-grid">
                        <div className="input-group">
                            <label>Номер будинку</label>
                            <input
                                type="number"
                                className="wolfix-input"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                                placeholder="10"
                            />
                        </div>
                        <div className="input-group">
                            <label>Номер квартири</label>
                            <input
                                type="number"
                                className="wolfix-input"
                                value={apartmentNumber}
                                onChange={(e) => setApartmentNumber(e.target.value)}
                                placeholder="25"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={isSaving}>
                        {isSaving ? "Збереження..." : "Зберегти зміни"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerProfileSettings;