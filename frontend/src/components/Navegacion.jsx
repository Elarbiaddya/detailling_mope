import styles from "./navegacion.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Navegacion() {
  const { usuario, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getClase = ({ isActive }) => (isActive ? styles.activo : undefined);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav>
      <ul className={styles["lista-nav"]}>
        <li>
          <NavLink to="/" className={getClase} end>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/servicios" className={getClase}>
            Servicios
          </NavLink>
        </li>

        {token ? (
          <>
            <li>
              <NavLink to="/citas" className={getClase}>
                Citas
              </NavLink>
            </li>
            <li>
              <NavLink to="/perfil" className={getClase}>
                Mi Perfil
              </NavLink>
            </li>
            {usuario?.rol === "admin" && (
              <li>
                <NavLink to="/admin" className={getClase}>
                  Admin
                </NavLink>
              </li>
            )}
            <li>
              <button className={styles.btnSalir} onClick={handleLogout}>
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className={getClase}>
                Entrar
              </NavLink>
            </li>
            <li>
              <NavLink to="/registro" className={getClase}>
                Registrarse
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navegacion;
