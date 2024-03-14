var mongoose = require('mongoose');
// var MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/db_libreria'

var MONGO_URL = process.env.MONGO_URL || 'mongodb://trevor:N02M03D12@docdb-2024-03-14-23-26-01.cluster-c5qe8agegqzp.us-east-2.docdb.amazonaws.com:27017/db_libreria?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'

mongoose.connect(MONGO_URL);

mongoose.connection.on('connected', function(){
    console.log('Conectado a la base de datos ' + MONGO_URL);
})

mongoose.connection.on('error', function(err){
    console.log('Error al conectar con la base de datos: ' + err);
})

mongoose.connection.on('disconnected', function(){
    console.log('Desconectado de la base de datos');
})