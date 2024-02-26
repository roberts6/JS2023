import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import autenticacion from "../middleware/autenticacion.js";
import { engine } from 'express-handlebars';

const app = express();

// Configura express-handlebars como motor de vistas
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

const router = express.Router();

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
        role: 'user',
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

        const isAdmin = user.email === process.env.ADMIN_EMAIL && await bcrypt.compare(req.body.password, user.password);

        const userData = {
            message: 'Login exitoso',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                role: isAdmin ? 'admin' : user.role
            }
        };
        
        // Renderizar la plantilla 'user-info' con los datos del usuario
        res.status(200).json(userData); // Cambiado a json en lugar de render
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
});

router.get('/accesoAdmin', autenticacion, (req, res) => {
    try {
        res.json({ message: "Funcionalidades de administrador ok" });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
});

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
    const { name } = req.query;
    console.log("este es el nombre de la cookie: ", name);
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión: ' + err.message });
        }
        res.clearCookie(name);
        return res.status(200).json({ message: 'Sesión cerrada con éxito' });
    });
});

export default router;



