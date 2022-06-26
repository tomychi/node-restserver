const Role = require('../models/role');
const Usuario = require('../models/usuario');

// verificar si existe el correo
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol }); // valido q exista uno
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`); //error personalizado atrapado en el custom
    }
};

// verificcar si el correo existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya esta registrado`);
    }
};

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} NO existe`);
    }
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
};
