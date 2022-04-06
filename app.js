const express = require('express');
const cors = require('cors');
var app = express();

const EmpresasRutas = require('./src/routes/empresas.routes');
const ProductosRutas = require('./src/routes/productos.routes');
const SucursalesRutas = require('./src/routes/sucursales.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', EmpresasRutas, ProductosRutas, SucursalesRutas);

module.exports = app;