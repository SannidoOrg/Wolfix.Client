import { FC } from "react";

interface IFooterProps {}

const Footer: FC<IFooterProps> = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Wolfix. Усі права захищені.</p>
      </div>
    </footer>
  );
};

export default Footer;