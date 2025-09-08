"use client";

import Link from "next/link";
import Image from "next/image";

const SellerHeader = () => {
    return (
        <header className="seller-header">
            <div className="seller-header-content">
                <div className="seller-logo-link">
                    <Image 
                        src="/logo/Wolfix.png"
                        alt="Wolfix Marketplace Logo"
                        width={120}
                        height={30}
                        priority
                    />
                    <span className="marketplace-text">Marketplace</span>
                </div>
                <div className="seller-header-nav">
                    <Link href="/" className="return-link">
                        Повернутися до сайту
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default SellerHeader;