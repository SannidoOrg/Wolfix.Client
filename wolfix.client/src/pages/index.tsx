import { FC } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import SupportChat from '../components/SupportChat';
import styles from '../styles/Home.module.css';

const HomePage: FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.content}>
          <Banner />
          <FeaturedProducts />
        </div>
      </div>
      <SupportChat />
    </div>
  );
};

export default HomePage;