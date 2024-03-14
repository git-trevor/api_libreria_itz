const http = require('http');
const httpProxy = require('http-proxy');

//* Definimos una variable con las direcciones de las instancias de nuestra aplicación
const appServers = [
    {host: 'localhost', port: 3001},
    // {host: 'localhost', port: 3002},
    // {host: 'localhost', port: 3003},
    // {host: 'localhost', port: 3004},
    // {host: 'localhost', port: 3005},
    // {host: 'localhost', port: 3006},
    // {host: 'localhost', port: 3007},
    // {host: 'localhost', port: 3008},
    // {host: 'localhost', port: 3009},
    // {host: 'localhost', port: 3010},
]

//* Crear un proxy
const proxy = httpProxy.createProxyServer({});

//* Función para comprobar el estado del servidor
function comprobarEstado(server){
    return new Promise((resolve, reject) => {
        http.get('http://' + server.host + ':' + server.port, (res) => {
            if(res.statusCode === 200){
                resolve();
            } else{
                reject();
            }
        }).on('error', (err) => {
            reject(err);
        })
    })
}

//* Crear un comprobar de estado, por medio de una función para eliminar una instancia de aplicación que no este respondiendo
function eliminarInstancia(){
    appServers.forEach((server, index) => {
        comprobarEstado(server).then(() => {
            console.log('Servidor ' + server.host + ':' + server.port + ' en ejecución');
        })
        .catch(() => {
            console.log('Eliminando el servidor ' + server.host + ':' + server.port);
            appServers.splice(index, 1)
        })
    })
}

//* Comprobar el estado de las instancias por cada cierto intervalo de tiempo
const intervalo = 5000; //* 5 segundos

setInterval(eliminarInstancia, intervalo)

//* Crear el servidor para balancear la carga
const server = http.createServer((req, res) => {
    //* Establecemos la regla para el balanceo de carga y redirigir a la aplicación
    //* Elige aleatoriamente
    const target = appServers[Math.floor(Math.random() * appServers.length)];

    //* Redirigimos la solicitud al servidor destino
    proxy.web(req, res, {
        target: 'http://' + target.host + ':' + target.port
    });
})

//* Manejo de errores del proxy
proxy.on('error', (err, req, res) => {
    console.log('Proxy error: ' + err);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Proxy error')
})

//* Iniciamos el servidor balanceador de carga en el puerto 8000
const port = 8000;

server.listen(port, () => {
    console.log('Balanceador de carga escuchando en el puerto: ' + port);
})