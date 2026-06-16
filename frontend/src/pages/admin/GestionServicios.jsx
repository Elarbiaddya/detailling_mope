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

function GestionServicios() {
  const { token } = useContext(AuthContext);

  const [servicios, setServicios]       = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [busqueda, setBusqueda]             = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [servicioSel, setServicioSel]   = useState(null);
  const [guardando, setGuardando]       = useState(false);
  const [errorPanel, setErrorPanel]     = useState(null);
  const [mensaje, setMensaje]           = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (busquedaActiva) params.set("nombre", busquedaActiva);
      params.set("page", paginaActual);

      const res = await fetch(`${API}/servicios?${params}`, {
        headers: cabecerasConToken(token),
      });
      if (!res.ok) throw new Error("Error al cargar los servicios.");

      const datos = await res.json();
      const lista = datos.data ?? datos;
      setServicios(Array.isArray(lista) ? lista : []);
      setTotalPaginas(datos.meta?.last_page ?? datos.last_page ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
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

  const abrirNuevo = () => {
    setServicioSel(null);
    setErrorPanel(null);
    setMensaje(null);
    setPanelAbierto(true);
  };

  const abrirEditar = (s) => {
    setServicioSel(s);
    setErrorPanel(null);
    setMensaje(null);
    setPanelAbierto(true);
  };

  const cerrarPanel = () => {
    setPanelAbierto(false);
    setServicioSel(null);
    setErrorPanel(null);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorPanel(null);

    const datos = {
      nombre:      e.target.nombre.value.trim(),
      descripcion: e.target.descripcion.value.trim(),
      precio_base: e.target.precio_base.value || null,
      duracion:    e.target.duracion.value || null,
    };

    setGuardando(true);
    try {
      const url    = servicioSel ? `${API}/servicios/${servicioSel.id}` : `${API}/servicios`;
      const method = servicioSel ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
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

      setMensaje({
        tipo:  "exito",
        texto: servicioSel ? "Servicio actualizado correctamente." : "Servicio creado correctamente.",
      });
      cerrarPanel();
      cargar();
    } catch {
      setErrorPanel("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el servicio "${nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`${API}/servicios/${id}`, {
        method: "DELETE",
        headers: cabecerasConToken(token),
      });

      let respuesta = {};
      try { respuesta = await res.json(); } catch { /* sin cuerpo */ }

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: respuesta.message || "No se pudo eliminar el servicio." });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Servicio eliminado correctamente." });
      cargar();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión." });
    }
  };

  return (
    <div>
      <div className={styles.cabecera}>
        <h2 className={styles.tituloCrud}>Servicios</h2>
        <button className={styles.btnNuevo} onClick={abrirNuevo}>
          + Nuevo servicio
        </button>
      </div>

      {mensaje && (
        <p className={mensaje.tipo === "exito" ? styles.mensajeExito : styles.mensajeError}>
          {mensaje.texto}
        </p>
      )}

      <form className={styles.filtroForm} onSubmit={handleBuscar}>
        <input
          type="text"
          aria-label="Buscar servicio por nombre"
          className={styles.inputFiltro}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
        />
        <button type="submit" className={styles.btnFiltrar}>
          Buscar
        </button>
        {busquedaActiva && (
          <button type="button" className={styles.btnLimpiar} onClick={handleLimpiar}>
            Limpiar
          </button>
        )}
      </form>

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
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio (€)</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--color-texto-suave)" }}>
                    No hay servicios.
                  </td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.id}>
                    <td data-label="ID">{s.id}</td>
                    <td data-label="Nombre">{s.nombre}</td>
                    <td data-label="Descripción">
                      {s.descripcion
                        ? s.descripcion.length > 60
                          ? s.descripcion.slice(0, 60) + "..."
                          : s.descripcion
                        : "—"}
                    </td>
                    <td data-label="Precio">{s.precio_base ? `${s.precio_base} €` : "—"}</td>
                    <td data-label="Duración">{s.duracion ? `${s.duracion} min` : "—"}</td>
                    <td data-label="Acciones">
                      <div className={styles.tdAcciones}>
                        <button className={styles.btnEditar} onClick={() => abrirEditar(s)}>
                          Editar
                        </button>
                        <button className={styles.btnEliminar} onClick={() => handleEliminar(s.id, s.nombre)}>
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

      {/* Panel lateral crear / editar */}
      <aside className={`${styles.panel} ${panelAbierto ? styles.panelAbierto : ""}`}>
        <div className={styles.panelCabecera}>
          <span className={styles.panelTitulo}>
            {servicioSel ? "Editar servicio" : "Nuevo servicio"}
          </span>
          <button className={styles.btnCerrarPanel} onClick={cerrarPanel}>✕</button>
        </div>

        <form key={servicioSel?.id ?? "nuevo"} onSubmit={handleGuardar}>
          {errorPanel && <p className={styles.mensajeError}>{errorPanel}</p>}

          <div className={styles.campoForm}>
            <label>Nombre</label>
            <input name="nombre" defaultValue={servicioSel?.nombre ?? ""} required />
          </div>

          <div className={styles.campoForm}>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              rows="3"
              defaultValue={servicioSel?.descripcion ?? ""}
            />
          </div>

          <div className={styles.campoForm}>
            <label>Precio base (€)</label>
            <input
              type="number"
              name="precio_base"
              min="0"
              step="0.01"
              defaultValue={servicioSel?.precio_base ?? ""}
            />
          </div>

          <div className={styles.campoForm}>
            <label>Duración estimada (min)</label>
            <input
              type="number"
              name="duracion"
              min="1"
              step="1"
              defaultValue={servicioSel?.duracion ?? ""}
            />
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

export default GestionServicios;
