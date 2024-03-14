const jwt = require('jsonwebtoken');

//* Middleware de autenticación utilizando Json Web Token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')

    if(!token) return res.status(401).json({error: 'Acceso no autorizado T-T'})

    jwt.verify(token, 'midna', (err, user) => {
        if(err) return res.status(403).json({error: 'Token inválido'})

        req.user = user;
        next()
    })
}

module.exports = authenticateJWT