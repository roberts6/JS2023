import { Router } from "express";
import { productModel } from "../models/products.model.js";

const router = Router();

// devuelve todos los productos
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();
    const response = {
      message: "Lista de productos",
      data: products.length > 0 ? products : "No hay productos",
    };
    res.json(response);
    console.log("esta es la respuesta: ",response)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de productos" });
  }});
//   try {
//     const { limit = 10, page = 1, sort } = req.query;

//     // objeto con filtros
//     const filter = {};

//     if (req.query.filter) {
//       Object.entries(req.query.filter).forEach(([key, value]) => {
//         filter[key] = value;
//       });
//     }

//     const sortObj = {};

//     if (sort === 'asc') {
//       sortObj.price = 1;
//     } else if (sort === 'desc') {
//       sortObj.price = -1;
//     }

//     const totalCount = await productModel.countDocuments(filter);

//     // calcula total de páginas
//     const totalPages = Math.ceil(totalCount / limit);

//     const skip = (page - 1) * limit;

//     const products = await productModel.find(filter)
//       .sort(sortObj)
//       .limit(limit)
//       .skip(skip);

//     // calcula si existe una página anterior
//     const hasPrevPage = page > 1;

//     // calcula si existe una página siguiente
//     const hasNextPage = page < totalPages;

//     // calcula la página anterior
//     const prevPage = hasPrevPage ? page - 1 : null;

//     // calcula la página siguiente
//     const nextPage = hasNextPage ? page + 1 : null;

//     // prevLink y nextLink
//     const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}` : null;
//     const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}` : null;

//     // respuesta
//     const responseObject = {
//       status: 'success',
//       payload: products,
//       totalPages: totalPages,
//       prevPage: prevPage,
//       nextPage: nextPage,
//       page: page,
//       hasPrevPage: hasPrevPage,
//       hasNextPage: hasNextPage,
//       prevLink: prevLink,
//       nextLink: nextLink
//     };

//     res.status(200).json(responseObject);
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// });

// producto buscado por id
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const response = {
      message: "Producto encontrado",
      data: product,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// genera un nuevo producto
router.post("/products", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const newProduct = new productModel({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    await newProduct.save();
    const response = {
      message: "Producto creado",
      data: newProduct,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// actualiza un producto por id
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const response = {
      message: "Producto actualizado",
      data: updatedProduct,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// borra un producto por su id
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const response = {
      message: "Producto eliminado",
      data: deletedProduct,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
