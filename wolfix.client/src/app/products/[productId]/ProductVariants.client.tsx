"use client";

import { useState } from 'react';
import styles from './page.module.css';

interface ProductVariant {
  key: string;
  value: string;
}

interface ProductVariantsProps {
  variants: ProductVariant[];
  title: string;
}

const colorMap: { [key: string]: string } = {
    'Pink': '#FFC0CB', 'Black': '#000000', 'Green': '#008000', 'Yellow': '#FFFF00', 'Blue': '#0000FF', 'Білий': '#FFFFFF', 'Червоний': '#FF0000', 'Чорний': '#000000'
};

export default function ProductVariants({ variants, title }: ProductVariantsProps) {
  const colorVariants = variants.filter(v => v.key.trim().toLowerCase() === 'колір');
  const memoryVariants = variants.filter(v => v.key.trim().toLowerCase() === 'пам\'ять');
  
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]?.value || null);
  const [selectedMemory, setSelectedMemory] = useState(memoryVariants[1]?.value || memoryVariants[0]?.value || null);

  return (
    <div className={styles.productVariants}>
      {colorVariants.length > 0 && (
        <div className={styles.variantGroup}>
          <h3>Колір: {selectedColor}</h3>
          <div className={styles.variantOptions}>
            {colorVariants.map(v => (
              <div 
                key={v.value} 
                className={`${styles.colorSwatch} ${selectedColor === v.value ? styles.active : ''}`}
                style={{ backgroundColor: colorMap[v.value] || '#cccccc' }}
                onClick={() => setSelectedColor(v.value)}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.seriesInfo}>
          <span className={styles.seriesLabel}>Серія: </span>
          <span className={styles.seriesValue}>{title}</span>
      </div>

      {memoryVariants.length > 0 && (
        <div className={styles.variantGroup}>
          <h3>Пам'ять:</h3>
          <div className={styles.variantOptions}>
            {memoryVariants.map(v => (
              <button 
                key={v.value} 
                className={`${styles.variantBtn} ${selectedMemory === v.value ? styles.active : ''}`}
                onClick={() => setSelectedMemory(v.value)}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}