"use client";

import { FC, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import "../../../styles/Cart.css";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
}

const CartModal: FC<CartModalProps> = ({ isOpen, onClose, anchorRef }) => {
    const { cart, removeFromCart } = useUser();
    const router = useRouter();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    const items = cart?.items || [];
    const totalPrice = cart?.totalCartPriceWithoutBonuses || 0;

    return (
        <div className="cart-modal-overlay">
            <div className="cart-modal" ref={modalRef}>
                <div className="cart-modal-header">
                    Кошик ({items.length})
                </div>

                <div className="cart-modal-list">
                    {items.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '20px', color: '#888'}}>Порожньо</div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="cart-modal-item">
                                <img
                                    src={item.photoUrl || "/placeholder.png"}
                                    alt={item.title}
                                    className="cart-modal-img"
                                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                                />
                                <div className="cart-modal-info">
                                    <div className="cart-modal-title">{item.title}</div>
                                    <div className="cart-modal-price">{item.price.toLocaleString()} грн</div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:'18px'}}
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-modal-footer">
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontWeight:'bold'}}>
                        <span>Разом:</span>
                        <span>{totalPrice.toLocaleString()} грн</span>
                    </div>
                    <button
                        className="view-cart-btn"
                        onClick={() => {
                            onClose();
                            router.push('/profile/cart');
                        }}
                    >
                        Перейти до кошика
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;