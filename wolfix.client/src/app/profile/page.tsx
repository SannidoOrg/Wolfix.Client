"use client";

import { useAuth } from "../../contexts/AuthContext";
import PersonalData from "../components/Profile/Buyer/PersonalData.client";
import SellerProfile from "../components/Profile/Seller/SellerProfile.client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePageRouter = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !user) {
    return <p>Завантаження даних профілю...</p>;
  }

  if (user.role === 'Seller') {
    return <SellerProfile />;
  } else {
    return <PersonalData />;
  }
};

export default ProfilePageRouter;