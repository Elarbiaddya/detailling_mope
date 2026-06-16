import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { validacion } from "../utils/validacion";
import styles from "./registro.module.css";

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

// Traduce los mensajes de validación de Laravel al español
function traducirError(campo, mensaje) {
  if (!mensaje) return mensaje;

  if (mensaje === "validation.unique") {
    if (campo === "usuario") return "Ese nombre de usuario ya está en uso.";
    if (campo === "email") return "Ese correo electrónico ya está registrado.";
    return "Este valor ya está en uso.";
  }
  if (mensaje === "validation.required") return "Este campo es obligatorio.";
  if (mensaje === "validation.email") return "El formato del correo no es válido.";
  if (mensaje === "validation.confirmed") return "Las contraseñas no coinciden.";
  if (mensaje.startsWith("validation.min")) return "Este campo es demasiado corto.";
  if (mensaje.startsWith("validation.max")) return "Este campo es demasiado largo.";

  // Si no hay traducción conocida, devuelve el mensaje original
  return mensaje;
}

function Registro() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    setErrores({});

    // Validación frontend
    const nuevosErrores = {};
    if (!validacion.isValidNombre(nombre)) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }
    if (!usuario.trim()) {
      nuevosErrores.usuario = "El usuario es obligatorio";
    }
    if (!validacion.isValidEmail(email)) {
      nuevosErrores.email = "El email no es válido";
    }
    if (!validacion.isValidPassword(password)) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (password !== passwordConfirmacion) {
      nuevosErrores.passwordConfirmacion = "Las contraseñas no coinciden";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API}/register`, {
        method: "POST",
        headers: cabecerasJson,
        body: JSON.stringify({
          nombre,
          usuario,
          email,
          password,
          password_confirmation: passwordConfirmacion,
        }),
      });

      // Separamos el parseo del JSON para no confundirlo con un error de red
      let datos;
      try {
        datos = await respuesta.json();
      } catch {
        setErrorGeneral("El servidor devolvió una respuesta inesperada.");
        return;
      }

      if (!respuesta.ok) {
        if (respuesta.status === 422 && datos.errors) {
          // Mapeamos campo snake_case del backend → clave camelCase del estado
          const mapa = { password_confirmation: "passwordConfirmacion" };
          const erroresBackend = {};
          Object.keys(datos.errors).forEach((campo) => {
            const clave = mapa[campo] ?? campo;
            const mensajeRaw = datos.errors[campo][0];
            erroresBackend[clave] = traducirError(campo, mensajeRaw);
          });
          setErrores(erroresBackend);
        } else if (respuesta.status >= 500) {
          setErrorGeneral("Error en el servidor. Inténtalo de nuevo más tarde.");
        } else {
          setErrorGeneral(datos.message || "Error al crear la cuenta.");
        }
        return;
      }

      const token = datos.token;

      // Pedimos los datos del usuario autenticado
      const respuestaMe = await fetch(`${API}/me`, {
        headers: cabecerasConToken(token),
      });
      const datosUsuario = await respuestaMe.json();

      // Normalizamos el rol igual que en Login
      const rolRaw = datosUsuario.rol ?? datosUsuario.role ?? "cliente";
      const usuarioNormalizado = {
        ...datosUsuario,
        rol: typeof rolRaw === "string" && rolRaw.toLowerCase() === "admin"
          ? "admin"
          : "cliente",
      };

      login(usuarioNormalizado, token);
      navigate("/perfil");
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
        <h2 className={styles.titulo}>Crear cuenta</h2>

        {errorGeneral && (
          <p className={styles.errorGeneral}>{errorGeneral}</p>
        )}

        <div className={styles.campo}>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
          />
          {errores.nombre && <span className="error">{errores.nombre}</span>}
        </div>

        <div className={styles.campo}>
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Nombre de usuario"
          />
          {errores.usuario && <span className="error">{errores.usuario}</span>}
        </div>

        <div className={styles.campo}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
          {errores.email && <span className="error">{errores.email}</span>}
        </div>

        <div className={styles.campo}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
          {errores.password && (
            <span className="error">{errores.password}</span>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="passwordConfirmacion">Confirmar contraseña</label>
          <input
            id="passwordConfirmacion"
            type="password"
            value={passwordConfirmacion}
            onChange={(e) => setPasswordConfirmacion(e.target.value)}
            placeholder="Repite la contraseña"
          />
          {errores.passwordConfirmacion && (
            <span className="error">{errores.passwordConfirmacion}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.btnEnviar}
          disabled={cargando}
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>

        <p className={styles.enlace}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Registro;
