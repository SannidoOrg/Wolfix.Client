"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { sellerService } from "../../../services/sellerService";
import { SellerProfileDto, ChangeAddressDto, ChangeFullNameDto } from "../../../types/seller";
import "../../../styles/SellerProfile.css";

interface SellerProfileSettingsProps {
    sellerId: string;
    accountId: string; // Нужен для смены email/password
}

const SellerProfileSettings: React.FC<SellerProfileSettingsProps> = ({ sellerId, accountId }) => {
    const [profile, setProfile] = useState<SellerProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Подгрузка данных
    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const data = await sellerService.getSeller(sellerId);
            setProfile(data);
        } catch (e) {
            console.error("Failed to load profile", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (sellerId) loadProfile();
    }, [sellerId]);

    if (isLoading && !profile) return <div>Завантаження профілю...</div>;
    if (!profile) return <div>Профіль не знайдено</div>;

    return (
        <div className="profile-settings-container max-w-3xl mx-auto space-y-8 pb-10">
            <h2 className="text-2xl font-bold mb-6">Налаштування профілю</h2>

            {/* 1. ФОРМА ПІБ */}
            <FullNameForm sellerId={sellerId} initialData={profile.fullName} onUpdate={loadProfile} />

            {/* 2. ФОРМА КОНТАКТІВ (Телефон + Дата народження) */}
            <ContactInfoForm
                sellerId={sellerId}
                phone={profile.phoneNumber}
                birthDate={profile.birthDate}
                onUpdate={loadProfile}
            />

            {/* 3. ФОРМА АДРЕСИ */}
            <AddressForm sellerId={sellerId} initialData={profile.address} onUpdate={loadProfile} />

            {/* 4. ФОРМА БЕЗПЕКИ (Email + Пароль) */}
            <SecurityForm accountId={accountId} onUpdate={loadProfile} />
        </div>
    );
};

// --- Sub-components ---

const FullNameForm = ({ sellerId, initialData, onUpdate }: any) => {
    const { register, handleSubmit } = useForm<ChangeFullNameDto>({
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            middleName: initialData?.middleName || ""
        }
    });

    const onSubmit: SubmitHandler<ChangeFullNameDto> = async (data) => {
        try {
            await sellerService.updateFullName(sellerId, data);
            alert("ПІБ оновлено успішно");
            onUpdate();
        } catch (e) { alert("Помилка оновлення ПІБ"); }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 bg-white shadow rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Особисті дані (ПІБ)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Ім'я</label>
                    <input className="form-input" {...register("firstName", { required: true })} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Прізвище</label>
                    <input className="form-input" {...register("lastName", { required: true })} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">По батькові</label>
                    <input className="form-input" {...register("middleName")} />
                </div>
            </div>
            <button type="submit" className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black text-sm">Зберегти ПІБ</button>
        </form>
    );
};

const ContactInfoForm = ({ sellerId, phone, birthDate, onUpdate }: any) => {
    const { register: regPhone, handleSubmit: subPhone } = useForm<{ phoneNumber: string }>({ defaultValues: { phoneNumber: phone } });
    const { register: regDate, handleSubmit: subDate } = useForm<{ birthDate: string }>({
        defaultValues: { birthDate: birthDate ? new Date(birthDate).toISOString().split('T')[0] : "" }
    });

    const savePhone = async (data: { phoneNumber: string }) => {
        try {
            await sellerService.updatePhoneNumber(sellerId, data);
            alert("Телефон оновлено");
        } catch (e) { alert("Помилка оновлення телефону"); }
    };

    const saveDate = async (data: { birthDate: string }) => {
        try {
            await sellerService.updateBirthDate(sellerId, data);
            alert("Дата народження оновлена");
        } catch (e) { alert("Помилка оновлення дати"); }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={subPhone(savePhone)} className="p-5 bg-white shadow rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Телефон</h3>
                <input className="form-input" placeholder="+380..." {...regPhone("phoneNumber", { required: true })} />
                <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black text-sm">Зберегти телефон</button>
            </form>

            <form onSubmit={subDate(saveDate)} className="p-5 bg-white shadow rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Дата народження</h3>
                <input type="date" className="form-input" {...regDate("birthDate", { required: true })} />
                <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black text-sm">Зберегти дату</button>
            </form>
        </div>
    );
};

const AddressForm = ({ sellerId, initialData, onUpdate }: any) => {
    const { register, handleSubmit } = useForm<ChangeAddressDto>({
        defaultValues: {
            city: initialData?.city || "",
            street: initialData?.street || "",
            houseNumber: initialData?.houseNumber || 0,
            apartmentNumber: initialData?.apartmentNumber || null
        }
    });

    const onSubmit: SubmitHandler<ChangeAddressDto> = async (data) => {
        try {
            await sellerService.updateAddress(sellerId, data);
            alert("Адреса оновлена");
            onUpdate();
        } catch (e) { alert("Помилка оновлення адреси"); }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 bg-white shadow rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Адреса</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Місто</label>
                    <input className="form-input" {...register("city", { required: true })} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Вулиця</label>
                    <input className="form-input" {...register("street", { required: true })} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Будинок №</label>
                    <input type="number" className="form-input" {...register("houseNumber", { required: true })} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Квартира №</label>
                    <input type="number" className="form-input" {...register("apartmentNumber")} />
                </div>
            </div>
            <button type="submit" className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black text-sm">Зберегти адресу</button>
        </form>
    );
};

const SecurityForm = ({ accountId, onUpdate }: any) => {
    // Email Form
    const { register: rEmail, handleSubmit: hEmail } = useForm<{email: string}>();
    const saveEmail = async (d: {email: string}) => {
        try { await sellerService.updateEmail(accountId, d); alert("Email змінено"); }
        catch(e) { alert("Помилка зміни Email"); }
    };

    // Password Form
    const { register: rPass, handleSubmit: hPass } = useForm({defaultValues: {currentPassword: "", newPassword: ""}});
    const savePass = async (d: any) => {
        try { await sellerService.updatePassword(accountId, d); alert("Пароль змінено"); }
        catch(e) { alert("Помилка зміни пароля"); }
    };

    return (
        <div className="p-5 bg-white shadow rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-red-600">Безпека (Аккаунт)</h3>

            <div className="mb-6">
                <form onSubmit={hEmail(saveEmail)} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Новий Email</label>
                        <input type="email" className="form-input" {...rEmail("email", {required: true})} />
                    </div>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm h-10">Змінити Email</button>
                </form>
            </div>

            <div>
                <form onSubmit={hPass(savePass)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Поточний пароль</label>
                            <input type="password" className="form-input" {...rPass("currentPassword")} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Новий пароль</label>
                            <input type="password" className="form-input" {...rPass("newPassword", {required: true})} />
                        </div>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">Змінити пароль</button>
                </form>
            </div>
        </div>
    );
};

export default SellerProfileSettings;