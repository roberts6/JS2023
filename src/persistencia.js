//const fs = require('fs');
import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo devuelvo un array vacío para evitar que se rompa.
            this.products = [];
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    addProduct(product) {
        // último id del array
        const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
      
        // Incrementa el último ID para obtener el nuevo ID del producto
        const newProductId = lastId + 1;
      
        // Verifica si el nuevo ID ya existe en la lista 
        //const isDuplicate = this.products.some(existingProduct => existingProduct.id === newProductId);

        // verifica si nombre y código están repetidos. Nombre podría ser ya que sería de otro proveedor, otro talle, etc pero mismo modelo
        const isDuplicate = this.products.some(
            (existingProduct) =>
              existingProduct.title === product.title && existingProduct.code === product.code
          );


        if (isDuplicate) {
          console.log('Producto duplicado. No se agregará.');
          return null; // sale de la ejecución
        }
      
        // Crea el nuevo producto con el nuevo ID
        const newProduct = {
          id: newProductId,
          ...product,
        };
      
        // Agrega el nuevo producto al array
        this.products.push(newProduct);
      
        // Guarda los productos actualizados
        this.saveProducts();
      
        // Devuelve el nuevo producto
        return newProduct;
      }
      
      

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            const updatedProduct = {
                ...this.products[index],
                ...updatedFields,
            };

            this.products[index] = updatedProduct;
            this.saveProducts();
            return updatedProduct;
        }

        return null; // producto no encontrado
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return true; // producto encontrado
        }

        return false; // producto no encontrado
    }
}

// Ejemplo de uso
const productManager = new ProductManager('productos.json');

// Añadir un producto
const newProduct = {
    title: 'Producto nuevo',
    description: 'Descripción del producto agregado',
    price: 111119.99,
    thumbnail: '#',
    code: 'ABC456',
    stock: 50,
};
productManager.addProduct(newProduct);

// Obtener todos los productos
const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

// Obtener un producto por ID
const productId = 1; // ID del producto a buscar
const foundProduct = productManager.getProductById(productId);
console.log(`Producto con ID ${productId}:`, foundProduct);

// Actualizar un producto
const updatedFields = {
    description: 'nueva descripción de las Air Jordan 1',
    price: 78924.99,
    stock: 40,
};
const updatedProduct = productManager.updateProduct(productId, updatedFields);
console.log(`Producto actualizado:`, updatedProduct);

// Eliminar un producto
const deleteSuccess = productManager.deleteProduct(productId);
console.log(`Eliminación exitosa:`, deleteSuccess);

// Obtener todos los productos después de la eliminación
const remainingProducts = productManager.getProducts();
console.log('Productos restantes:', remainingProducts);

// module.exports = ProductManager;

export {ProductManager}