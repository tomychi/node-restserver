const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
} = require('../controllers/productos');

const {
    existeCategoriaPorId,
    existeProductoPorId,
} = require('../helpers/db-validators');

const router = Router();

// // {{url}}/api/productos

// Obtener todas las prodcutos - publico
router.get('/', obtenerProductos);

// obtener una producto por id - publico
router.get(
    '/:id',
    [
        check('id', 'No es un id de Mongo valido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos,
    ],
    obtenerProducto
);

// crear producto - privado - caulquier persona con un token valido
router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'No es un id de Mongo').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        validarCampos,
    ],
    crearProducto
);

// actualizar un registro - privado
router.put(
    '/:id',
    [
        validarJWT,
        // check('categoria', 'No es un id de Mongo').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos,
    ],
    actualizarProducto
);

// borrar un producto - admin
router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id de Mongo valido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos,
    ],
    borrarProducto
);

module.exports = router;
