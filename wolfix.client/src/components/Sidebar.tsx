import { FC, useEffect, useState } from 'react';
import { fetchCategories } from '../utils/api';
import { ICategory } from '../types';
import styles from '../styles/Sidebar.module.css';

const Sidebar: FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    fetchCategories().then(data => setCategories(data));
  }, []);

  return (
    <aside className={styles.sidebar}>
      {categories.map(category => (
        <div key={category.name} className={styles.category}>
          <img src={category.icon} alt={category.name} />
          <span>{category.name}</span>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;