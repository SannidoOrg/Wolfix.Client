import { FC, ReactNode } from "react";
import '../styles/Header.css'
import '../styles/Sidebar.css'
import '../styles/Banner.css'
import '../styles/ProductList.css'
import '../styles/ProductCard.css'
import '../styles/Footer.css'
import '../styles/globals.css';

interface ILayoutProps {
  children: ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default Layout;