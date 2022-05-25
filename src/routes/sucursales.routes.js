const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autenticacion =  require('../middlewares/autenticacion');

const api = express.Router()

api.put('/editarSucursal/:idSucursal',/*md_autenticacion.Auth,*/ sucursalesController.editarSucursal);
api.post('/agregarSucursal', md_autenticacion.Auth,sucursalesController.agregarSucursal);
api.delete('/eliminarSucursal/:idSucursal',/* md_autenticacion.Auth,*/ sucursalesController.eliminarSucursal);
api.get('/sucursales',md_autenticacion.Auth, sucursalesController.obtenerSucursales);
api.get('/sucursales/:idSucursal', sucursalesController.ObtenerSucursalesId);

module.exports = api;
