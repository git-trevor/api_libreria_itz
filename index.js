const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');
const { SwaggerTheme } = require('swagger-themes');

require('./db');

const routes = require('./routes')
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}))
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//* Limitar las conexiones por tiempo determinado
const limiter = rateLimit({
    windowMs: 1*60*100, //* Esto es 1 minuto
    max: 50,             //* Limitamos el número de solicitudes
    message: 'Has realizado el límite permitido de solicitudes, por favor espera 1 minuto',
})

app.use(limiter);

//* Hacemos parse a formato json todas las solicitudes y limitamos el tamaño de las solicitudes
app.use(bodyParser.json({limit:'50kb'}));

//* Rutas para CRUD de libros
app.use(routes)

//* Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Servicio REST de Libros ITZ',
            description: 'API REST para administrar libros',
            version: '1.0.0',
            contact: {
                name: 'Daniel Guerrero',
                email: "daniel.guerrero@outlook.com",
                url: 'https://google.com.mx'
            },
            termsOfService: 'https://google.com.mx'
        },
        tags: {
            name: "Libros",
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'Añade tu token de seguridad en la cabecera de la solicitud'
            }
        }
    },
    apis: ['doc.js'],
}

//* Iniciamos la documentación de nuestro servicio
const swaggerSpec = swaggerJSDoc(swaggerOptions)

//* Configuramos nuestro tema Swagger
const theme = new SwaggerTheme();

const options = {
    explorer: true,
    customCss: theme.getBuffer('muted')
};

app.use('/libreria-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

//* Exportamos la aplicación para poder ser utilizada en otros archivos
module.exports = app;

//* Iniciamos el servidor
// app.listen(port, () => {
//     console.log('Servidor escuchando en el puerto: ' + port);
// })