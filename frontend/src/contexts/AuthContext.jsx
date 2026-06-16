import { createContext, useState } from "react";

const AuthContext = createContext({
  usuario: null,
  token: null,
  login: () => null,
  logout: () => null,
});

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const login = (datosUsuario, tokenRecibido) => {
    setUsuario(datosUsuario);
    setToken(tokenRecibido);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    localStorage.setItem("token", tokenRecibido);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  const ctxValue = { usuario, token, login, logout };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
