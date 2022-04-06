const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductosSchema = Schema({
    nombreProducto: String,
    nombreProveedor: String,
    stock: Number
});

module.exports = mongoose.model('Productos', ProductosSchema)