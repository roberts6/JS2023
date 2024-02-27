import Jwt from "jsonwebtoken";

const PRIVATE_KEY = 'CoderKey';

export const generateToken = (user) => {
    const token = Jwt.sign({user},PRIVATE_KEY,{expiresIn:'24'})
    return token;
}

export const authToken = (req, res, next) => {
    //el token viene de los headers
const authHeader = req.headers.authorization;
if (!authHeader) {
    return res.status(401).send({
        error: 'No está autenticado'
    })
}
const token = authHeader.split(' ')[1]; // de esta forma se retira la palabra Bearer
Jwt.verify(token,PRIVATE_KEY, (error, credentials) => {
    if (error) {
    return res.status(403).send({error: 'No estás autorizado' });
    }
    req.user= credentials.user;
   next();
   });
}