import Header from './components/Header/Header.client'
import Sidebar from './components/Sidebar/Sidebar'
// import Banner from './components/Banner/Banner'
import ProductList from './components/ProductList/ProductList'
import Footer from './components/Footer/Footer'

interface HomeProps {
  logoAlt: string;
}

const Home: React.FC<HomeProps> = ({ logoAlt }) => {
  return (
    <div className="page-container">
      <Header logoAlt={logoAlt} />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          {/* <Banner /> */}
          <ProductList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;