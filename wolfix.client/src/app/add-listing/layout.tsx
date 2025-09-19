import Header from "../components/Header/Header.client";
import Footer from "../components/Footer/Footer.server";

export default function AddListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header logoAlt="Wolfix Logo" />
      <main style={{ backgroundColor: '#f7f7f7', padding: '2rem 0' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}