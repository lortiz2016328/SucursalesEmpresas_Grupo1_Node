const Sucursales = require('../models/sucursales.model');
const Empresas = require('../models/empresas.model');

function obtenerSucursales (req, res) {
    if (req.user.rol == "SuperAdmin") {
    Sucursales.find((err, sucursalesObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ sucursales: sucursalesObtenidas })

    })
    }else{
        Sucursales.find({idEmpresa: req.user.sub},(err, sucursalesObtenidas) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ sucursales: sucursalesObtenidas })
    
        })
    }
}

function ObtenerSucursalesId(req, res) {
    var idSucu = req.params.idSucursal;

    Sucursales.findById(idSucu, (err, sucursalEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!sucursalEncontrada) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ sucursal: sucursalEncontrada });
    })
}


/*function agregarSucursal(req, res){
    if(req.user.rol == 'Empresa') return res.status(500).send({mensaje: "Solo la empresa puede agregar sucursal"})
    var parametros = req.body;
    var SucursalesModel = new Sucursales();
    if(parametros.nombreSucursal && parametros.direccionSucursal){

        SucursalesModel.nombreSucursal = parametros.nombreSucursal;
        SucursalesModel.direccionSucursal = parametros.direccionSucursal;
        SucursalesModel.idEmpresa = req.user.sub;


        Sucursales.findOne({nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub}, (err, sucursalEncontrada)=>{

            Sucursales.findOne({direccionSucursal: parametros.direccionSucursal, idEmpresa: req.user.sub}, (err, direccionEncontrada)=>{

                if(sucursalEncontrada != null || direccionEncontrada != null) {
                    return res.status(500).send({Message: 'Esta sucursal ya existe, ingrese otros datos para agregar'})

                }else{
                    SucursalesModel.save((err, SucursalGuardada)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
                        if(!SucursalGuardada) return res.status(404).send({message: 'No se han podido guardar los datos'});
                        
                        return res.status(200).send({Sucursales: SucursalGuardada});
                    });                }
            });

        });
        
    }else{
        return res.status(200).send({message:'Debe llenar los campos solicitados'});
    }
}
*/
/*function agregarSucursal(req, res) {
    var parametros = req.body;
    var sucursalModel = new Sucursales();

    if (parametros.nombreSucursal && parametros.direccionSucursal) {
        sucursalModel.nombreSucursal = parametros.nombreSucursal;
        sucursalModel.direccionSucursal = parametros.direccionSucursal;
        sucursalModel.municipio = parametros.municipio;
        sucursalModel.idEmpresa = req.user.sub;
        
        sucursalModel.save((err, sucursalEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!sucursalEncontrada) return res.status(500).send({ mensaje: "Ocurrio un error al intentar agregar" })

            return res.status(200).send({ sucursal: sucursalEncontrada })
        })

    } else {
        return res.status(500).send({ mensaje: "Debe llenar todos los campos necesarios" })
    }
}
*/

function agregarSucursal(req, res){
    var parametros = req.body;
    var SucursalesModel = new Sucursales();
    if(req.user.rol == 'Empresa') return res.status(500).send({mensaje: "Solo la empresa puede agregar sucursal"})

    if(parametros.nombreSucursal && parametros.direccionSucursal){

        SucursalesModel.nombreSucursal = parametros.nombreSucursal;
        SucursalesModel.direccionSucursal = parametros.direccionSucursal;
        sucursalModel.municipio = parametros.municipio;
        SucursalesModel.idEmpresa = req.user.sub;


        Sucursales.findOne({nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub}, (err, sucursalEncontrada)=>{

            Sucursales.findOne({direccionSucursal: parametros.direccionSucursal, idEmpresa: req.user.sub}, (err, direccionEncontrada)=>{

                if(sucursalEncontrada != null || direccionEncontrada != null) {
                    return res.status(500).send({Message: 'Esta sucursal ya existe, ingrese otros datos para agregar'})

                }else{
                    SucursalesModel.save((err, SucursalGuardada)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
                        if(!SucursalGuardada) return res.status(404).send({message: 'No se han podido guardar los datos'});
                        
                        return res.status(200).send({Sucursales: SucursalGuardada});
                    });                }
            });

        });
        
    }else{
        return res.status(200).send({message:'Llene todos los campos, por favor'});
    }
}


/*function editarSucursal(req, res) {
    var idSucursal = req.params.idSucursal;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        return res.status(500).send({ mensaje: "No eres admin, no puedes editar" });
    } else {
        Sucursales.findByIdAndUpdate(idSucursal, parametros, { new: true }, (err, sucursalActualizada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!sucursalActualizada) return res.status(500).send({ mensaje: "Error al editar" });

            return res.status(200).send({ sucursal: sucursalActualizada });
        });

    }
}
*/

function editarSucursal (req, res) {
    var idSucu = req.params.idSucursal;
    var parametros = req.body;

   
        Sucursales.findByIdAndUpdate(idSucu, parametros, { new: true } ,(err, sucursalActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!sucursalActualizada) return res.status(404).send( { mensaje: 'Error, no ha podido editar la sucursal'});
        
            return res.status(200).send({ sucursal: sucursalActualizada});
        });
        
    
}

/*function eliminarSucursal(req, res) {
    var idSuc = req.params.idSucursal;
    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes permiso para realizar esta accion'});
    }else{
        Sucursales.findByIdAndDelete(idSuc, (err, sucursalEliminada) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!sucursalEliminada) return res.status(404).send( { mensaje: 'Error no se a podido eliminar el producto'});
    
            return res.status(200).send({ sucursal: sucursalEliminada});
        });
    }
}*/

function eliminarSucursal(req, res) {
    var idSucu = req.params.idSucursal;

    Sucursales.findByIdAndDelete(idSucu, (err, sucursalEliminada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!sucursalEliminada) return res.status(500).send({ mensaje: "Error al eliminar este producto, intenta de nuevo" });
        return res.status(200).send({ sucursal: sucursalEliminada });
    })
}


module.exports = {
    obtenerSucursales,
    agregarSucursal,
    eliminarSucursal,
    editarSucursal,
    ObtenerSucursalesId
}