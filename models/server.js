const express = require('express');
const cors = require('cors');

class Server {
    // me creo el app aqui
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // ruta
        this.usuariosPath = '/api/usuarios';

        // Middlewares (funciones que aniaden mas funcionalidades)
        this.middlewares();

        // llamo a las rutas de mi aplicacion
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json()); // convierte en json

        // directorio publico
        this.app.use(express.static('public'));
    }

    // defino las rutas
    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
