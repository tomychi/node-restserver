const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');

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

// para comprobar si existe una categoria
const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id no existe: ${id}`);
    }
};

// existe producto
const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id no existe: ${id}`);
    }
};

// validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(
            `La coleccion ${coleccion} no es permitida - ${colecciones}`
        );
    }

    return true;
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
};
