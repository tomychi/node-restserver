const { validationResult } = require('express-validator');

// next es una funcion , si pasa la  validacion, sigue al sig middlewares
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
};

module.exports = {
    validarCampos,
};
