import Header from './components/Header/Header.client';
import Sidebar from './components/Sidebar/Sidebar';
import ProductList from './components/ProductList/ProductList';
import Footer from './components/Footer/Footer';
import Banner from './components/Banner/Banner';
import '../styles/page.css';

interface IHomeProps {
  logoAlt: string;
}

const Home: React.FC<IHomeProps> = ({ logoAlt }) => {
  return (
    <div className="page-container">
      <Header logoAlt={logoAlt} />
      <div className="main-content">
        <Sidebar className="sidebar" />
        <div className="divider" />
        <div className="content-area">
          <Banner />
          <ProductList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;