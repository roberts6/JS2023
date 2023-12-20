import express from 'express';
import { readFile, writeFile, generateId } from '../utils/fileUtils';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  const newCart = {
    id: generateId(),
    products: [],
  };

  try {
    const data = await readFile('carrito.json');
    let carts = JSON.parse(data);
    carts.push(newCart);
    await writeFile('carrito.json', JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear un nuevo carrito' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const data = await readFile('carrito.json');
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id.toString() === cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const data = await readFile('carrito.json');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((c) => c.id.toString() === cartId);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product.id.toString() === productId
      );

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        carts[cartIndex].products.push({
          product: { id: productId },
          quantity: 1,
        });
      }

      await writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json({ message: 'Producto agregado al carrito exitosamente' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default cartsRouter;

