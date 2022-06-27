const { Router } = require('express');
const { check, query } = require('express-validator');

const {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
} = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
} = require('../middlewares');

const {
    usuariosGEt,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
} = require('../controllers/usuarios');

const router = Router();

router.get(
    '/',
    [
        query('limite', "El valor de 'limite' debe ser numérico")
            .isNumeric()
            .optional(),
        query('desde', "El valor de 'desde' debe ser numérico")
            .isNumeric()
            .optional(),
        validarCampos,
    ],
    usuariosGEt
);

// para obtener la informacion despues del /
router.put(
    '/:id',
    [
        check('id', 'No es un ID valida').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos,
    ],
    usuariosPut
);

router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser mas de 6 letras').isLength({
            min: 6,
        }),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol').custom(esRoleValido),
        validarCampos,
    ],
    usuariosPost
);

router.delete(
    '/:id',
    [
        validarJWT,
        // esAdminRole, // fuerza q sea admin
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
        check('id', 'No es un ID valida').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos,
    ],
    usuariosDelete
);

router.patch('/', usuariosPatch);

module.exports = router;
