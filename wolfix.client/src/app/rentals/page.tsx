import Header from '../components/Header/Header.client';
import Footer from '../components/Footer/Footer';
import '../../styles/rentals.css';

interface IRentalsPageProps {
  logoAlt: string;
}

const RentalsPage = ({ logoAlt }: IRentalsPageProps) => {
  return (
    <div className="container">
      <Header logoAlt={logoAlt} />
      <div className="content">
        <div className="logo">
          <img src="/logo/wolfix-text.png" alt="Logo" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RentalsPage;