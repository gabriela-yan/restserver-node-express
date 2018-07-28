const express = require('express');
//Librería para encriptar
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //Atrapa un posible error del servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Si el usuario no se encuentra en la BD envia un msj de error
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        //Si el password enviado no coincide con el password de BD envia un msj de error
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        //Genera el token de autenticación para un usuario existente en la BD
        let token = jwt.sign({
            //Payload
            usuario: usuarioDB
                //Secret
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        //Envia la respuesta por verdadero
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});


module.exports = app;