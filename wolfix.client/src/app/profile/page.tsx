"use client";

import { useAuth } from "../../contexts/AuthContext";
import { AdminContextProvider } from "../../contexts/AdminContext";
import BuyerProfile from "../components/Profile/Buyer/BuyerProfile.client";
import SellerProfile from "../components/Profile/Seller/SellerProfile.client";
import AdminProfile from "../components/Profile/Admin/AdminProfile.client";

const ProfilePageRouter = () => {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return <p>Завантаження даних профілю...</p>;
    }

    if (user.role === 'Admin') {
        return (
            <AdminContextProvider>
                <AdminProfile />
            </AdminContextProvider>
        );
    }
    
    if (user.role === 'Seller') {
        return <SellerProfile />;
    } 

    return <BuyerProfile />;
};

export default ProfilePageRouter;