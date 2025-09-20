"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function ProductTabsNav() {
  const [activeTab, setActiveTab] = useState('product-top');

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveTab(targetId);
    }
  };

  return (
    <nav className={styles.tabsNav}>
      <ul className={styles.tabsList}>
        <li className={styles.tabItem}>
          <a 
            href="#product-top" 
            className={activeTab === 'product-top' ? styles.activeTab : ''}
            onClick={(e) => handleScroll(e, 'product-top')}
          >
            Інформація про товар
          </a>
        </li>
        <li className={styles.tabItem}>
          <a 
            href="#product-description"
            className={activeTab === 'product-description' ? styles.activeTab : ''}
            onClick={(e) => handleScroll(e, 'product-description')}
          >
            Опис
          </a>
        </li>
        <li className={styles.tabItem}>
          <a 
            href="#product-characteristics"
            className={activeTab === 'product-characteristics' ? styles.activeTab : ''}
            onClick={(e) => handleScroll(e, 'product-characteristics')}
          >
            Характеристики
          </a>
        </li>
        <li className={styles.tabItem}><a href="#">Відгуки/Питання</a></li>
        <li className={styles.tabItem}><a href="#">Обмін та повернення</a></li>
      </ul>
    </nav>
  );
}