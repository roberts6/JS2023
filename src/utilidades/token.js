import Jwt from "jsonwebtoken";

const PRIVATE_KEY = 'CoderKey';


export const generateToken = ({ _id, name, email, role }) => {
    const token = Jwt.sign({ sub: _id,name, email, role }, PRIVATE_KEY, { expiresIn: '24h' });
    return token
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'No estás autenticado' });
    }
    const token = authHeader.split(' ')[1];
    Jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
        if (error) {
            return res.status(403).send({ error: 'No estás autorizado - ' + error.message });  // Proporciona el mensaje de error para diagnóstico
        }
        req.user = decoded;
        next();
    });
};
