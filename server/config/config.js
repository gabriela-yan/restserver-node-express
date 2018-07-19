// ================
//      Puerto
// ================
process.env.PORT = process.env.PORT || 3000;

// ================
//     Entorno
// ================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
//  Base de Datos
// ================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://coffe_user:Gery312812@ds141641.mlab.com:41641/coffe';
}
process.env.URLDB = urlDB;