import { Router } from "express";
import { productModel } from "../models/products.model";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();
    const response = {
      message: "Lista de productos",
      data: products.length > 0 ? products : "No hay productos",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de productos" });
  }
});

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

export default router;
