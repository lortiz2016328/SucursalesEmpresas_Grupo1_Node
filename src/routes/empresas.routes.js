const express = require('express');
const empresaControlador = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autenticacion');


const api = express.Router();

api.post('/login', empresaControlador.Login);
api.get('/empresas',md_autenticacion.Auth, empresaControlador.ObtenerEmpresas);
api.get('/empresas/:idEmpresa', empresaControlador.ObtenerEmpresaId);
api.post('/agregarEmpresas', empresaControlador.agregarEmpresa);
api.put('/editarEmpresa/:idEmpresa',md_autenticacion.Auth,  empresaControlador.editarEmpresa);
api.delete('/eliminarEmpresa/:idEmpresa',  empresaControlador.eliminarEmpresa);
api.put('/editarEmpresaAdmin/:idEmpresa',  empresaControlador.editarEmpresaAdmin);

module.exports = api;

