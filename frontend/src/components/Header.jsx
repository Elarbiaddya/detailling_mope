import { useState } from "react";
import styles from "./header.module.css";
import Navegacion from "./Navegacion";
import { Link } from "react-router-dom";

function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        {logoError ? (
          <span className={styles.logoTexto}>Detailing Mope</span>
        ) : (
          <img
            src="/logo.png"
            alt="Detailing Mope"
            className={styles.logoImg}
            onError={() => setLogoError(true)}
          />
        )}
      </Link>
      <Navegacion />
    </header>
  );
}

export default Header;
