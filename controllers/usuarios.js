const { response, request } = require('express'); // para que me muestre las ayudas
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGEt = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }; // para q me filtre solo los estados en truue

    // all ejecuta de forma simultanea ambas
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    res.json({
        total,
        usuarios,
    });
};

const usuariosPost = async (req, res = response) => {
    // req lo q solicita el usuario
    const { nombre, correo, password, rol } = req.body;

    // creo una instancia
    const usuario = new Usuario({ nombre, correo, password, rol });

    // encriptar la password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // grabo en la db
    await usuario.save();

    res.status(201).json({
        usuario,
    });
};

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    // excluyo los datos q no quiero actualizar
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos

    if (password) {
        // encriptar la password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDb = await Usuario.findByIdAndUpdate(id, resto, {
        new: true,
    });

    res.json(usuarioDb);
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador',
    });
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    // fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json(usuario);
};

module.exports = {
    usuariosGEt,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
