"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSellerProfile, updateSellerProfile } from "@/services/sellerService";
import { Seller } from "@/types/seller";
import "@/styles/SellerProfile.css";

const SellerProfileSettings = () => {
    const { user } = useAuth();
    const [sellerData, setSellerData] = useState<Seller | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form States
    const [shopName, setShopName] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Socials
    const [instagram, setInstagram] = useState("");
    const [tiktok, setTiktok] = useState("");
    const [telegram, setTelegram] = useState("");

    // Files & Previews
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    // Refs for file inputs
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const data = await getSellerProfile();
                    setSellerData(data);

                    // Pre-fill form
                    setShopName(data.shopName || "");
                    setDescription(data.description || "");
                    setEmail(data.email || "");
                    setPhone(data.phoneNumber || "");
                    setInstagram(data.instagramLink || "");
                    setTiktok(data.tiktokLink || "");
                    setTelegram(data.telegramLink || "");

                    // Set existing images as previews
                    if (data.logoUrl) setLogoPreview(data.logoUrl);
                    if (data.bannerUrl) setBannerPreview(data.bannerUrl);

                } catch (error) {
                    console.error("Failed to fetch seller profile", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append("ShopName", shopName);
            formData.append("Description", description);
            formData.append("Email", email);
            formData.append("PhoneNumber", phone);

            // Socials
            formData.append("InstagramLink", instagram);
            formData.append("TikTokLink", tiktok);
            formData.append("TelegramLink", telegram);

            // Files (only append if new file selected)
            if (logoFile) {
                formData.append("Logo", logoFile);
            }
            if (bannerFile) {
                formData.append("Banner", bannerFile);
            }

            await updateSellerProfile(formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-state">Завантаження профілю...</div>;

    return (
        <div className="profile-settings-wrapper">
            <div className="profile-header">
                <h2>Налаштування магазину</h2>
                <p>Керуйте інформацією про ваш магазин, брендингом та контактами</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Media Section */}
                <div className="media-section">
                    {/* Banner Upload */}
                    <div
                        className="banner-upload-container"
                        onClick={() => bannerInputRef.current?.click()}
                        title="Натисніть, щоб змінити банер"
                    >
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Shop Banner" className="banner-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <span className="upload-icon">🖼️</span>
                                <span>Завантажити банер магазину</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={bannerInputRef}
                            onChange={handleBannerChange}
                            accept="image/*"
                            className="file-input-hidden"
                        />
                    </div>

                    {/* Logo Upload */}
                    <div className="logo-upload-section">
                        <div
                            className="logo-upload-container"
                            onClick={() => logoInputRef.current?.click()}
                            title="Натисніть, щоб змінити логотип"
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Shop Logo" className="logo-preview" />
                            ) : (
                                <div className="logo-placeholder">Логотип</div>
                            )}
                            <input
                                type="file"
                                ref={logoInputRef}
                                onChange={handleLogoChange}
                                accept="image/*"
                                className="file-input-hidden"
                            />
                        </div>
                        <div className="logo-upload-hint">
                            <div
                                className="btn-upload-trigger"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                Змінити логотип
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Info Grid */}
                <div className="form-grid">
                    <div className="input-group">
                        <label>Назва магазину</label>
                        <input
                            type="text"
                            className="wolfix-input"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="Наприклад: Wolfix Store"
                        />
                    </div>

                    <div className="input-group">
                        <label>Телефон для зв'язку</label>
                        <input
                            type="tel"
                            className="wolfix-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+380..."
                        />
                    </div>

                    <div className="input-group full-width">
                        <label>Опис магазину</label>
                        <textarea
                            className="wolfix-input wolfix-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Розкажіть покупцям про ваш магазин..."
                        />
                    </div>

                    <div className="input-group full-width">
                        <label>Email (публічний)</label>
                        <input
                            type="email"
                            className="wolfix-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contact@example.com"
                        />
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="socials-section">
                    <h3 className="socials-title">Соціальні мережі</h3>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Instagram</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="input-group">
                            <label>TikTok</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={tiktok}
                                onChange={(e) => setTiktok(e.target.value)}
                                placeholder="https://tiktok.com/..."
                            />
                        </div>
                        <div className="input-group full-width">
                            <label>Telegram</label>
                            <input
                                type="text"
                                className="wolfix-input"
                                value={telegram}
                                onChange={(e) => setTelegram(e.target.value)}
                                placeholder="https://t.me/..."
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