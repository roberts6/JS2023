//const express = require('express');
import express from "express";
// const fs = require('fs');
import fs from 'fs'
//const ProductManager = require('./persistencia.js'); 
import {ProductManager} from "../persistencia.js";

const app = express();
const port = 5500;

const productManager = new ProductManager('productos.json'); 

app.use(express.json());

// Endpoint para obtener todos los productos con límite opcional
app.get('/products', (req, res) => {
  const { limit } = req.query;
  const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
  res.json({ products });
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


export {}