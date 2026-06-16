import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./citas.module.css";

const API = import.meta.env.VITE_API_BASE_URL;

const HORAS = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

const ERRORES_ES = {
  servicio_id: "El servicio es obligatorio.",
  fecha:       "La fecha es obligatoria.",
  hora:        "La hora es obligatoria.",
  motivo:      "El motivo es obligatorio.",
};

function esFindeSemana(fechaStr) {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const dia = new Date(y, m - 1, d).getDay();
  return dia === 0 || dia === 6;
}

function cabecerasConToken(token) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function Citas() {
  const { token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [servicioId, setServicioId] = useState(searchParams.get("servicio_id") ?? "");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState(null);
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch(`${API}/servicios?per_page=100`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((datos) => {
        const lista = datos.data ?? datos;
        setServicios(Array.isArray(lista) ? lista : []);
      })
      .catch(() => {});
  }, []);

  const validar = () => {
    const errs = {};
    if (!servicioId) errs.servicio_id = "El servicio es obligatorio.";
    if (!fecha) {
      errs.fecha = "La fecha es obligatoria.";
    } else if (esFindeSemana(fecha)) {
      errs.fecha = "No se pueden pedir citas en sábado ni domingo.";
    }
    if (!hora) errs.hora = "La hora es obligatoria.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal(null);

    const errsLocales = validar();
    if (Object.keys(errsLocales).length > 0) {
      setErrores(errsLocales);
      return;
    }
    setErrores({});
    setEnviando(true);

    try {
      const res = await fetch(`${API}/citas`, {
        method: "POST",
        headers: cabecerasConToken(token),
        body: JSON.stringify({
          servicio_id: Number(servicioId),
          fecha,
          hora,
          motivo: motivo.trim() || null,
        }),
      });

      let datos;
      try { datos = await res.json(); } catch { datos = {}; }

      if (!res.ok) {
        if (res.status === 422 && datos.errors) {
          const errsServidor = {};
          for (const [campo, msgs] of Object.entries(datos.errors)) {
            errsServidor[campo] = ERRORES_ES[campo] ?? msgs[0];
          }
          setErrores(errsServidor);
        } else {
          setErrorGlobal(datos.message || "No se pudo crear la cita.");
        }
        return;
      }

      setExito(true);
    } catch {
      setErrorGlobal("Error de conexión. Comprueba que el servidor está activo.");
    } finally {
      setEnviando(false);
    }
  };

  const handlePedirOtra = () => {
    setExito(false);
    setFecha("");
    setHora("");
    setMotivo("");
    setErrores({});
    setErrorGlobal(null);
  };

  const hoy = new Date().toISOString().split("T")[0];

  if (exito) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.exito}>
          <h2 className={styles.exitoTitulo}>¡Cita solicitada!</h2>
          <p className={styles.exitoTexto}>Tu cita ha sido registrada y queda pendiente de confirmación.</p>
          <div className={styles.exitoAcciones}>
            <button className={styles.btnPrimario} onClick={() => navigate("/perfil")}>
              Ver mis citas
            </button>
            <button className={styles.btnSecundario} onClick={handlePedirOtra}>
              Pedir otra cita
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Pedir cita</h1>

      {errorGlobal && <p className={styles.errorGlobal}>{errorGlobal}</p>}

      <form className={styles.formulario} onSubmit={handleSubmit} noValidate>

        <div className={styles.campo}>
          <label htmlFor="servicio">Servicio <span className={styles.req}>*</span></label>
          <select
            id="servicio"
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            className={errores.servicio_id ? styles.inputError : ""}
          >
            <option value="">— Selecciona un servicio —</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
          {errores.servicio_id && (
            <span className={styles.errorCampo}>{errores.servicio_id}</span>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="fecha">
            Fecha <span className={styles.req}>*</span>{" "}
            <span className={styles.hint}>— lunes a viernes</span>
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            min={hoy}
            onChange={(e) => setFecha(e.target.value)}
            className={errores.fecha ? styles.inputError : ""}
          />
          {errores.fecha && (
            <span className={styles.errorCampo}>{errores.fecha}</span>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="hora">Hora <span className={styles.req}>*</span></label>
          <select
            id="hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className={errores.hora ? styles.inputError : ""}
          >
            <option value="">— Selecciona una hora —</option>
            {HORAS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          {errores.hora && (
            <span className={styles.errorCampo}>{errores.hora}</span>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="motivo">
            Motivo <span className={styles.hint}>— opcional</span>
          </label>
          <textarea
            id="motivo"
            value={motivo}
            rows={3}
            placeholder="Describe brevemente el motivo de la cita..."
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.btnPrimario} disabled={enviando}>
          {enviando ? "Enviando..." : "Confirmar cita"}
        </button>
      </form>
    </div>
  );
}

export default Citas;
