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
import bcrypt from 'bcrypt'; // encripta la info antes de almacenarla
import productsRouter from './routes/productsModel.router.js';
import messagesRouter from './routes/messagesModel.router.js';
import User from './routes/userModel.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 
const DB_URL = process.env.DB_URL; 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(User); 

// rutas para productos
app.get('/products', productsRouter);
app.get('/products/:id', productsRouter);
app.post('/products', productsRouter);
app.put('/products/:id', productsRouter);
app.delete('/products/:id', productsRouter);

// rutas para mensajes
app.get('/messages', messagesRouter);
app.get('/messages/:id', messagesRouter);
app.post('/messages', messagesRouter);
app.put('/messages/:id', messagesRouter);
app.delete('/messages/:id', messagesRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

server.on('error', (error) => console.error(`Error en el servidor: ${error.message}`));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Base de datos conectada');
})
.catch((error) => {
  console.error('Error al conectarse a la base de datos:', error);
});
