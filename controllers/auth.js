const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        // verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuaruio / password no son correctors - correo',
            });
        }

        // SI el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuaruio / password no son correctors - estado: false',
            });
        }

        // verificar la password
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuaruio / password no son correctors - password',
            });
        }

        // generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        // si no existe
        if (!usuario) {
            // crear usuario
            const data = {
                nombre,
                correo,
                password: ':D',
                img,
                google: true,
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            });
        } // si esta borrado en la db

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
        });
    }
};

module.exports = {
    login,
    googleSignIn,
};
