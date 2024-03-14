var Libros = require('../models/libros')
const usersController = require('./usersController')

//* CRUD de operaciones

//* Función para crear libros
exports.create = async function(req, res){
    //! Código para validar si se usa el body o el query
    // if(Object.keys(req.query).length > 0){
    //     var request = req.query;
    // } else if(Object.keys(req.body).length > 0){
    //     var request = req.body;
    // }

    try{
        const saldo = await usersController.validaSaldoUsuario(req);

        if(!saldo){
            return res.status(403).json({message:'Usuario sin saldo suficiente para procesar la petición'})
        }

        var libro = new Libros(req.body);

        await libro.save();
        await usersController.actualizaSaldoUsuario(req);

        return res.json({libro, mensaje: 'Libro guardado correctamente'});
    } catch(error){
        return res.status(500).json({
            message: 'Error al guardar el libro',
            error: error
        })
    }
}

//* Función para listar todos los libros
exports.list = async function(req, res){
    try {
        const saldo = await usersController.validaSaldoUsuario(req);

        if(!saldo){
            return res.status(403).json({message:'Usuario sin saldo suficiente para procesar la petición'})
        }

        const libros = await Libros.find();
        await usersController.actualizaSaldoUsuario(req);

        return res.json(libros)
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener todos los libros',
            error: error.message
        })
    }
}

//* Función para actualizar los libros
exports.update = async function(req, res){
    try{
        const saldo = await usersController.validaSaldoUsuario(req);

        if(!saldo){
            return res.status(403).json({message:'Usuario sin saldo suficiente para procesar la petición'})
        }

        libroAct = await Libros.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if (!libroAct){
            return res.status(404).json({error: 'Libro no encontrado'})
        } else{
            await usersController.actualizaSaldoUsuario(req);
            return res.status(200).json({libroAct, msj: 'Libro actualizado correctamente'})
        }
    } catch(err){
        return res.status(500).json({
            message: 'Error al actualizar libro',
            error: err
        })
    }
}

//* Función para eliminar libros
exports.delete = async function(req, res){
    try{
        const saldo = await usersController.validaSaldoUsuario(req);

        if(!saldo){
            return res.status(403).json({message:'Usuario sin saldo suficiente para procesar la petición'})
        }

        const eliminarLibro = await Libros.findByIdAndDelete(req.params.id);

        if(!eliminarLibro){
            return res.status(404).json({error: 'Libro no encontrado'})
        } else{
            await usersController.actualizaSaldoUsuario(req);
            return res.status(202).json({msj: 'Libro eliminado'})
        }
    } catch(err){
        return res.status(500).json({
            message: 'Error al eliminar libro',
            error: err
        })
    }
}

//* Función para listar un libro por id
exports.show = async function(req, res){
    try{
        const saldo = await usersController.validaSaldoUsuario(req);

        if(!saldo){
            return res.status(403).json({message:'Usuario sin saldo suficiente para procesar la petición'})
        }

        const libro = await Libros.findById(req.params.id);

        if(!libro){
            return res.status(404).json({error: 'Libro no encontrado'})
        } else{
            await usersController.actualizaSaldoUsuario(req);
            return res.status(200).json(libro)
        }
    } catch(err){
        return res.status(500).json({
            message: 'Error al mostrar el libro',
            error: err
        })
    }
}