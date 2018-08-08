// ================
//      Puerto
// ================
process.env.PORT = process.env.PORT || 3000;

// ================
//     Entorno
// ================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Vencimiento de token
// ====================
// 60seg * 60 min * 24hrs * 30dias

process.env.CADUCIDAD_TOKEN = '48h';

// =====================
// SEED de autenticación
// =====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ================
//  Base de Datos
// ================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// =====================
// Google client ID
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '936477452644-s2gh8n651cusuct9r6qqafr1k51vq736.apps.googleusercontent.com';