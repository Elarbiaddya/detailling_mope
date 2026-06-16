import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Paginacion from "../components/Paginacion";
import styles from "./perfil.module.css";

const API = import.meta.env.VITE_API_BASE_URL;

function cabecerasConToken(token) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Mapea el estado del backend a una clase CSS y una etiqueta en español
const mapaEstado = {
  pendiente:  { clase: styles.estadoPendiente,  texto: "Pendiente"  },
  confirmada: { clase: styles.estadoConfirmada, texto: "Confirmada" },
  completada: { clase: styles.estadoCompletada, texto: "Completada" },
  cancelada:  { clase: styles.estadoCancelada,  texto: "Cancelada"  },
  anulada:    { clase: styles.estadoAnulada,    texto: "Anulada"    },
};

function etiquetaEstado(estado) {
  return mapaEstado[estado]?.texto ?? estado;
}

function claseEstado(estado) {
  return mapaEstado[estado]?.clase ?? "";
}

function formatearFecha(fecha) {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleDateString("es-ES");
  } catch {
    return fecha;
  }
}

function Perfil() {
  const { usuario, token } = useContext(AuthContext);

  // Próxima cita pendiente
  const [citaPendiente, setCitaPendiente] = useState(null);
  const [cargandoPendiente, setCargandoPendiente] = useState(true);

  // Listado de citas
  const [citas, setCitas] = useState([]);
  const [cargandoCitas, setCargandoCitas] = useState(true);
  const [errorCitas, setErrorCitas] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // Anular cita
  const [anulando, setAnulando] = useState(null);
  const [mensajeAnular, setMensajeAnular] = useState(null);

  // ---- Carga de la próxima cita pendiente ----
  const cargarCitaPendiente = async () => {
    setCargandoPendiente(true);
    try {
      const res = await fetch(`${API}/mis-citas/pendiente`, {
        headers: cabecerasConToken(token),
      });
      if (!res.ok) {
        // 404 u otro error → no hay cita pendiente
        setCitaPendiente(null);
        return;
      }
      const datos = await res.json();
      const cita = datos.data ?? datos;
      // Si el objeto está vacío, no hay cita
      setCitaPendiente(
        cita && Object.keys(cita).length > 0 ? cita : null
      );
    } catch {
      setCitaPendiente(null);
    } finally {
      setCargandoPendiente(false);
    }
  };

  // ---- Carga del historial de citas ----
  const cargarCitas = async () => {
    setCargandoCitas(true);
    setErrorCitas(null);
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.set("estado", filtroEstado);
      if (filtroFecha) params.set("fecha", filtroFecha);
      params.set("page", paginaActual);

      const res = await fetch(`${API}/mis-citas?${params}`, {
        headers: cabecerasConToken(token),
      });

      if (!res.ok) throw new Error("Error al cargar las citas.");

      const datos = await res.json();
      setCitas(datos.data ?? datos);
      setTotalPaginas(datos.meta?.last_page ?? datos.last_page ?? 1);
    } catch (err) {
      setErrorCitas(err.message || "Error al cargar las citas.");
    } finally {
      setCargandoCitas(false);
    }
  };

  useEffect(() => {
    cargarCitaPendiente();
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [filtroEstado, filtroFecha, paginaActual]);

  // ---- Handlers de filtros ----
  const handleFiltroEstado = (e) => {
    setFiltroEstado(e.target.value);
    setPaginaActual(1);
  };

  const handleFiltroFecha = (e) => {
    setFiltroFecha(e.target.value);
    setPaginaActual(1);
  };

  const handleLimpiarFiltros = () => {
    setFiltroEstado("");
    setFiltroFecha("");
    setPaginaActual(1);
  };

  // ---- Anular cita ----
  const handleAnular = async (citaId) => {
    setAnulando(citaId);
    setMensajeAnular(null);
    try {
      const res = await fetch(`${API}/citas/${citaId}/cancelar`, {
        method: "PUT",
        headers: cabecerasConToken(token),
      });

      let datos;
      try {
        datos = await res.json();
      } catch {
        datos = {};
      }

      if (!res.ok) {
        setMensajeAnular({
          tipo: "error",
          texto: datos.message || "No se pudo anular la cita.",
        });
        return;
      }

      setMensajeAnular({
        tipo: "exito",
        texto: "Cita anulada correctamente.",
      });

      // Recargar listado y próxima cita
      cargarCitas();
      cargarCitaPendiente();
    } catch {
      setMensajeAnular({
        tipo: "error",
        texto: "Error de conexión al anular la cita.",
      });
    } finally {
      setAnulando(null);
    }
  };

  return (
    <div>
      <h1 className={styles.tituloPagina}>Mi Perfil</h1>

      {/* Datos del usuario + próxima cita en dos columnas */}
      <div className={styles.seccionSuperior}>
        <div className={styles.datosUsuario}>
          <h2 className={styles.tituloSeccion}>Mis datos</h2>
          <p className={styles.datoFila}>
            <span className={styles.etiqueta}>Nombre:</span>
            {usuario?.nombre ?? "—"}
          </p>
          <p className={styles.datoFila}>
            <span className={styles.etiqueta}>Usuario:</span>
            {usuario?.usuario ?? "—"}
          </p>
          <p className={styles.datoFila}>
            <span className={styles.etiqueta}>Email:</span>
            {usuario?.email ?? "—"}
          </p>
          <p className={styles.datoFila}>
            <span className={styles.etiqueta}>Rol:</span>
            {usuario?.rol ?? "—"}
          </p>
        </div>

        <div className={styles.proximaCita}>
          <h2 className={styles.tituloSeccion}>Próxima cita</h2>
          {cargandoPendiente ? (
            <p className="loading">Cargando...</p>
          ) : !citaPendiente ? (
            <p className="text-muted">No tienes ninguna cita pendiente.</p>
          ) : (
            <div className={styles.citaDestacada}>
              <p className={styles.citaServicioNombre}>
                {citaPendiente.servicio?.nombre ?? "Servicio desconocido"}
              </p>
              <p className={styles.datoFila}>
                <span className={styles.etiqueta}>Fecha:</span>
                {formatearFecha(citaPendiente.fecha)}
              </p>
              <p className={styles.datoFila}>
                <span className={styles.etiqueta}>Hora:</span>
                {citaPendiente.hora ?? "—"}
              </p>
              <span
                className={`${styles.estado} ${claseEstado(citaPendiente.estado)}`}
              >
                {etiquetaEstado(citaPendiente.estado)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje resultado de anular */}
      {mensajeAnular && (
        <p
          className={
            mensajeAnular.tipo === "exito"
              ? styles.mensajeExito
              : styles.mensajeError
          }
        >
          {mensajeAnular.texto}
        </p>
      )}

      {/* Historial de citas */}
      <div className={styles.seccionCitas}>
        <h2 className={styles.tituloSeccion}>Mis citas</h2>

        <div className={styles.filtros}>
          <select
            aria-label="Filtrar por estado"
            value={filtroEstado}
            onChange={handleFiltroEstado}
            className={styles.selectFiltro}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <input
            type="date"
            aria-label="Filtrar por fecha"
            value={filtroFecha}
            onChange={handleFiltroFecha}
            className={styles.inputFecha}
          />

          {(filtroEstado || filtroFecha) && (
            <button
              className={styles.btnLimpiar}
              onClick={handleLimpiarFiltros}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {cargandoCitas ? (
          <p className="loading">Cargando citas...</p>
        ) : errorCitas ? (
          <p className="error">{errorCitas}</p>
        ) : citas.length === 0 ? (
          <p className="text-muted">No hay citas que mostrar.</p>
        ) : (
          <div className={styles.listaCitas}>
            {citas.map((cita) => (
              <div key={cita.id} className={styles.tarjetaCita}>
                <div className={styles.citaInfo}>
                  <p className={styles.citaServicio}>
                    {cita.servicio?.nombre ?? "Servicio desconocido"}
                  </p>
                  <p className={styles.citaMeta}>
                    {formatearFecha(cita.fecha)} · {cita.hora ?? "—"}
                  </p>
                  {cita.motivo && (
                    <p className={styles.citaMotivo}>
                      Motivo: {cita.motivo}
                    </p>
                  )}
                </div>

                <div className={styles.citaAcciones}>
                  <span
                    className={`${styles.estado} ${claseEstado(cita.estado)}`}
                  >
                    {etiquetaEstado(cita.estado)}
                  </span>
                  {cita.estado === "pendiente" && (
                    <button
                      className={styles.btnAnular}
                      disabled={anulando === cita.id}
                      onClick={() => handleAnular(cita.id)}
                    >
                      {anulando === cita.id ? "Anulando..." : "Anular"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </div>
    </div>
  );
}

export default Perfil;
