// prueba fallida para renderizar en render.html

document.addEventListener('DOMContentLoaded', function() {
    fetch('/products')
      .then(response => {
        if (response.ok) {
          return response.json(); 
        }
        throw new Error('error en el fetch');
      })
      .then(data => {
        const products = data.payload; 
        const productListElement = document.getElementById('product-list');
  
        products.forEach(product => {
          const listItem = document.createElement('li');
          listItem.textContent = `${product.title} - $${product.price}`;
          productListElement.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Hubo un error!', error);
      });
  });
  