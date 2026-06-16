import { useState } from "react";
import styles from "./footer.module.css";

function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerLogo}>
        {!logoError && (
          <img
            src="/logo.png"
            alt=""
            className={styles.footerLogoImg}
            onError={() => setLogoError(true)}
          />
        )}
        <span className={styles.footerNombre}>Detailing Mope</span>
      </div>
      <p className={styles.footerSlogan}>Centro de detailing profesional</p>
      <p className={styles.footerCopy}>© {new Date().getFullYear()} Detailing Mope — Todos los derechos reservados</p>
    </footer>
  );
}

export default Footer;
