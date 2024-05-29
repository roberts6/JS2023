import express from 'express';
import { readFile, writeFile, generateId } from '../utils/fileUtils';
import handlePolicies from '../middleware/handlePolicies.js';
import nodemailer from 'nodemailer';
import Product from '../models/products.model.js';
import User from '../models/user.model.js';

const productsRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_GMAIL,
    pass: process.env.PASS_GMAIL
  }
});

// Protege esta ruta solo para usuarios con roles 'user' y 'admin'
productsRouter.get('/', handlePolicies(['user', 'admin']), async (req, res) => {
  try {
    const data = await readFile('productos.json');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

// Protege esta ruta solo para usuarios con roles 'user' y 'admin'
productsRouter.get('/:pid', handlePolicies(['user', 'admin']), async (req, res) => {
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

// Proteger esta ruta solo para usuarios con roles 'admin'
productsRouter.post('/', handlePolicies(['admin']), async (req, res) => {
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

// Proteger esta ruta solo para usuarios con roles 'admin'
productsRouter.put('/:pid', handlePolicies(['admin']), async (req, res) => {
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

// Proteger esta ruta solo para usuarios con roles 'admin'
productsRouter.delete('/:pid', handlePolicies(['admin']), async (req, res) => {
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

productsRouter.delete('/:pid', handlePolicies(['admin']), async (req, res) => {
  const productId = req.params.pid;

  try {
    const data = await readFile('productos.json');
    let products = JSON.parse(data);
    const product = products.find((p) => p.id.toString() === productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const user = await User.findById(product.owner);

    products = products.filter((p) => p.id.toString() !== productId);
    await writeFile('productos.json', JSON.stringify(products, null, 2));

    if (user && user.role === 'premium') {
      const mailOptions = {
        from: process.env.USER_GMAIL,
        to: user.email,
        subject: 'Producto eliminado',
        text: `Hola ${user.name}, tu producto con ID ${product._id} ha sido eliminado.`
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    logger.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


export default productsRouter;
