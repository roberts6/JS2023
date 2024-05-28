import jwt from 'jsonwebtoken';

const handlePolicies = (policies) => (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log('Encabezado de autorización recibido:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ status: 'error', error: 'Acceso no autorizado. Token de autorización no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido y separado del encabezado:', token);

    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
        console.log('Usuario verificado:', user);
    } catch (error) {
        return res.status(401).send({ status: 'error', error: 'Token inválido. Acceso no autorizado.' });
    }

    if (!user.role || !policies.includes(user.role.toLowerCase())) {
        return res.status(403).send({ status: 'error', error: 'No autorizado. Rol no permitido.' });
    }

    req.user = user;
    next();
};

export default handlePolicies;


