const express = require('express');
const librosController = require('./controller/librosController');
const usersController = require('./controller/usersController');
const authenticateJWT = require('./authMiddleware')

const router = express.Router();

//* Ruta para registrar usuario
router.post('/users', async(req, res) => {
    usersController.create(req, res);
})

//* Ruta para solicitar token de autenticación
router.post('/get-token', async(req, res) => {
    if(Object.keys(req.query).length > 0){
        var request = req.query;
    } else if(Object.keys(req.body).length > 0){
        var request = req.body;
    }

    const {email, api_key} = request;

    try {
        const result = await usersController.authenticate(email, api_key);

        res.json(result)
    } catch (error) {
        res.status(401).json({error: error.message})
    }
})

//* Rutas para CRUD de libros, rutas protegidas por un token
router.get('/libros', authenticateJWT, async(req, res) => {
    librosController.list(req, res)
})

router.get('/libros/:id', authenticateJWT, async(req, res) => {
    librosController.show(req, res)
})

router.post('/libros', authenticateJWT, async(req, res) => {
    librosController.create(req, res)
})

router.put('/libros/:id', authenticateJWT, async(req, res) => {
    librosController.update(req, res)
})

router.delete('/libros/:id', authenticateJWT, async(req, res) => {
    librosController.delete(req, res)
})

//* Rutas para el manejo de sesión
router.get('/login', async(req, res) => {
    usersController.token_login(req, res);
})

router.post('/login', async(req, res) => {
    usersController.login(req, res);
})

router.post('/agregarSaldo', async(req, res) => {
    usersController.actualizarSaldo(req, res)
})

router.post('/logout', async(req, res) => {
    usersController.logout(req, res);
})

module.exports = router;