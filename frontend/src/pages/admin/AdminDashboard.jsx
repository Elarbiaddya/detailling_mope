import { useState } from "react";
import GestionUsuarios from "./GestionUsuarios";
import GestionServicios from "./GestionServicios";
import GestionCitas from "./GestionCitas";
import styles from "./adminDashboard.module.css";

const SECCIONES = [
  { id: "usuarios",  label: "Usuarios"  },
  { id: "servicios", label: "Servicios" },
  { id: "citas",     label: "Citas"     },
];

function AdminDashboard() {
  const [seccion, setSeccion] = useState("usuarios");

  return (
    <div>
      <h1 className={styles.titulo}>Panel de administración</h1>

      <div className={styles.tabs}>
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            className={`${styles.tab} ${seccion === s.id ? styles.tabActivo : ""}`}
            onClick={() => setSeccion(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {seccion === "usuarios"  && <GestionUsuarios />}
      {seccion === "servicios" && <GestionServicios />}
      {seccion === "citas"     && <GestionCitas />}
    </div>
  );
}

export default AdminDashboard;
