const User = require('../models/users');
var Users = require('../models/users')
const jwt = require('jsonwebtoken');

const blacklistedTokens = new Set();

//* Función para crear usuarios
exports.create = async function(req, res){
    //* Código para validar si se usa el body o el query
    if(Object.keys(req.query).length > 0){
        var request = req.query;
    } else if(Object.keys(req.body).length > 0){
        var request = req.body;
    }

    //* Validar campos obligatorios
    if(!request.email || !request.password){
        return res.status(400).json({message:'Los campos de email y password son obligatorios'})
    }

    try {
        //* Verificar si el email ya existe en la base de datos
        const existingUser = await Users.findOne({email: request.email});

        if(existingUser){
            return res.status(400).json({message:'El email ya esta registrado en la base de datos'})
        }

        //* Procedemos a guardar el usuario
        const user = new Users(request);
        await user.save();

        return res.json({user, mensaje: 'Usuario guardado correctamente'});
    } catch (error) {
        return res.status(500).json({
            message: 'Error al guardar el libro',
            error: error.message
        })
    }
}

exports.authenticate = async function(email, api_key){
    try {
        //* Buscar el usuario por email y api_key
        const user = await Users.findOne({email: email, api_key: api_key});

        if(!user){
            return {message:'El email y/o la api_key no se encuentran en la base de datos'}
        }

        if(user.saldo <= 0){
            return {message:'Su saldo se ha agotado, favor de realizar una recarga'}
        }

        //* Si el usuario es válido y tiene saldo, le generamos un token
        const token = jwt.sign({email, api_key}, 'midna', {expiresIn: '1h'})

        return {token, message: 'Token generado con éxito, será válido por una hora'}
    } catch (error) {
        return {message: 'Error en la autenticación: ' + error.message}
    }
}

exports.actualizaSaldoUsuario = async function(req){
    try {
        const token = req.header('Authorization')
        const decodedToken = jwt.verify(token, 'midna')

        console.log(decodedToken);

        //* Obtener el id del usuario por medio de su api_key
        const user = await Users.findOne({api_key: decodedToken.api_key})

        //* Verificar si el usuario existe
        if(!user){
            console.log('Usuario no encontrado');
            return;
        }

        user.saldo = user.saldo - 1;
        await user.save();

        console.log('Saldo actualizado a -1 para el usuario api_key:' + decodedToken.api_key);
    } catch (error) {
        console.log('Error al actualizar el saldo del usuario api_key: ' + decodedToken.api_key + ". Error: " + error.message);
    }
}

exports.validaSaldoUsuario = async function(req){
    try{
        const token = req.header('Authorization')
        const decodedToken = jwt.verify(token, 'midna')
    
        //* Obtener el id del usuario por medio de su api_key
        const user = await Users.findOne({api_key: decodedToken.api_key})

        if(!user){
            return false;
        }

        if(user.saldo > 0){
            return true;
        } else{
            return false;
        }
    } catch(error){
        return {error: error.message}
    }
}

exports.token_login = async function(req, res){
    try {
        const secretKey = 'midna'
        const tokenContent = {description: 'token_para_login'}
        const token = jwt.sign(tokenContent, secretKey, {expiresIn: '1h'});

        res.render('login', {csrfToken: token, message: null});
    } catch (error) {
        res.render('login', {csrfToken: null, message: error.message});
    }
}

exports.login = async function(req, res){
    try {
        const token = req.body._csrf;

        if(blacklistedTokens.has(token)){
            res.render('login', {csrfToken: token, message: 'El token ha expirado'})
        }

        if(!token){
            const secretKey = 'midna'
            const tokenContent = {description: 'token_para_login'}
            const token = jwt.sign(tokenContent, secretKey, {expiresIn: '1h'});

            res.render('login', {csrfToken: token, message: 'El token es requerido'});
        }

        const decodedToken = jwt.verify(token, 'midna');

        if(decodedToken){
            //* Verificamos le email y contraseña
            const user = await Users.findOne({email:req.body.email, password:req.body.password})

            if(!user){
                res.render('login', {csrfToken: token, message: 'El email o password no coinciden'});
            } else{
                res.render('welcome', {email: user.email, api_key: user.api_key, saldo: user.saldo, token: token, message: null})
            }
        } else{
            const secretKey = 'midna'
            const tokenContent = {description: 'token_para_login'}
            const token = jwt.sign(tokenContent, secretKey, {expiresIn: '1h'});

            res.render('login', {csrfToken: token, message: 'El token no es válido'});
        }
    } catch (error) {
        res.render('login', {csrfToken: null, message: error.message});
    }
}

exports.actualizarSaldo = async function(req, res){
    try {
        const token = req.body._csrf;

        if(blacklistedTokens.has(token)){
            res.render('login', {csrfToken: token, message: 'El token ha expirado'})
        }

        const decodedToken = jwt.verify(token, 'midna');

        if(decodedToken){
            const user = await User.findOne({api_key: req.body.api_key, email: req.body.email})

            if(user){
                user.saldo = req.body.nuevoSaldo;

                await user.save();

                res.render('welcome', {email: user.email, api_key: user.api_key, saldo: user.saldo, token: token, message: 'Saldo actualizado correctamente'})
            } else{
                res.render('welcome', {email: req.body.email, api_key: req.body.api_key, saldo: req.body.saldo, token: token, message: 'Saldo no actualizado, usuario no encontrado'})
            }
        } else{
            res.render('welcome', {email: req.body.email, api_key: req.body.api_key, saldo: req.body.saldo, token: token, message: 'Token no valido'})

        }
    } catch (error) {
        res.render('welcome', {email: req.body.email, api_key: req.body.api_key, saldo: req.body.saldo, token: token, message: error.message})
    }
}

exports.logout = async function(req, res){
    try {
        const token = req.body._token;
        blacklistedTokens.add(token);

        const secretKey = 'midna'
        const tokenContent = {description: 'token_para_login'};
        const csrfToken = jwt.sign(tokenContent, secretKey, {expiresIn: '1h'});

        res.render('login', {csrfToken: csrfToken, message: 'Sesión cerrada correctamente'});
        
    } catch (error) {
        res.render('login', {csrfToken: null, message: error.menssage});
    }
}