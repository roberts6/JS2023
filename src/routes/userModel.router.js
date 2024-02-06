import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js"; 

const router = Router();

// Ruta de registro
router.post('/registro', async (req, res) => {
    try {
      // Comprueba si el usuario ya existe
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Este correo ya está registrado' });
      }
  
      // Encripta la contraseña
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Verifica si el usuario es admin
      const isAdmin = req.body.email === 'adminCoder@coder.com' && req.body.password === 'adminCod3er123';
  
      // Crea un nuevo usuario con el rol correspondiente
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'usuario', // Asigna "admin" si el usuario es admin, de lo contrario "usuario"
        name: req.body.name,
        lastName: req.body.lastName
      });
  
      // Guarda el usuario en la base de datos
      const newUser = await user.save();
  
      // Responde al cliente
      res.status(201).json({
        message: 'Usuario registrado con éxito. No olvides que tu usuario es tu email',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          lastName: newUser.lastName,
          role: newUser.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
  });  
  
// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  try {
    // Busca al usuario por email
    const user = await User.findOne({ email: req.body.email });

    // Si no existe el usuario o la contraseña no coincide
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'o tu correo o tu password es incorrecto 😔' });
    }

    // Si el usuario es el administrador, establece isAdmin en true
    if (user.email === 'adminCoder@coder.com' && req.body.password === 'adminCod3r123') {
      user.isAdmin = true;
      await user.save();
    }

    // Responde al cliente con los datos necesarios
    res.json({
      message: 'Login exitoso',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role
      }
    });

    // Redirige a la vista de "productos" si el login es exitoso
    return res.redirect('/products');
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
});

export default router;


