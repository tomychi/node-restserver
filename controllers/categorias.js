const { request, response } = require('express');

const { Categoria } = require('../models');

// obtener categorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }; // para q me filtre solo los estados en truue

    // all ejecuta de forma simultanea ambas
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.json({
        total,
        categorias,
    });
};

// obtener categoria  - populate {}
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate(
        'usuario',
        'nombre'
    );

    res.json(categoria);
};

// cear categoria
const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`,
        });
    }

    // generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
};

// actualizar categoria
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    // para q no puedan actualizar el estado y usuario
    const { estado, usuario, ...data } = req.body;

    // nombre del producto
    data.nombre = data.nombre.toUpperCase();

    // id duenio de la categoria
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {
        new: true,
    });

    res.json(categoria);
};

// borrar categoria - estado: false

const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.json(categoriaBorrada);
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
};
