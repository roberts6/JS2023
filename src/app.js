import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import flash from 'connect-flash';
import passportConfig from './utilidades/passport-config.js';
import passport from 'passport';
// import { generateToken } from './utilidades/token.js';
// import { passportCall } from './utilidades/passportCall.js';
import authorization from './middleware/authorization.js';
import bcrypt from 'bcrypt'; // encriptación de contraseñas
import CustomRouter from './routes/customRouter.js'; // enrutador personalizado
import ProductsRouter from './routes/productsModel.router.js' 
import UsersRouter from './routes/userModel.router.js'
import MessagesRouter from './routes/messagesModel.router.js';
import CookiesRouter from './routes/cookies.router.js'
import GithubRouter from './routes/github.router.js';
import { generateProducts } from './middleware/mock.js';
import winston from 'winston';
import logger from './utilidades/logger.js';

dotenv.config();

const swaggerOptions = { // configuración de opciones de Swagger
  definition:{
openapi:'3.0.1',
info:{
title: 'Documentación de mi API',
description: 'API destinada a e-commerce'
} 
  },
 apis: [`${__dirname}/docs/**/*.yaml`]
}

const app = express();
const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_ATLAS;
const secret = process.env.COOKIE_SECRET;
passportConfig(passport);

const users = [];
const customRouter = new CustomRouter(); // Instancia el enrutador personalizado

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs)) // conección de swagger con el servidor

app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use(cookieParser(secret));

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Endpoint para obtener productos ficticios
app.get('/mockingproducts', (req, res) => {
  const products = generateProducts(); // Genera 100 productos ficticios
  res.render('FakeProductList', { productos: products });
});

// Rutas definidas en el enrutador personalizado
app.use('/customRoutePath', customRouter.getRouter());

// Ruta protegida que solo muestra datos del usuario autenticado
app.get('/current', passport.authenticate('jwt', { session: false }), authorization, (req, res) => {
  res.send({ status: 'success', payload: req.user });
});

app.get('/session', (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Has ingresado al sitio ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send('¡Bienvenido!');
  }
});

app.get('/user-info', (req, res) => {
  if (req.user) {
    res.render('user-info', { name: req.user.name, email: req.user.email, role: req.user.role });
  } else {
    res.status(401).send('Usuario no autenticado');
  }
});

// prueba de loggers
app.get('/loggerTest', (req, res) => {
  logger.debug('Este es un mensaje de depuración');
  logger.info('Este es un mensaje informativo');
  logger.warning('Este es un mensaje de advertencia');
  logger.error('Este es un mensaje de error');
  logger.fatal('Este es un mensaje de error fatal');
  logger.http('Este es un mensaje http');

  res.json({ message: 'Loggers probados exitosamente' });
});

app.use('/products', ProductsRouter);
app.use('/user', UsersRouter);
app.use('/cookies', CookiesRouter);
app.use('/auth', GithubRouter);
app.use('/messages', MessagesRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

server.on('error', (error) => {
  console.error(`Error en el servidor: ${error.message}`);
});

mongoose.connect(DB_URL)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  });



