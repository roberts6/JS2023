import { faker } from '@faker-js/faker/locale/es';



export const generateProducts = () => {
  const products = []; // Inicializa un arreglo vacío para almacenar los productos

  for (let i = 0; i < 100; i++) { // Ciclo para generar 100 productos
    const product = {
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      color: faker.internet.color(),
      thumbnail: faker.image.avatar(), // no encuentro uno adecuado para imagen de productos
      code: faker.commerce.isbn()
    };

    products.push(product); // Añade el producto generado al arreglo de productos
  }

  return products; // Retorna el arreglo de productos generados
};

