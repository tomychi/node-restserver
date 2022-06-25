const { response, request } = require('express'); // para que me muestre las ayudas

const usuariosGEt = (req = request, res = response) => {
    const { q, nombre = 'No name', apiKey, page = 1, limit } = req.query;

    res.json({
        // ok: true,
        msg: 'get API - controlador',
        q,
        nombre,
        apiKey,
        page,
        limit,
    });
};

const usuariosPost = (req, res = response) => {
    // req lo q solicita el usuario
    const { nombre, edad } = req.body;

    res.status(201).json({
        // ok: true,
        msg: 'post API - controlador',
        nombre,
        edad,
    });
};

const usuariosPut = (req, res = response) => {
    const { id } = req.params;

    res.status(400).json({
        // ok: true,
        msg: 'put API - controlador',
        id,
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        // ok: true,
        msg: 'patch API - controlador',
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        // ok: true,
        msg: 'delete API - controlador',
    });
};

module.exports = {
    usuariosGEt,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
