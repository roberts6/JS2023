// Definir middleware de autenticación
const autenticacion = (req, res, next) => {
    // Verificar el rol del usuario
    if (req.user.role === 'admin') {
      // Si es administrador, permitir el acceso
      next();
    } else {
      // Si no es administrador, devolver un error de acceso denegado
      res.status(403).json({
        message: "Acceso denegado. No tienes permisos de administrador."
      });
    }
  };


  export default autenticacion;