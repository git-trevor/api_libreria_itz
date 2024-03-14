var mongoose = require('mongoose');
var Schema = mongoose.Schema

//* Función para generar una cadena aleatoria alfanumérica
const generaApiKey = () => {
    const characters = "qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑZXCVBNM0123456789"
    let apiKey = ''

    for(let i = 0; i < 15; i++){
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return apiKey;
}

//* Definimos esquema de los usuarios
const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    api_key: {
        type: String,
        require: true,
        unique: true,
        default: generaApiKey,
    },
    saldo: {
        type: Number,
        default: 5
    },
})

//* Middleware para generar la api_key antes de guardar un nuevo usuario
userSchema.pre('save', function(next){
    if(!this.api_key){
        this.api_key = generaApiKey();
    }

    next();
})

//* Definimos el modelo del usuario
const User = mongoose.model('User', userSchema)

module.exports = User;