// visualizacion de mi modelo usuario
// {
//     nombre: 'asd',
//     correo: 'tomy@gmail.com',
//     password: '31541',
//     img: '213123121312',
//     rol: '2131231241',
//     estado: false,
//     google: false
// }

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'], // por si no se mande el nombre
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La password es obligatorio'], // por si no se mande el nombre
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'], // EL ROL TIENE Q SER ALGUNO DE ESOS
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

// metodos para sobreescribir un metodo
UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id; // cambio el _id por uid
    return usuario;
}; // para sacar el version y password

module.exports = model('Usuario', UsuarioSchema);
