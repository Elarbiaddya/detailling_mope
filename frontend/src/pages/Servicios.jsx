import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paginacion from "../components/Paginacion";
import styles from "./servicios.module.css";
import { imagenServicio } from "../utils/imagenServicio";

const API = import.meta.env.VITE_API_BASE_URL;

function Servicios() {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (busquedaActiva) params.set("nombre", busquedaActiva);
        params.set("page", paginaActual);

        const res = await fetch(`${API}/servicios?${params}`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error("Error al cargar los servicios.");

        const datos = await res.json();
        setServicios(datos.data ?? datos);
        setTotalPaginas(datos.meta?.last_page ?? datos.last_page ?? 1);
      } catch (err) {
        setError(err.message || "Error al cargar los servicios.");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [busquedaActiva, paginaActual]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setBusquedaActiva(busqueda.trim());
    setPaginaActual(1);
  };

  const handleLimpiar = () => {
    setBusqueda("");
    setBusquedaActiva("");
    setPaginaActual(1);
  };

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className={styles.titulo}>Servicios</h1>

      <form className={styles.filtro} onSubmit={handleBuscar}>
        <input
          type="text"
          aria-label="Buscar servicio por nombre"
          className={styles.inputBusqueda}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
        />
        <button type="submit" className={styles.btnBuscar}>
          Buscar
        </button>
        {busquedaActiva && (
          <button
            type="button"
            className={styles.btnLimpiar}
            onClick={handleLimpiar}
          >
            Limpiar
          </button>
        )}
      </form>

      {busquedaActiva && (
        <p className={styles.resultadoInfo}>
          Resultados para: <strong>"{busquedaActiva}"</strong>
        </p>
      )}

      {cargando ? (
        <p className="loading">Cargando servicios...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : servicios.length === 0 ? (
        <p className="text-muted text-center">No se encontraron servicios.</p>
      ) : (
        <div className={styles.lista}>
          {servicios.map((s) => (
            <div key={s.id} className={styles.tarjeta}>
              <img
                src={imagenServicio(s)}
                alt={s.nombre}
                className={styles.tarjetaImg}
              />
              <div className={styles.tarjetaContenido}>
                <div className={styles.tarjetaInfo}>
                  <h2 className={styles.tarjetaNombre}>{s.nombre}</h2>
                  {s.descripcion && (
                    <p className={styles.tarjetaDesc}>{s.descripcion}</p>
                  )}
                  <div className={styles.tarjetaMeta}>
                    {s.precio_base && (
                      <span>
                        Precio base: <strong>{s.precio_base} €</strong>
                      </span>
                    )}
                    {s.duracion && (
                      <span>
                        Duración: <strong>{s.duracion} min</strong>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className={styles.btnDetalle}
                  onClick={() => navigate(`/servicios/${s.id}`)}
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={handleCambiarPagina}
      />
    </div>
  );
}

export default Servicios;
