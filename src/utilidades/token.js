import Jwt from "jsonwebtoken";

const PRIVATE_KEY = 'CoderKey';


export const generateToken = ({ _id, name, email, role }) => {
    const token = Jwt.sign({ sub: _id,name, email, role }, PRIVATE_KEY, { expiresIn: '24h' });
    return token
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ error: "Acceso no autorizado. Token de autorización no proporcionado." });
        }

        const token = authHeader.split(" ")[1];
        
        const decoded = verify(token, PRIVATE_KEY);

        // Verificar si decoded es un objeto
        if (typeof decoded !== "object" || !decoded.sub) {
            throw new Error("Token no contiene información válida.");
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).send({ error: "Acceso denegado. Token inválido." });
    }
};

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado. Token de autorización no proporcionado.' });
    }

    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Acceso no autorizado. Token inválido.' });
        }

        req.user = decoded; // Almacenar la información del usuario en el objeto de solicitud
        next();
    });
}