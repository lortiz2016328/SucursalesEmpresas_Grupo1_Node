const express = require('express');
const productoSucursalesControlador = require('../controllers/productosSucursales.controller');
const md_autenticacion =  require('../middlewares/autenticacion');

const api = express.Router()



//api.put('/editarProducto/:idProducto', productosController.editarProducto);
//api.post('/agregarProducto', md_autenticacion.Auth, productosController.agregarProducto);
api.put('/agregarProductoSucursal/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.agregarProductoSucursal);
api.delete('/eliminarProductosSucursales/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.eliminarProductoSucursal);
api.get('/productosSucursales', md_autenticacion.Auth, productoSucursalesControlador.obtenerProductosSucursales);
api.put('/simularVenta/:idProducto',md_autenticacion.Auth, productoSucursalesControlador.simularVenta);
api.get('/productosSucursales/:idProducto', productoSucursalesControlador.ObtenerProductosSucursalesId);

//api.delete('/eliminarProducto/:idProducto',productosController.eliminarProducto);
//api.get('/productos',md_autenticacion.Auth,productosController.obtenerProductos);
//api.get('/productos/:idProducto', productosController.ObtenerProductosId);
//api.get('/productosEmpresa/:idEmpresa', productosController.ObtenerProductosIdEmpresa);


module.exports = api;