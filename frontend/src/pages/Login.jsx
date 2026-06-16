import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./login.module.css";

const API = import.meta.env.VITE_API_BASE_URL;

const cabecerasJson = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

function cabecerasConToken(token) {
  return {
    ...cabecerasJson,
    Authorization: `Bearer ${token}`,
  };
}

// Detecta si el usuario es admin independientemente de cómo venga el rol
function esAdmin(usuario) {
  if (!usuario) return false;

  // Busca en los campos más comunes
  const posibleRol =
    usuario.rol ??
    usuario.role ??
    usuario.usuario_rol ??
    null;

  if (typeof posibleRol === "string") {
    return posibleRol.toLowerCase() === "admin";
  }

  // Si el rol es un objeto con nombre (ej: { nombre: "admin" })
  if (typeof posibleRol === "object" && posibleRol !== null) {
    const nombre = posibleRol.nombre ?? posibleRol.nombre_rol ?? "";
    return nombre.toLowerCase() === "admin";
  }

  return false;
}

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsuario, setErrorUsuario] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);

    // Validación frontend
    let hayError = false;
    if (!usuario.trim()) {
      setErrorUsuario("El usuario es obligatorio");
      hayError = true;
    } else {
      setErrorUsuario(null);
    }
    if (!password.trim()) {
      setErrorPassword("La contraseña es obligatoria");
      hayError = true;
    } else {
      setErrorPassword(null);
    }
    if (hayError) return;

    setCargando(true);
    try {
      const respuesta = await fetch(`${API}/login`, {
        method: "POST",
        headers: cabecerasJson,
        body: JSON.stringify({ usuario, password }),
      });

      let datos;
      try {
        datos = await respuesta.json();
      } catch {
        setErrorGeneral("El servidor devolvió una respuesta inesperada.");
        return;
      }

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          setErrorGeneral("Usuario o contraseña incorrectos.");
        } else if (respuesta.status === 422) {
          setErrorGeneral(datos.message || "Datos de login incorrectos.");
        } else if (respuesta.status >= 500) {
          setErrorGeneral("Error en el servidor. Inténtalo de nuevo más tarde.");
        } else {
          setErrorGeneral(datos.message || "No se pudo iniciar sesión.");
        }
        return;
      }

      const token = datos.token;

      // Pedimos los datos del usuario autenticado
      const respuestaMe = await fetch(`${API}/me`, {
        headers: cabecerasConToken(token),
      });
      const datosUsuario = await respuestaMe.json();

      // Normalizamos el rol para que siempre sea "admin" o "cliente"
      // independientemente de cómo lo devuelva el backend
      const usuarioNormalizado = {
        ...datosUsuario,
        rol: esAdmin(datosUsuario) ? "admin" : "cliente",
      };

      login(usuarioNormalizado, token);

      if (usuarioNormalizado.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/perfil");
      }
    } catch {
      // Solo llega aquí si fetch() falla de verdad (sin red, servidor caído)
      setErrorGeneral("Error de conexión. Comprueba que el servidor está activo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.contenedor}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h2 className={styles.titulo}>Iniciar sesión</h2>

        {errorGeneral && (
          <p className={styles.errorGeneral}>{errorGeneral}</p>
        )}

        <div className={styles.campo}>
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Tu nombre de usuario"
          />
          {errorUsuario && <span className="error">{errorUsuario}</span>}
        </div>

        <div className={styles.campo}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
          />
          {errorPassword && <span className="error">{errorPassword}</span>}
        </div>

        <button
          type="submit"
          className={styles.btnEnviar}
          disabled={cargando}
        >
          {cargando ? "Entrando..." : "Entrar"}
        </button>

        <p className={styles.enlace}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
