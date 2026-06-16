import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function RutaAdmin({ children }) {
  const { token, usuario } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (usuario?.rol !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default RutaAdmin;
