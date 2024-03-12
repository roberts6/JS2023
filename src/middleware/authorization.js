// Definir middleware de autenticación
const authorization = (req, res, next) => {
  if (!res) {
    throw new Error('La respuesta no está definida en el middleware.');
}
  if (!req.user) {
    return res.status(401).send({
        error: "Inicia sesión para acceder a esta función."
    });
}  
  // Verificar el rol del usuario
    if (req.user.role === 'admin') {
      // Si es administrador, permitir el acceso
      next();
    } else {
      // Si no es administrador, devolver un error de acceso denegado
      return res.status(403).send({
        error: "Acceso denegado. No tienes permisos de administrador."
      });
    }
  };


  export default authorization;