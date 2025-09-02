import type { Metadata } from 'next';
import { FC, ReactNode } from "react";
import '../styles/Header.css'
import '../styles/Sidebar.css'
import '../styles/Banner.css'
import '../styles/ProductList.css'
import '../styles/ProductCard.css'
import '../styles/Footer.css'
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Інтернет-магазин: Wolfix',
  description: 'Онлайн-магазин Wolfix',
};

interface ILayoutProps {
  children: ReactNode;
}

const RootLayout: FC<ILayoutProps> = ({ children }) => {
  return (
    <html lang="uk">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;