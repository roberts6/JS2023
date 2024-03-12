import jwt from 'jsonwebtoken';

const handlePolicies = policies => (req, res, next) => {
    if (policies[0].toUpperCase() === 'PUBLIC') return next();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) return res.status(401).send({ status: 'error', error: 'sin autorización' });
    const token = authHeaders.split(' ')[1]; // se remueve el 'Bearer'

    let user = verify(token, 'CoderKey');

    // ¿Existe el rol?
    if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ error: 'no existe ese rol para usuario' });
    
    req.user = user;
    next();
}

export default handlePolicies;
