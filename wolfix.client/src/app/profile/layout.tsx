// src/app/profile/layout.tsx
import Header from "../components/Header/Header.client";
import ProfileSidebar from "../components/Profile/ProfileSidebar.client";
import Footer from "../components/Footer/Footer.server";

// ВАЖНО: Импорт стилей должен быть здесь
import "../../styles/ProfilePage.css";

export default function ProfileLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header logoAlt="Wolfix Logo" />
            <div className="profile-page-container">
                <ProfileSidebar />
                <main className="profile-main-wrapper">
                    {children}
                </main>
            </div>
            <Footer />
        </>
    );
}