const express = require('express');
//Librería para encriptar
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    //Se envia un objeto personalizado que se guarda en la variable googleUser
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    //Al hacer un POST en google se recibe el token
    let token = req.body.idtoken;
    //Con el token llamamos a la función de google verify() 
    //Doc:   https://developers.google.com/identity/sign-in/web/backend-auth
    let googleUser = await verify(token)
        //Si el token es inválido se atrapa el error evitando la ejecución
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    //Se llama el Schema para verificar si ya cuento con un usuario en BD con ese email
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Verifica si existe el usuario en la BD
        if (usuarioDB) {
            //Verifica si se ha autenticado o no por google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else { //Si el usuario esta autenticado por google se renueva el token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario aún no existe en la BD se crea el nuevo usuario
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            //Graba en la BD
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }

    })
});

module.exports = app;