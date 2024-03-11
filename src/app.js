import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productsRouter from './routes/productsModel.router.js';
import messagesRouter from './routes/messagesModel.router.js';
import userModelRouter from './routes/userModel.router.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.router.js';
import cors from 'cors';
import { engine } from 'express-handlebars';
import flash from 'connect-flash';
import githubRouter from './routes/github.router.js';
import passportConfig from './utilidades/passport-config.js';
import passport from 'passport';
import { generateToken} from './utilidades/token.js'
import { passportCall } from './utilidades/utilitys.js';
import authorization from './middleware/authentication.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_ATLAS;
const secret = process.env.COOKIE_SECRET;
passportConfig(passport);

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

// persistencia en memoria
const users = []
app.post('/registro', async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = users.find(user => user.email === email);
  
  if (exists) {
    return res.status(400).send({ status: 'error', error: 'Este usuario ya existe' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10); 
  
  const user = {
    name,
    email,
    password: hashedPassword,
    role
  };
  
  users.push(user);
  
  // no incluyo el password como parte del token
  const accessToken = generateToken({ email, role });
  
  res.send({ status: 'success', accessToken });
});


app.post('/login',(req,res) => {
const {email, password} = req.body;
const user = users.find(user=> user.email === email && user.password === password);
if (!user) {
  return res.status(400).send({status:'error', error: 'credenciales inválidas'})
}
const access_token = generateToken(user)
res.send({status:'success', access_token})
})

app.get('/current',passport.authenticate('jwt', { session: false }),authorization,(req,res)=>{
res.send({status:'success', payload:req.user})
})

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

app.get('/user-info', (req, res) => {
  if (req.user) {
      res.render('user-info', { name: req.user.name, email: req.user.email, role: req.user.role });
  } else {
      // Manejar el caso cuando req.user no está definido
      res.status(401).send('Usuario no autenticado');
  }
});

// Rutas para productos, mensajes, cookies, usuarios y autenticación con GitHub
app.use('/products', productsRouter);
app.use('/messages', messagesRouter);
app.use('/cookies', cookiesRouter);
app.use('/auth', githubRouter);
app.use('/user', userModelRouter);

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



