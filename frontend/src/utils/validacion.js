const isValidEmail = (email) => {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 6;
};

const isValidNombre = (nombre) => {
  return nombre.trim().length >= 2;
};

export const validacion = {
  isValidEmail,
  isValidPassword,
  isValidNombre,
};
