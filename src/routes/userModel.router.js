import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js"; 

const router = Router();

// Ruta de registro
router.post('/registro', async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Este correo ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: 'user', // Todos los nuevos usuarios tienen rol de usuario por defecto
        name: req.body.name,
        lastName: req.body.lastName
      });

      const newUser = await user.save();
  
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
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos 😔' });
    }

    // devuelve un booleano
    const isAdmin = user.email === process.env.ADMIN_EMAIL && await bcrypt.compare(req.body.password, user.password);
    
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: isAdmin ? 'admin' : user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
});

export default router;



