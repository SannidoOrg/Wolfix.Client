import type { Metadata } from 'next';
import { FC, ReactNode } from "react";
import { Providers } from './providers';
import Notification from './components/Notification/Notification.client';
import '../styles/main.scss';

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
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;