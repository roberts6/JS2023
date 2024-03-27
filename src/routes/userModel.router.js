// se cambia el código para que ahora tome el custom router generado
import CustomRouter from './customRouter.js';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import {generateToken} from '../utilidades/token.js'
import CustomError from '../services/CustomErrors.js';
import {generateUserErrorInfo} from '../services/info.js';
import EErrors from '../services/enums.js';
import  logger  from '../utilidades/logger.js';

class UsersRouter extends CustomRouter {
    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const users = []
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

                if (!email || !name || !lastName || !age || !password) {
                    const error = CustomError.createError({
                        name: 'creación del usuario errónea',
                        cause: generateUserErrorInfo({
                            name,
                            lastName,
                            age,
                            email
                        }),
                        message: 'Error al intentar crear un usuario',
                        code: EErrors.INVALID_TYPES_ERROR
                    });
                    throw error;                
                }

                // Verificar si el correo electrónico ya está registrado
                const existingUser = await User.findOne({ email});
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
                //console.log('Usuario registrado con éxito:', newUser);
                logger.info('Usuario registrado con éxito:', { newUser: newUser.toObject() }); // logger.js

                res.render('registroExitoso', {
                    user: newUser
                }, (err, html) => {
                    if (err) {
                        logger.error('Error en el servidor:', err); // logger.js
                        return res.status(500).json({
                            message: 'Error en el servidor: ' + err.message
                        });
                    }
                    res.send(html);
                });
            } catch (error) {
                // Capturar y responder con un mensaje de error en caso de falla
                if (error.code && error.code === EErrors.INVALID_TYPES_ERROR) {
                    return res.status(400).json({
                        message: error.message || 'Se produjo un error al crear el usuario.'
                    })
                }
                logger.error('Error durante el proceso de registro:',  error) //logger.js
                res.status(500).json({
                    message: 'Error en el servidor: ' + error.message
                })
            }
        });

        // acceso al login
        this.get('/login', (req, res) => {
            res.render('login-form');
        });

        // Ruta para autenticar al usuario e iniciar sesión
        // this.post('/login', async (req, res) => {
        //     const {
        //         email,
        //         password
        //     } = req.body;
        //     console.log('esto trae el req.body: ', email, password);

        //     try {
        //         const user = await User.findOne({
        //             email
        //         });

        //         if (!user) {
        //             return res.status(401).json({
        //                 error: 'Correo electrónico no encontrado en la base de datos'
        //             });
        //         }

        //         const passwordMatch = await bcrypt.compare(password, user.password);

        //         if (!passwordMatch) {
        //             return res.status(401).json({
        //                 error: 'Contraseña incorrecta'
        //             });
        //         }

        //         // Generar el token JWT para el usuario
        //         const access_token = generateToken({
        //             _id: user._id,
        //             name: user.name,
        //             email: user.email,
        //             role: user.role
        //         });
        //         logger.info('Access token generado:', access_token); // logger.js
        //         res.status(200).json({
        //             access_token,
        //             redirectURL: '/products'
        //         }); // Redirige a la página de productos después de autenticar al usuario
        //     } catch (error) {
        //         console.error(error); // Imprimir el error completo en la consola del servidor
        //         res.status(500).json({
        //             error: 'Error en el servidor al intentar iniciar sesión'
        //         }); // Respuesta genérica de error
        //     }
        // });
        this.post('/login', async (req, res) => {
            const { email, password } = req.body;
            console.log('esto trae el req.body: ', email, password);
        
            try {
                const user = await User.findOne({ email });
        
                if (!user) {
                    return res.status(401).json({ error: 'Correo electrónico no encontrado en la base de datos' });
                }
        
                const passwordMatch = await bcrypt.compare(password, user.password);
        
                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Contraseña incorrecta' });
                }
        
                // Autenticación exitosa, genera el token JWT
                const tokenPayload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
        
                const access_token = generateToken(tokenPayload);
                logger.info('Access token generado:', access_token);
        
                // Redirige a la página de productos después de autenticar al usuario
                res.status(200).json({ access_token, redirectURL: '/products' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión' });
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
                logger.error('Error al actualizar el usuario:', error); // usando logger.js
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
                logger.error('Error al eliminar el usuario:', error); // logger.js
                res.status(500).json({
                    error: 'Error al eliminar el usuario'
                });
            }
        });
    }
}


export default new UsersRouter().getRouter();