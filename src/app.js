import express from 'express';
import productsRouter from './routes/products.router';
import cartsRouter from './routes/carts.router';

const app = express();
const port = 5500;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export {};
