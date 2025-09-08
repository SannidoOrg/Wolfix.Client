import Header from "../components/Header/Header.client";
import ProfileSidebar from "../components/Profile/ProfileSidebar.client";
import Footer from "../components/Footer/Footer.server";
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
        <main className="profile-main-content">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}