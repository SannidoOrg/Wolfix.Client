import SellerHeader from "../components/BecomeSeller/SellerHeader.client";
import SellerRegistrationForm from "../components/BecomeSeller/SellerRegistrationForm.client";
import SellerFooter from "../components/BecomeSeller/SellerFooter.client";

const BecomeSellerPage = () => {
  return (
    <div className="seller-page-layout">
        <SellerHeader />
        <main className="seller-main-content">
            <SellerRegistrationForm />
        </main>
        <SellerFooter />
    </div>
  );
};

export default BecomeSellerPage;