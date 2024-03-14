const cluster = require('cluster');
const OS = require('os');
const app = require('./index');
const http = require('http');

//* Vamos a obtener el número de CPU's de nuestro equipo
const numCPUs = OS.cpus().length;
console.log(`Número de CPU's: ` + numCPUs);

const numWorkers = numCPUs; //* Definimos cuántas réplicas queremos

//* Definimos nuestro cluster maestro
if(cluster.isMaster){
    console.log('Cluster Maestro' + process.pid + ' esta en ejecución');

    //* Definimos el número de réplicas
    for(let i = 0; i < Math.min(numWorkers, numCPUs); i++){
        //* Limitamos el número de workers al mínimo entre el número deseado
        //* y el número de CPUs disponibles
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' ha fallado');
        //* Se renicia el worker en caso de que falle
        cluster.fork();
    })
} else{
    //* Código para iniciar la aplicación en cada worker
    const port = 3000 + cluster.worker.id;

    app.use('/', require('./prueba_rutas')(port))

    app.listen(port, ()=>{
        console.log('Servidor escuchando en el puerto ' + port);
        console.log('Worker iniciado con el pid: ' + process.pid);
        console.log('Worker ID: ' + cluster.worker.id);
    })
}