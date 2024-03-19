export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades no están completas o no son válidas
    * nombre: necesita ser un string, se recibió ${user.name}
    * apellido: necesita ser un string, se recibió ${user.lastName}
    * email: necesita ser un string, se recibió ${user.email}
    * age: necesita ser un number, se recibió ${user.age}
    * 
    `
    }