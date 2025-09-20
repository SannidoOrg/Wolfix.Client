"use client";

import { useUser } from "../../../contexts/UserContext";
import Image from "next/image";

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const { addToCart, addToFavorites } = useUser();

  const buttonBaseStyle: React.CSSProperties = {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button 
        onClick={() => addToCart(productId)}
        style={{ ...buttonBaseStyle, flexGrow: 1, backgroundColor: 'darkorange', color: 'white', border: 'none' }}
      >
        Купити
      </button>
      <button style={{ ...buttonBaseStyle, padding: '0.8rem', backgroundColor: 'white' }}>
        <Image src="/icons/comparison.png" alt="compare" width={20} height={20} />
      </button>
      <button onClick={() => addToFavorites(productId)} style={{ ...buttonBaseStyle, padding: '0.8rem', backgroundColor: 'white' }}>
        <Image src="/icons/selected.png" alt="favorite" width={20} height={20} />
      </button>
    </div>
  );
}