const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario q corresponde al uid
        const usuario = await Usuario.findById(uid);

        // usuario undefined
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe DB',
            });
        }

        // verificar si el uid tiene estado en true (no fue borrado)
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario borrado',
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido',
        });
    }
};

module.exports = {
    validarJWT,
};
