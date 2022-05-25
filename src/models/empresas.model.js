
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresasSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    tipoEmpresa: String,
    municipio: String
});

module.exports = mongoose.model('Empresa', EmpresasSchema);
