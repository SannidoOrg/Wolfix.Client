"use client";

import { useUser } from "../../../contexts/UserContext";
import Image from "next/image";
import styles from './page.module.css';

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const { addToCart, addToFavorites } = useUser();

  return (
    <div className={styles.actionsContainer}>
      <button 
        onClick={() => addToCart(productId)}
        className={styles.buyButton}
      >
        Купити
      </button>
      <button 
        onClick={() => addToFavorites(productId)} 
        className={styles.iconButton}
      >
        <Image src="/icons/Vector104.png" alt="favorite" width={28} height={23} />
      </button>
    </div>
  );
}