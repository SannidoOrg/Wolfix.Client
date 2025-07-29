import { FC } from 'react';
import styles from '../styles/Banner.module.css';

const Banner: FC = () => {
  return (
    <div className={styles.banner}>
      <img src="/images/banner.jpg" alt="Promotional Banner" />
    </div>
  );
};

export default Banner;