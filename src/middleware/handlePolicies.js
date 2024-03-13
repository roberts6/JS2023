import jwt from 'jsonwebtoken';

const handlePolicies = policies => (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ status: 'error', error: 'Acceso no autorizado. Token de autorización no proporcionado.' });
    }

    const token = authHeader.split(' ')[1]; // Eliminar 'Bearer' del token
    
    let user;
    try {
        user = verify(token, 'CoderKey');
    } catch (error) {
        return res.status(401).send({ status: 'error', error: 'Token inválido. Acceso no autorizado.' });
    }

    // Verificar si el rol del usuario está dentro de las políticas permitidas
    if (!policies.includes(user.role.toLowerCase())) {
        return res.status(403).send({ status: 'error', error: 'No autorizado. Rol no permitido.' });
    }

    req.user = user;
    next();
};

export default handlePolicies;
