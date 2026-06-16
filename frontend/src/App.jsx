import "./styles/globales.css";
import "./styles/reusables.css";
import { Routes, Route } from "react-router-dom";
import BigLayout from "./pages/BigLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Servicios from "./pages/Servicios";
import DetalleServicio from "./pages/DetalleServicio";
import Perfil from "./pages/Perfil";
import Citas from "./pages/Citas";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RutaPrivada from "./pages/protected/RutaPrivada";
import RutaAdmin from "./pages/protected/RutaAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BigLayout />}>
        <Route index element={<Home />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="servicios/:id" element={<DetalleServicio />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route
          path="perfil"
          element={
            <RutaPrivada>
              <Perfil />
            </RutaPrivada>
          }
        />
        <Route
          path="citas"
          element={
            <RutaPrivada>
              <Citas />
            </RutaPrivada>
          }
        />
        <Route
          path="admin"
          element={
            <RutaAdmin>
              <AdminDashboard />
            </RutaAdmin>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
