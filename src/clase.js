class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, image, code, stock) {
        // Valida campos obligatorios
        if (!title || !description || !price || !image || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        // Valida que el código no se repita
        if (this.products.some(product => product.code === code)) {
            console.error("El código ya existe. Por favor, elija otro.");
            return;
        }

        // Agregar producto con id autoincrementable
        const newProduct = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            image,
            code,
            stock,
        };

        this.products.push(newProduct);
        console.log(`Producto agregado: ${title}`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
    
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
            return null;  
        }
    }
}

// Ejemplo
const productManager = new ProductManager();

productManager.addProduct("Zapatillas", "Zapatillas Jordan Air 1", 149000.99, "https://www.nike.com.ar/air-jordan-1-mid-dq8426-400/p", "123", 50);
productManager.addProduct("Zapatillas", "Zapatillas Jordan Air 1", 149000.99, "https://www.nike.com.ar/air-jordan-1-mid-dq8426-400/p", "123", 50); // repetido
productManager.addProduct("Camiseta", "Camiseta de algodón", 26.499, "https://www.moov.com.ar/remera-jordan-brand-graphic-ss-hombre/NIDV8414-100.html", "456", 100);

console.log("Productos:", productManager.getProducts());

const product1 = productManager.getProductById(1);
console.log("Producto con ID 1:", product1 ? product1.title : "");
const product3 = productManager.getProductById(3);
console.log("Producto con ID 3:", product3 ? product3.title : "");