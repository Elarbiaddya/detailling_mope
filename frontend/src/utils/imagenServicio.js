const MAPA = [
  ["limpieza interior",                  "/servicios/limpieza-interior.png"],
  ["limpieza exterior",                  "/servicios/limpieza-exterior.png"],
  ["limpieza completa",                  "/servicios/limpieza-completa.png"],
  ["limpieza de motor",                  "/servicios/limpieza-motores.jpg"],
  ["limpieza motor",                     "/servicios/limpieza-motores.jpg"],
  ["pulido de faros",                    "/servicios/pulido-faros.jpg"],
  ["pulido faros",                       "/servicios/pulido-faros.jpg"],
  ["pulido y abrillantado",              "/servicios/limpieza-completa.png"],
  ["tintado de faros",                   "/servicios/tintado-faros-traseros.jpg"],
  ["tintado faros",                      "/servicios/tintado-faros-traseros.jpg"],
  ["protección cerámica",                "/servicios/limpieza-completa.png"],
  ["ceramica",                           "/servicios/limpieza-completa.png"],
  ["cambio de aceite",                   "/servicios/cambio-aceite.png"],
  ["cambio de filtros",                  "/servicios/filtros.png"],
  ["cambio de pastillas y discos",       "/servicios/discos-pastillas.png"],
  ["cambio de pastillas de freno",       "/servicios/pastillas.png"],
  ["radio",                              "/servicios/radio.png"],
];

const FALLBACK = "/servicios/limpieza-completa.png";

export function imagenServicio(servicio) {
  if (servicio?.imagen) return servicio.imagen;
  const nombre = (servicio?.nombre ?? "").toLowerCase();
  for (const [clave, ruta] of MAPA) {
    if (nombre.includes(clave)) return ruta;
  }
  return FALLBACK;
}
