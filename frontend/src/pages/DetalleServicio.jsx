import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./detalleServicio.module.css";
import { imagenServicio } from "../utils/imagenServicio";

const API = import.meta.env.VITE_API_BASE_URL;

function DetalleServicio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [servicio, setServicio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/servicios/${id}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Servicio no encontrado.");
        return res.json();
      })
      .then((datos) => setServicio(datos.data ?? datos))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p className="loading">Cargando servicio...</p>;
  if (error)    return <p className="error">{error}</p>;
  if (!servicio) return null;

  return (
    <div className={styles.contenedor}>
      <button className={styles.btnVolver} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className={styles.detalle}>
        <img
          src={imagenServicio(servicio)}
          alt={servicio.nombre}
          className={styles.imagen}
        />
        <div className={styles.detalleBody}>
          <h1 className={styles.nombre}>{servicio.nombre}</h1>
          {servicio.descripcion && (
            <p className={styles.descripcion}>{servicio.descripcion}</p>
          )}
          <div className={styles.meta}>
            {servicio.precio_base && (
              <span className={styles.metaItem}>
                Precio base: <strong>{servicio.precio_base} €</strong>
              </span>
            )}
            {servicio.duracion && (
              <span className={styles.metaItem}>
                Duración estimada: <strong>{servicio.duracion} min</strong>
              </span>
            )}
          </div>
          <button
            className={styles.btnPedirCita}
            onClick={() => navigate(`/citas?servicio_id=${servicio.id}`)}
          >
            Pedir cita para este servicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleServicio;
