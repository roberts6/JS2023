// se cambia el código para que ahora tome el custom router generado
import CustomRouter from './customRouter.js';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

class UsersRouter extends CustomRouter {
    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        // Vista para registro de usuarios 
        this.get('/registro', (req, res) => {
            res.render('registration-form');
        });

        // Ruta para crear un nuevo usuario -> http://localhost:3000/user/registro
        this.post('/registro', async (req, res) => {
            try {
                const {
                    email,
                    password,
                    name,
                    lastName,
                    age,
                    role
                } = req.body;

                // Verificar si el correo electrónico ya está registrado
                const existingUser = await User.findOne({
                    email
                });
                if (existingUser) {
                    return res.status(400).json({
                        message: 'Este correo ya está registrado'
                    });
                }

                // Generar el hash de la contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                // Crear un nuevo usuario
                const newUser = new User({
                    email,
                    password: hashedPassword,
                    name,
                    lastName,
                    age,
                    role: 'user'
                });
                // Guardar el nuevo usuario en la base de datos
                await newUser.save();
                // Mostrar el usuario creado en la consola
                console.log('Usuario registrado con éxito:', newUser);

                //res.render('registroExitoso');
                res.render('registroExitoso', {
                    user: newUser
                }, (err, html) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: 'Error en el servidor: ' + err.message
                        });
                    }
                    res.send(html);
                });
            } catch (error) {
                // Capturar y responder con un mensaje de error en caso de falla
                console.error(error);
                res.status(500).json({
                    message: 'Error en el servidor: ' + error.message
                });
            }
        });



        // acceso al login
        this.get('/login', (req, res) => {
            res.render('login-form');
        });

        // Ruta para autenticar al usuario y iniciar sesión
        this.post('/login', async (req, res) => {
            const {
                email,
                password
            } = req.body;

            try {
                const user = await User.findOne({
                    email
                });

                if (!user) {
                    return res.status(401).json({
                        message: 'Correo electrónico o contraseña incorrectos'
                    });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: 'Correo electrónico o contraseña incorrectos'
                    });
                }

                res.json({
                    message: 'Inicio de sesión exitoso',
                    user
                });

            } catch (error) {
                res.status(500).json({
                    message: 'Error en el servidor: ' + error.message
                });
            }
        });

        // Ruta para modificar un usuario por su id
        this.put("/:id", async (req, res) => {
            const {
                id
            } = req.params;
            const {
                email,
                password,
                name,
                lastName
            } = req.body;

            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const updatedUser = await User.findByIdAndUpdate(
                    id, {
                        email,
                        password: hashedPassword,
                        name,
                        lastName
                    }, {
                        new: true
                    }
                );

                if (!updatedUser) {
                    return res.status(404).json({
                        error: 'Usuario no encontrado'
                    });
                }

                res.json({
                    message: 'Usuario actualizado',
                    data: updatedUser
                });
            } catch (error) {
                res.status(500).json({
                    error: 'Error al actualizar el usuario'
                });
            }
        });

        // Ruta para borrar un usuario por su id
        this.delete("/:id", async (req, res) => {
            const {
                id
            } = req.params;

            try {
                const deletedUser = await User.findByIdAndDelete(id);

                if (!deletedUser) {
                    return res.status(404).json({
                        error: 'Usuario no encontrado'
                    });
                }

                res.json({
                    message: 'Usuario eliminado',
                    data: deletedUser
                });
            } catch (error) {
                res.status(500).json({
                    error: 'Error al eliminar el usuario'
                });
            }
        });
    }
}


export default new UsersRouter().getRouter();