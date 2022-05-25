const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SucursalesSchema = Schema({
    nombreSucursal: String,
    direccionSucursal: String, 
    municipio: String,
    idEmpresa: {type: Schema.Types.ObjectId, ref: 'Empresas'}
});

module.exports = mongoose.model('Sucursales', SucursalesSchema)