import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Paginacion from "../../components/Paginacion";
import styles from "./admin.module.css";

const API = import.meta.env.VITE_API_BASE_URL;

function cabecerasConToken(token) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

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

function nombreCliente(c) {
  const u = c.user ?? c.usuario ?? c.cliente ?? null;
  return u?.nombre ?? u?.usuario ?? u?.email ?? "Cliente no disponible";
}

function nombreServicio(c) {
  return c.servicio?.nombre ?? "Servicio no disponible";
}

function GestionCitas() {
  const { token } = useContext(AuthContext);

  const [citas, setCitas]               = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFecha, setFiltroFecha]   = useState("");

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [citaSel, setCitaSel]           = useState(null);
  const [guardando, setGuardando]       = useState(false);
  const [errorPanel, setErrorPanel]     = useState(null);
  const [mensaje, setMensaje]           = useState(null);
  const [anulando, setAnulando]         = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.set("estado", filtroEstado);
      if (filtroFecha)  params.set("fecha", filtroFecha);
      params.set("page", paginaActual);

      const res = await fetch(`${API}/citas?${params}`, {
        headers: cabecerasConToken(token),
      });
      if (!res.ok) throw new Error("Error al cargar las citas.");

      const datos = await res.json();
      const lista = datos.data ?? datos;
      setCitas(Array.isArray(lista) ? lista : []);
      setTotalPaginas(datos.meta?.last_page ?? datos.last_page ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtroEstado, filtroFecha, paginaActual]);

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

  const abrirEditar = (c) => {
    setCitaSel(c);
    setErrorPanel(null);
    setMensaje(null);
    setPanelAbierto(true);
  };

  const cerrarPanel = () => {
    setPanelAbierto(false);
    setCitaSel(null);
    setErrorPanel(null);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorPanel(null);

    const datos = {
      fecha:  e.target.fecha.value,
      hora:   e.target.hora.value,
      motivo: e.target.motivo.value.trim(),
      estado: e.target.estado.value,
    };

    setGuardando(true);
    try {
      const res = await fetch(`${API}/citas/${citaSel.id}`, {
        method: "PUT",
        headers: cabecerasConToken(token),
        body: JSON.stringify(datos),
      });

      let respuesta = {};
      try { respuesta = await res.json(); } catch { /* sin cuerpo */ }

      if (!res.ok) {
        if (res.status === 422 && respuesta.errors) {
          const primerError = Object.values(respuesta.errors)[0]?.[0];
          setErrorPanel(primerError || "Error de validación.");
        } else {
          setErrorPanel(respuesta.message || "Error al guardar.");
        }
        return;
      }

      setMensaje({ tipo: "exito", texto: "Cita actualizada correctamente." });
      cerrarPanel();
      cargar();
    } catch {
      setErrorPanel("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  const handleAnular = async (cita) => {
    if (!window.confirm(`¿Cancelar la cita #${cita.id}? El cliente será notificado del cambio.`)) return;

    setAnulando(cita.id);
    try {
      const res = await fetch(`${API}/citas/${cita.id}/cancelar`, {
        method: "PUT",
        headers: cabecerasConToken(token),
      });

      let respuesta = {};
      try { respuesta = await res.json(); } catch { /* sin cuerpo */ }

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: respuesta.message || "No se pudo cancelar la cita." });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Cita cancelada correctamente." });
      cargar();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión." });
    } finally {
      setAnulando(null);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Eliminar la cita #${id}? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`${API}/citas/${id}`, {
        method: "DELETE",
        headers: cabecerasConToken(token),
      });

      let respuesta = {};
      try { respuesta = await res.json(); } catch { /* sin cuerpo */ }

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: respuesta.message || "No se pudo eliminar la cita." });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Cita eliminada correctamente." });
      cargar();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión." });
    }
  };

  const puedeAnular = (estado) => estado === "pendiente" || estado === "confirmada";

  return (
    <div>
      <div className={styles.cabecera}>
        <h2 className={styles.tituloCrud}>Citas</h2>
      </div>

      {mensaje && (
        <p className={mensaje.tipo === "exito" ? styles.mensajeExito : styles.mensajeError}>
          {mensaje.texto}
        </p>
      )}

      {/* Filtros */}
      <div className={styles.filtroForm}>
        <select
          aria-label="Filtrar por estado"
          className={styles.inputFiltro}
          value={filtroEstado}
          onChange={handleFiltroEstado}
          style={{ flex: "unset" }}
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
          className={styles.inputFiltro}
          value={filtroFecha}
          onChange={handleFiltroFecha}
          style={{ flex: "unset" }}
        />

        {(filtroEstado || filtroFecha) && (
          <button className={styles.btnLimpiar} onClick={handleLimpiarFiltros}>
            Limpiar
          </button>
        )}
      </div>

      {cargando ? (
        <p className="loading">Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className={styles.tablaContenedor}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--color-texto-suave)" }}>
                    No hay citas.
                  </td>
                </tr>
              ) : (
                citas.map((c) => (
                  <tr key={c.id}>
                    <td data-label="ID">{c.id}</td>
                    <td data-label="Cliente">{nombreCliente(c)}</td>
                    <td data-label="Servicio">{nombreServicio(c)}</td>
                    <td data-label="Fecha">{c.fecha}</td>
                    <td data-label="Hora">{c.hora}</td>
                    <td data-label="Estado">
                      <span className={claseEstado(c.estado)}>
                        {etiquetaEstado(c.estado)}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div className={styles.tdAcciones}>
                        <button className={styles.btnEditar} onClick={() => abrirEditar(c)}>
                          Editar
                        </button>
                        <button
                          className={styles.btnAnularCita}
                          disabled={!puedeAnular(c.estado) || anulando === c.id}
                          onClick={() => handleAnular(c)}
                        >
                          {anulando === c.id ? "..." : "Cancelar"}
                        </button>
                        <button
                          className={styles.btnEliminar}
                          onClick={() => handleEliminar(c.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
      />

      {/* Panel lateral editar cita */}
      <aside className={`${styles.panel} ${panelAbierto ? styles.panelAbierto : ""}`}>
        <div className={styles.panelCabecera}>
          <span className={styles.panelTitulo}>Editar cita #{citaSel?.id}</span>
          <button className={styles.btnCerrarPanel} onClick={cerrarPanel}>✕</button>
        </div>

        <form key={citaSel?.id} onSubmit={handleGuardar}>
          {errorPanel && <p className={styles.mensajeError}>{errorPanel}</p>}

          <div className={styles.campoForm}>
            <label>Fecha</label>
            <input type="date" name="fecha" defaultValue={citaSel?.fecha ?? ""} required />
          </div>

          <div className={styles.campoForm}>
            <label>Hora</label>
            <input type="time" name="hora" defaultValue={citaSel?.hora?.slice(0, 5) ?? ""} required />
          </div>

          <div className={styles.campoForm}>
            <label>Motivo</label>
            <textarea name="motivo" rows="3" defaultValue={citaSel?.motivo ?? ""} />
          </div>

          <div className={styles.campoForm}>
            <label>Estado</label>
            <select name="estado" defaultValue={citaSel?.estado ?? "pendiente"}>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className={styles.panelAcciones}>
            <button type="submit" className={styles.btnGuardar} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className={styles.btnCancelarForm} onClick={cerrarPanel}>
              Cancelar
            </button>
          </div>
        </form>
      </aside>

      {panelAbierto && <div className={styles.overlay} onClick={cerrarPanel} />}
    </div>
  );
}

export default GestionCitas;
