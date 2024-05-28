import CustomRouter from './customRouter.js';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utilidades/token.js';
import CustomError from '../services/CustomErrors.js';
import { generateUserErrorInfo } from '../services/info.js';
import EErrors from '../services/enums.js';
import logger from '../utilidades/logger.js';
import handlePolicies from '../middleware/handlePolicies.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_GMAIL,
    pass: process.env.PASS_GMAIL
  }
});

class UsersRouter extends CustomRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  initRoutes() {
    this.get('/registro', (req, res) => {
      res.render('registration-form');
    });

    this.post('/registro', async (req, res) => {
      try {
        const { email, password, name, lastName, age, role } = req.body;

        if (!email || !name || !lastName || !age || !password) {
          const error = CustomError.createError({
            name: 'Error al crear usuario',
            cause: generateUserErrorInfo({ name, lastName, age, email }),
            message: 'Error al intentar crear un usuario',
            code: EErrors.INVALID_TYPES_ERROR
          });
          throw error;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Correo ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          password: hashedPassword,
          name,
          lastName,
          age,
          role: 'user'
        });
        await newUser.save();
        logger.info('Usuario registrado con éxito:', { newUser: newUser.toObject() });

        // Detecta si la solicitud viene de un navegador o de una API...probar
        const acceptHeader = req.headers.accept || ''; 
        if (acceptHeader.includes('text/html')) {
          
          res.render('registroExitoso', { user: newUser }, (err, html) => {
            if (err) {
              logger.error('Error en el servidor:', err);
              return res.status(500).json({ message: 'Error en el servidor: ' + err.message });
            }
            res.send(html);
          });
        } else {
          // Responde con un JSON para clientes API (Postman)
          res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
        }
      } catch (error) {
        if (error.code && error.code === EErrors.INVALID_TYPES_ERROR) {
          return res.status(400).json({ message: error.message || 'Error al crear el usuario.' });
        }
        logger.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
      }
    });

    this.get('/datos-usuarios', async (req, res) => {
      try {
        const users = await User.find({}, 'name email role');
        res.json(users);
      } catch (error) {
        logger.error('Error al obtener datos de usuarios:', error);
        res.status(500).json({ error: 'Error al obtener datos de usuarios' });
      }
    });

    this.delete('/inactividad', async (req, res) => {
      try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días atrás
        const usersToDelete = await User.find({ lastConnection: { $lt: twoDaysAgo } });

        const deletePromises = usersToDelete.map(async (user) => {
          await User.findByIdAndDelete(user._id);

          // Envia correo electrónico al usuario
          const mailOptions = {
            from: process.env.USER_GMAIL,
            to: user.email,
            subject: 'Cuenta eliminada por inactividad',
            text: `Hola ${user.name}!, tu cuenta ha sido eliminada debido a inactividad por más de 2 días.`
          };

          await transporter.sendMail(mailOptions);
        });

        await Promise.all(deletePromises);
        res.json({ message: 'Usuarios inactivos eliminados y notificados por correo' });
      } catch (error) {
        logger.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
      }
    });

    this.get('/admin', handlePolicies(['admin']), async (req, res) => {
      try {
        const users = await User.find();
        res.render('admin-users', { users });
      } catch (error) {
        logger.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
      }
    });
    
    this.post('/update-role/:id', handlePolicies(['admin']), async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;
    
      try {
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    
        if (!updatedUser) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    
        res.redirect('/user/admin');
      } catch (error) {
        logger.error('Error al actualizar rol del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar rol del usuario' });
      }
    });
    
    this.post('/delete/:id', handlePolicies(['admin']), async (req, res) => {
      const { id } = req.params;
    
      try {
        const deletedUser = await User.findByIdAndDelete(id);
    
        if (!deletedUser) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    
        res.redirect('/user/admin');
      } catch (error) {
        logger.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
      }
    });    

    this.get('/login', (req, res) => {
      res.render('login-form');
    });

    this.post('/login', async (req, res) => {
      const { email, password } = req.body;
      console.log('Datos recibidos:', email, password);

      try {
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(401).json({ error: 'Correo electrónico no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const tokenPayload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };

        const access_token = generateToken(tokenPayload);
        logger.info('Token generado:', access_token);

        res.status(200).json({ access_token, redirectURL: '/products' });
      } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión' });
      }
    });

    this.get('/protected', handlePolicies(['user', 'admin']), (req, res) => {
      res.send(`Acceso autorizado. Usuario: ${req.user.name} con rol: ${req.user.role}`);
    });

    this.put("/:id", async (req, res) => {
      const { id } = req.params;
      const { email, password, name, lastName } = req.body;

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(
          id, { email, password: hashedPassword, name, lastName }, { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado', data: updatedUser });
      } catch (error) {
        logger.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
      }
    });

    this.delete("/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado', data: deletedUser });
      } catch (error) {
        logger.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
      }
    });
  }
}

export default new UsersRouter().getRouter();

