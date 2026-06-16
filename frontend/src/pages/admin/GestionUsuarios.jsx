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

// El backend puede devolver rol como string ("admin") u objeto ({ nombre: "admin" })
// Esta función extrae siempre un string, igual que esAdmin() en Login.jsx
function rolTexto(u) {
  const r = u?.rol ?? u?.role ?? u?.usuario_rol;
  if (!r) return "—";
  if (typeof r === "string") return r;
  if (typeof r === "object") return r.nombre ?? r.nombre_rol ?? "—";
  return "—";
}

function GestionUsuarios() {
  const { token } = useContext(AuthContext);

  const [usuarios, setUsuarios]         = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [busqueda, setBusqueda]             = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [usuarioSel, setUsuarioSel]     = useState(null);
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

      const res = await fetch(`${API}/usuarios?${params}`, {
        headers: cabecerasConToken(token),
      });
      if (!res.ok) throw new Error("Error al cargar los usuarios.");

      const datos = await res.json();
      const lista = datos.data ?? datos;
      setUsuarios(Array.isArray(lista) ? lista : []);
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
    setUsuarioSel(null);
    setErrorPanel(null);
    setMensaje(null);
    setPanelAbierto(true);
  };

  const abrirEditar = (u) => {
    setUsuarioSel(u);
    setErrorPanel(null);
    setMensaje(null);
    setPanelAbierto(true);
  };

  const cerrarPanel = () => {
    setPanelAbierto(false);
    setUsuarioSel(null);
    setErrorPanel(null);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorPanel(null);

    const datos = {
      nombre:  e.target.nombre.value.trim(),
      usuario: e.target.usuario.value.trim(),
      email:   e.target.email.value.trim(),
      rol:     e.target.rol.value,
    };

    const passwd = e.target.password.value;
    if (!usuarioSel) {
      if (!passwd) {
        setErrorPanel("La contraseña es obligatoria al crear un usuario.");
        return;
      }
      datos.password              = passwd;
      datos.password_confirmation = e.target.password_confirmation.value;
    } else if (passwd) {
      datos.password              = passwd;
      datos.password_confirmation = e.target.password_confirmation.value;
    }

    setGuardando(true);
    try {
      const url    = usuarioSel ? `${API}/usuarios/${usuarioSel.id}` : `${API}/usuarios`;
      const method = usuarioSel ? "PUT" : "POST";

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
        texto: usuarioSel ? "Usuario actualizado correctamente." : "Usuario creado correctamente.",
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
    if (!window.confirm(`¿Eliminar el usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`${API}/usuarios/${id}`, {
        method: "DELETE",
        headers: cabecerasConToken(token),
      });

      let respuesta = {};
      try { respuesta = await res.json(); } catch { /* sin cuerpo */ }

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: respuesta.message || "No se pudo eliminar el usuario." });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Usuario eliminado correctamente." });
      cargar();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión." });
    }
  };

  return (
    <div>
      <div className={styles.cabecera}>
        <h2 className={styles.tituloCrud}>Usuarios</h2>
        <button className={styles.btnNuevo} onClick={abrirNuevo}>
          + Nuevo usuario
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
          aria-label="Buscar usuario por nombre o email"
          className={styles.inputFiltro}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o email..."
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
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--color-texto-suave)" }}>
                    No hay usuarios.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td data-label="ID">{u.id}</td>
                    <td data-label="Nombre">{u.nombre}</td>
                    <td data-label="Usuario">{u.usuario}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Rol">{rolTexto(u)}</td>
                    <td data-label="Acciones">
                      <div className={styles.tdAcciones}>
                        <button className={styles.btnEditar} onClick={() => abrirEditar(u)}>
                          Editar
                        </button>
                        <button className={styles.btnEliminar} onClick={() => handleEliminar(u.id, u.nombre)}>
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
            {usuarioSel ? "Editar usuario" : "Nuevo usuario"}
          </span>
          <button className={styles.btnCerrarPanel} onClick={cerrarPanel}>✕</button>
        </div>

        <form key={usuarioSel?.id ?? "nuevo"} onSubmit={handleGuardar}>
          {errorPanel && <p className={styles.mensajeError}>{errorPanel}</p>}

          <div className={styles.campoForm}>
            <label>Nombre</label>
            <input name="nombre" defaultValue={usuarioSel?.nombre ?? ""} required />
          </div>

          <div className={styles.campoForm}>
            <label>Usuario</label>
            <input name="usuario" defaultValue={usuarioSel?.usuario ?? ""} required />
          </div>

          <div className={styles.campoForm}>
            <label>Email</label>
            <input type="email" name="email" defaultValue={usuarioSel?.email ?? ""} required />
          </div>

          <div className={styles.campoForm}>
            <label>Rol</label>
            <select name="rol" defaultValue={rolTexto(usuarioSel) === "admin" ? "admin" : "cliente"}>
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.campoForm}>
            <label>
              {usuarioSel
                ? "Nueva contraseña (dejar vacío para no cambiar)"
                : "Contraseña"}
            </label>
            <input type="password" name="password" autoComplete="new-password" />
          </div>

          <div className={styles.campoForm}>
            <label>Confirmar contraseña</label>
            <input type="password" name="password_confirmation" autoComplete="new-password" />
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

export default GestionUsuarios;
