import express from 'express';
import { readFile, writeFile, generateId } from '../utils/fileUtils';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const data = await readFile('productos.json');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const data = await readFile('productos.json');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id.toString() === productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

productsRouter.post('/', async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {
    id: generateId(),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  try {
    const data = await readFile('productos.json');
    const products = JSON.parse(data);
    products.push(newProduct);
    await writeFile('productos.json', JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar un nuevo producto' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  try {
    const data = await readFile('productos.json');
    let products = JSON.parse(data);
    const index = products.findIndex((p) => p.id.toString() === productId);

    if (index !== -1) {
      updatedProduct.id = productId;
      products[index] = updatedProduct;
      await writeFile('productos.json', JSON.stringify(products, null, 2));
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const data = await readFile('productos.json');
    let products = JSON.parse(data);
    products = products.filter((p) => p.id.toString() !== productId);
    await writeFile('productos.json', JSON.stringify(products, null, 2));
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default productsRouter;

