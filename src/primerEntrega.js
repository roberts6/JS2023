import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises'

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// ruta de productos
const productsRouter = express.Router();
app.use('/api/products', productsRouter);

// ruta de carrito
const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

// Manejo de productos
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
      // Mantener el mismo ID
      updatedProduct.id = productId;
      products[index] = updatedProduct;
      await writeFile('productos.json', JSON.stringify(products, null, 2));
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'UPS!, hay un problema al actualizar el producto' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const data = await readFile('productos.json');
    let products = JSON.parse(data);
    products = products.filter((p) => p.id.toString() !== productId);
    await writeFile('productos.json', JSON.stringify(products, null, 2));
    res.json({ message: 'Producto eliminado exitosamente 🥳' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Manejo de carritos
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
    res.status(500).json({ error: 'Error !! no veo nada en tu carrito 😢' });
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
        // como el producto ya existe le suma 1
        carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        // Agrega el producto al carrito
        carts[cartIndex].products.push({
          product: { id: productId },
          quantity: 1,
        });
      }

      await writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json({ message: 'Producto agregado al carrito exitosamente 🥳' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// Función para generar IDs únicos
function generateId() {
  return Math.floor(Math.random() * 1000000).toString();
}

// Funciones auxiliares para leer y escribir en archivos
async function readFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf-8');
    return data.trim() === '' ? '[]' : data;
  } catch (error) {
    // Si el archivo no existe, devolver un array vacío
    return '[]';
  }
}

async function writeFile(filename, data) {
  await fs.writeFile(filename, data, 'utf-8');
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
