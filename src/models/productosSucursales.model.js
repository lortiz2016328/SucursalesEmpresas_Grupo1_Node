const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var productosSucursalSchema = Schema({
    nombreProducto: String,
    stockSucursal: Number,
    cantidadVendida: Number,
    idSucursal: { type: Schema.Types.ObjectId, ref: 'Sucursales'},
    idEmpresa: {type: Schema.Types.ObjectId, ref: 'Empresas'}
})

module.exports=mongoose.model('productosSucursal',productosSucursalSchema)