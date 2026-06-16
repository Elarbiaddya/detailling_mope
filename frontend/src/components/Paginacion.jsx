import styles from "./paginacion.module.css";

function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }) {
  if (totalPaginas <= 1) return null;

  return (
    <div className={styles.paginacion}>
      <button
        className={styles.btn}
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
      >
        Anterior
      </button>
      <span className={styles.info}>
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        className={styles.btn}
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Paginacion;
