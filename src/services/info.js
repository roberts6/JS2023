export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades no están completas o no son válidas
    * nombre: necesita ser un string, se recibió ${user.name}
    * apellido: necesita ser un string, se recibió ${user.lastName}
    * email: necesita ser un string, se recibió ${user.email}
    * age: necesita ser un number, se recibió ${user.age}
    `
    }


    export const generateProductErrorInfo = (product) => {
        return `Una o más propiedades no están completas o no son válidas
        * title: necesita ser un string, se recibió ${product.title}
        * code: necesita ser un string, se recibió ${product.code}
        * description: necesita ser un string, se recibió ${product.description}
        * stock: necesita ser un number, se recibió ${product.stock}
        * price: necesita ser un number, se recibió ${product.price}
        * thumbnail: necesita ser una url, se recibió ${product.thumbnail}
        `
        }