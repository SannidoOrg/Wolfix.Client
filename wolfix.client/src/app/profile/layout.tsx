"use client";

import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";
import BuyerSidebar from "../components/Profile/Buyer/BuyerSidebar.client";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileLayout({ children }: { children: React.ReactNode; }) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <>
        <Header logoAlt="Wolfix Logo" />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Завантаження...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (user.role === 'Seller') {
    return (
      <>
        <Header logoAlt="Wolfix Logo" />
        <div className="profile-page-full-width-container">
          <main>
            {children}
          </main>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header logoAlt="Wolfix Logo" />
      <div className="profile-page-container">
        <BuyerSidebar />
        <main className="profile-main-content">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}