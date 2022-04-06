const Sucursales = require('../models/sucursales.model');

function obtenerSucursales (req, res) {
    Sucursales.find((err, sucursalesObtenidas) => {
        if (err) return res.send({ mensaje: "Error:" + err })

        return res.send({ sucursales: sucursalesObtenidas })
    });
}

function agregarSucursal(req, res) {
    var parametros = req.body;
    var sucursalModel = new Sucursales();

    if (parametros.nombreSucursal && parametros.direccionSucursal && parametros.idEmpresa) {
        sucursalModel.nombreSucursal = parametros.nombreSucursal;
        sucursalModel.direccionSucursal = parametros.direccionSucursal;
        sucursalModel.idEmpresa = parametros.idEmpresa;

        Sucursales.find({ nombre: parametros.nombreSucursal }, (err, sucursalEncontrada) => {         
            if (sucursalEncontrada.length == 0) {
                
                sucursalModel.save((err, sucursalGuardada) => {
                        if (err) return res.status(500)
                            .send({ mensaje: "Error enn la peticion" });
                        if (!sucursalGuardada) return res.status(500)
                            .send({ mensaje: "Error al agregar" });

                        return res.status(200).send({ sucursal: sucursalGuardada });
                    });
            }
        }) 
    }
}

function editarSucursal(req, res) {
    var idSucursal = req.params.idSucursal;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        return res.status(500).send({ mensaje: "No eres Admin, no puedes realizar esta accion"  });
    } else {
        Sucursales.findByIdAndUpdate(idSucursal, parametros, { new: true }, (err, sucursalActualizada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!sucursalActualizada) return res.status(500).send({ mensaje: "Error al editar" });

            return res.status(200).send({ sucursal: sucursalActualizada });
        })
    }
}

function eliminarSucursal(req, res) {
    var idSucursal = req.params.idSucursal;
    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: "No eres Admin, no puedes realizar esta accion" });
    }else{
        Sucursales.findByIdAndDelete(idSucursal, (err, sucursalEliminada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!sucursalEliminada) return res.status(404).send( { mensaje: "Error al eliminar"});
    
            return res.status(200).send({ sucursal: sucursalEliminada});
        })
    }
}


module.exports = {
    obtenerSucursales,
    agregarSucursal,
    eliminarSucursal,
    editarSucursal 
}