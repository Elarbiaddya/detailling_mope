import styles from "./bigLayout.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function BigLayout() {
  return (
    <div className={styles.contenedor}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default BigLayout;
