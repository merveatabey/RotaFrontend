import React from "react";
import "../../styles/user/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#" className="footer-link">Hakkımızda</a>
        <a href="#" className="footer-link">İletişim</a>
        <a href="#" className="footer-link">SSS</a>
        <a href="#" className="footer-link">Gizlilik Politikası</a>
      </div>
      <div className="footer-bottom">
        © 2025 Tatilia. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
