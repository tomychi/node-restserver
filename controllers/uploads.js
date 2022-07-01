const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res = response) => {
    try {
        // valida imagenes
        // const nombre = await subirArchivo(req.files);
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        // valida txt md
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');

        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg });
    }
};

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // limpiar imagenes previas
    if (modelo.img) {
        // hay que borrar la imagen del servido
        const pathImagen = path.join(
            __dirname,
            '../uploads',
            coleccion,
            modelo.img
        );
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    // creo una carpeta con el nombre de la coleccion
    const nombre = await subirArchivo(req.files, undefined, coleccion);

    // en la propiedad img del modelo le doy el nombre
    modelo.img = nombre;

    // guardar en db
    await modelo.save();

    res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // limpiar imagenes previas
    if (modelo.img) {
        // eliminar duplicados
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    // subir archivo a cloudinary
    const { tempFilePath } = req.files.archivo; // path temporal
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    // en la propiedad img del modelo le doy el nombre
    modelo.img = secure_url;

    // guardar en db
    await modelo.save();

    res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                // si no existe podemos mostrar algo por defecto o un error
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // limpiar imagenes previas
    if (modelo.img) {
        // hay que borrar la imagen del servido
        const pathImagen = path.join(
            __dirname,
            '../uploads',
            coleccion,
            modelo.img
        );
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // si no hay carga imagen no found
    const pathDefault = path.join(__dirname, '../assets', 'no-image.jpg');
    res.sendFile(pathDefault);
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
};
