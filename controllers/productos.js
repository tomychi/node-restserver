const { request, response } = require('express');

const { Producto } = require('../models');

// obtener categorias - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }; // para q me filtre solo los estados en truue

    // all ejecuta de forma simultanea ambas
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.json({
        total,
        productos,
    });
};

// obtener categoria  - populate {}
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
};

// cear categoria
const crearProducto = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`,
        });
    }

    // generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(201).json(producto);
};

// actualizar categoria
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    // para q no puedan actualizar el estado y usuario
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        // nombre del producto
        data.nombre = data.nombre.toUpperCase();
    }

    // id duenio del producto
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {
        new: true,
    });

    res.json(producto);
};

// borrar categoria - estado: false

const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.json(productoBorrado);
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
};
