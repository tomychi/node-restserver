const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');
const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
    // ver si es un id de mongo
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            // si no existe el usuario regreso vacio
            results: usuario ? [usuario] : [],
        });
    }

    const regexp = new RegExp(termino, 'i');

    const [usuarios, total] = await Promise.all([
        Usuario.find({
            $or: [{ nombre: regexp }, { correo: regexp }],
            $and: [{ estado: true }],
        }),
        Usuario.count({
            $or: [{ nombre: regexp }, { correo: regexp }],
            $and: [{ estado: true }],
        }),
    ]);

    res.json({
        total,
        results: usuarios,
    });
};

const buscarCategorias = async (termino = '', res = response) => {
    // ver si es un id de mongo
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            // si no existe el usuario regreso vacio
            results: categoria ? [categoria] : [],
        });
    }

    const regexp = new RegExp(termino, 'i');

    const [categorias, total] = await Promise.all([
        Categoria.find({ nombre: regexp, estado: true }),
        Categoria.count({ nombre: regexp, estado: true }),
    ]);

    res.json({
        total,
        results: categorias,
    });
};

const buscarProductos = async (termino = '', res = response) => {
    // ver si es un id de mongo
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate(
            'categoria',
            'nombre'
        );
        return res.json({
            // si no existe el usuario regreso vacio
            results: producto ? [producto] : [],
        });
    }

    const regexp = new RegExp(termino, 'i');

    const [productos, total] = await Promise.all([
        Producto.find({ nombre: regexp, estado: true }).populate(
            'categoria',
            'nombre'
        ),
        Producto.count({ nombre: regexp, estado: true }),
    ]);

    res.json({
        total,
        results: productos,
    });
};

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta opcion',
            });
    }
};

module.exports = {
    buscar,
};
