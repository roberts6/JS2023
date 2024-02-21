// import express from 'express';
// import productsRouter from './routes/products.router';
// import cartsRouter from './routes/carts.router';
// import mongoose from 'mongoose'

// const app = express();
// const port = 5500;

// app.use(express.json());

// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });

// export {};

// import express from 'express'
// import mongoose from 'mongoose'

// const app = express();
// const PORT = 3000
// const DB_URL = 'mongodb+srv://Roberts6:BeniRoberts6@coderhouse-backend.daqwlwh.mongodb.net/' // URL para conectarse

// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

// app.get('/products', ( req, res ) => {
// res.send('Hola Mundo')
// })

// const server = app.listen(PORT, () => {
// console.log('servidor iniciado')
// })

// server.on('error', (error) => console.log('Error en el servidor'))

// mongoose.connect(DB_URL)
// .then(() => {
//   console.log('Base de datos conectada')
// })
// .catch((error) => {
//   console.log('Este es el error al conectarse a la BD', error)
// });

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productsRouter from './routes/productsModel.router.js';
import messagesRouter from './routes/messagesModel.router.js';
import User from './routes/userModel.router.js';
import passport from './utilidades/passport-config.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.router.js'
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 
const DB_URL = process.env.DB_ATLAS;
const secret = process.env.COOKIE_SECRET;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

app.use('/user',User); 

app.use(cookieParser(secret)); // de esta forma "firmo" la cookie, para saber si fue modificada o no

// autenticación con GitHub
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true, // mantiene la sesión activa
  saveUninitialized: true, // guarda cualquier sesión.
  cookie: {
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

app.use(passport.initialize());
app.use(passport.session());

//ruta para inicio de session
app.get('/session', (req,res) => {
if (req.session.counter) {
  req.session.counter++;
  res.send(`entraste al sitio ${req.session.counter} veces`)
} else {
  req.session.counter = 1;
  res.send('Bienvenido!')
}
})

// rutas para productos
app.use('/products', productsRouter);

// rutas para mensajes
app.use('/messages', messagesRouter);

// ruta para cookies
app.use('/cookies', cookiesRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

server.on('error', (error) => console.error(`Error en el servidor: ${error.message}`));

mongoose.connect(DB_URL)
.then(() => {
  console.log('Base de datos conectada');
})
.catch((error) => {
  console.error('Error al conectarse a la base de datos:', error);
  process.exit()
});

