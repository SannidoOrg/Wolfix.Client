import type { Metadata } from 'next';
import { FC, ReactNode } from "react";
import { Providers } from './providers';
import Notification from './components/Notification/Notification.client';
import SupportWidget from "./components/SupportWidget/SupportWidget.client";
import '../styles/Header.css'
import '../styles/Sidebar.css'
import '../styles/Banner.css'
import '../styles/ProductList.css'
import '../styles/ProductCard.css'
import '../styles/Footer.css'
import '../styles/globals.css';
import '../styles/Notification.css';
import '../styles/ProfilePage.css';
import '../styles/UnderConstructionPage.css';
import '../styles/SellerRegistration.css';

export const metadata: Metadata = {
  title: 'Інтернет-магазин: Wolfix',
  description: 'Онлайн-магазин Wolfix',
  icons: {
    icon: '/logo/favicon.png',
  },
};

interface ILayoutProps {
  children: ReactNode;
}

const RootLayout: FC<ILayoutProps> = ({ children }) => {
  return (
    <html lang="uk">
      <body>
        <Providers>
          <Notification />
          {children}
          <SupportWidget />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;