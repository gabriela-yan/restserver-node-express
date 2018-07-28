//Librería para autenticar el token
const jwt = require('jsonwebtoken');

//==============================
// Verificar token
//==============================

let verificaToken = (req, res, next) => {
    //Obtengo el header
    let token = req.get('token');
    //Recibe el token, el SEED que se creo y un callback que recibe un error o un decoded
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        //decoded contiene la información del payload
        req.usuario = decoded.usuario;
        //Continua la ejecución del programa
        next();
    });
};

//==============================
// Verificar ADMIN_ROLE
//==============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}