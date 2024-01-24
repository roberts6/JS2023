import express from 'express';
import { readFile, writeFile, generateId } from '../utils/fileUtils';

const cartsRouter = express.Router();

// DELETE api/carts/:cid/products/:pid
// Elimina un producto específico del carrito
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const data = await readFile('carrito.json');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((cart) => cart.id.toString() === cid);

    if (cartIndex !== -1) {
      const newProducts = carts[cartIndex].products.filter((product) => product.product.id.toString() !== pid);
      carts[cartIndex].products = newProducts;
      
      await writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json({ message: 'Producto eliminado del carrito exitosamente' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// PUT api/carts/:cid
// Actualiza el carrito completo
cartsRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const updatedCartProducts = req.body.products;

  try {
    const data = await readFile('carrito.json');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((cart) => cart.id.toString() === cid);

    if (updatedCartProducts && cartIndex !== -1) {
      carts[cartIndex].products = updatedCartProducts;

      await writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json({ message: 'Carrito actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

// PUT api/carts/:cid/products/:pid
// Actualiza solo la cantidad del producto seleccionado en el carrito
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const newQuantity = req.body.quantity;

  if (!Number.isInteger(newQuantity) || newQuantity < 0) {
    return res.status(400).send({ error: "La cantidad debe ser un número entero positivo." });
  }

  try {
    const data = await readFile('carrito.json');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((cart) => cart.id.toString() === cid);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex((product) => product.product.id.toString() === pid);

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity = newQuantity;
        await writeFile('carrito.json', JSON.stringify(carts, null, 2));
        res.json({ message: 'Cantidad del producto actualizada exitosamente' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

// DELETE api/carts/:cid
// Elimina todos los productos del carrito
cartsRouter.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const data = await readFile('carrito.json');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((cart) => cart.id.toString() === cid);

    if (cartIndex !== -1) {
      carts[cartIndex].products = [];

      await writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json({ message: 'Todos los productos han sido eliminados del carrito exitosamente' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
  }
});


export default cartsRouter;

