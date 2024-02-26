import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productsRouter from './routes/productsModel.router.js';
import messagesRouter from './routes/messagesModel.router.js';
import UserRouter from './routes/userModel.router.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.router.js';
import cors from 'cors';
import { engine } from 'express-handlebars';
import flash from 'connect-flash';
import githubRouter from './routes/github.router.js';
import passportConfig from './utilidades/passport-config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_ATLAS;
const secret = process.env.COOKIE_SECRET;
const passport = passportConfig;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// Configuración del motor de vistas Handlebars
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/user', UserRouter);
app.use(cookieParser(secret));

// Configuración de sesión
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

// Middleware para mensajes flash
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Ruta de prueba de sesión
app.get('/session', (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Has ingresado al sitio ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send('¡Bienvenido!');
  }
});

// Rutas para productos, mensajes, cookies, usuarios y autenticación con GitHub
app.use('/products', productsRouter);
app.use('/messages', messagesRouter);
app.use('/cookies', cookiesRouter);
app.use('/auth', githubRouter);
app.use('/user', UserRouter);

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

server.on('error', (error) => {
  console.error(`Error en el servidor: ${error.message}`);
});

// Conexión a la base de datos
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  });



