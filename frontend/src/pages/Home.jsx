import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { imagenServicio } from "../utils/imagenServicio";

const API = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API}/servicios`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((datos) => {
        const lista = datos.data ?? datos;
        setServicios(Array.isArray(lista) ? lista.slice(0, 4) : []);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContenido}>
          <h1 className={styles.heroTitulo}>Detailing Mope</h1>
          <p className={styles.heroSubtitulo}>
            Especialistas en detailing y estética del automóvil.
            Pulido, limpieza profunda, protección cerámica y más.
            Reserva tu cita online en segundos.
          </p>
          <button
            className={styles.btnHero}
            onClick={() => navigate("/servicios")}
          >
            Ver servicios
          </button>
        </div>
      </section>

      <section className={styles.seccion}>
        <h2 className={styles.tituloSeccion}>Nuestros servicios</h2>

        {cargando ? (
          <p className="loading">Cargando...</p>
        ) : servicios.length === 0 ? (
          <p className="text-muted text-center">
            No hay servicios disponibles ahora mismo.
          </p>
        ) : (
          <div className={styles.grid}>
            {servicios.map((s) => (
              <div
                key={s.id}
                className={styles.card}
                onClick={() => navigate(`/servicios/${s.id}`)}
              >
                <img
                  src={imagenServicio(s)}
                  alt={s.nombre}
                  className={styles.cardImg}
                />
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitulo}>{s.nombre}</h3>
                  {s.descripcion && (
                    <p className={styles.cardDesc}>
                      {s.descripcion.length > 80
                        ? s.descripcion.slice(0, 80) + "..."
                        : s.descripcion}
                    </p>
                  )}
                  {s.precio_base && (
                    <p className={styles.cardPrecio}>Desde {s.precio_base} €</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.centrado}>
          <button
            className={styles.btnVerMas}
            onClick={() => navigate("/servicios")}
          >
            Ver todos los servicios →
          </button>
        </div>
      </section>

      <section className={styles.seccionGris}>
        <h2 className={styles.tituloSeccion}>¿Por qué elegirnos?</h2>
        <ul className={styles.ventajas}>
          <li>✓ Especialistas en detailing profesional</li>
          <li>✓ Productos y técnicas de primera calidad</li>
          <li>✓ Presupuesto sin compromiso</li>
          <li>✓ Cita rápida online</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
