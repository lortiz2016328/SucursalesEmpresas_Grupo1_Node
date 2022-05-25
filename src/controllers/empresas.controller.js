const Empresas = require('../models/empresas.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')


/*function UsuarioInicial() {
    Empresas.find({ rol: "SuperAdmin", usuario: "SuperAdmin" }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
          Empresas.create({
            usuario: "SuperAdmin",
            password: passwordEncriptada,
            rol: "SuperAdmin",
          });
        });
      }
    });
  }
  */
  


//Login
 function Login(req, res) {
    var parametros = req.body;
    Empresas.findOne({ email: parametros.email }, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (empresaEncontrada) {
             // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, empresaEncontrada.password,
                (err, verificacionPassword) => {
                        // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if (verificacionPassword) {
                             // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(empresaEncontrada) })
                        } else {
                            empresaEncontrada.password = undefined;
                            return res.status(200)
                                .send({ empresa: empresaEncontrada })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: "La contraseña no coincide, intente de nuevo" });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: "El correo no existe, intente de nuevo" })
        }
    })
}
//Agregar Empresa
function agregarEmpresa(req, res) {
    var parametros = req.body;
    var empresasModel = new Empresas();

    if (parametros.nombre && parametros.email && parametros.password) {
        empresasModel.nombre = parametros.nombre;
        empresasModel.email = parametros.email;
        empresasModel.usuario = parametros.usuario;
        empresasModel.password = parametros.password;
        
        empresasModel.rol = 'Empresa';
        empresasModel.tipoEmpresa = parametros.tipoEmpresa;
        

        Empresas.find({ email: parametros.email }, (err, empresaEncotrada) => {
            if (empresaEncotrada.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    empresasModel.password = passwordEncriptada;

                    empresasModel.save((err, empresaGuardada) => {
                        if (err) return res.status(500)
                            .send({ mensaje: "Error en la peticion" });
                        if (!empresaGuardada) return res.status(500)
                            .send({ mensaje: "Error al agregar empresa" });
                        return res.status(200).send({ empresa: empresaGuardada });
                    });
                });
            } else {
                return res.status(500)
                    .send({ mensaje: "Este correo ya existe" });
            }
        })
    }
}

//Editar Empresa
/*function editarEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        if (parametros.rol) {
            return res.status(500).send({ message: "No eres Admin no puedes editar" })
        } else {
            Empresas.findByIdAndUpdate({ _id: req.user.sub }, parametros, { new: true }, (err, empresaActualizada) => {
                if (err) return res.status(500).send({ message: "Error en la peticion" });
                if (!empresaActualizada) return res.status(404).send({ message: "Error en la petición" });

                return res.status(200).send({ empresa: empresaActualizada });
            });
        }
    } else {
        Empresas.findById(idEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!empresaEncontrada) return res.status(500).send({ message: "Error en la petición" });
                
            if (empresaEncontrada.rol == 'Empresa') {
                Empresas.findByIdAndUpdate({ _id: idEmpresa }, parametros, { new: true }, (err, empresaActualizada) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion" });
                    if (!empresaActualizada) return res.status(404).send({ message: "Error no puedes editar" });

                    return res.status(200).send({ empresa: empresaActualizada });
                });
            } else {
                if (idEmpresa == req.user.sub) {
                    if (!parametros.rol) {
                        Empresas.findByIdAndUpdate({ _id: idEmpresa }, parametros, { new: true }, (err, empresaActualizada) => {
                            if (err) return res.status(500).send({ message: "Error en la peticion" });
                            if (!empresaActualizada) return res.status(404).send({ message: "Error, no puedes editar" });

                            return res.status(200).send({ empresa: empresaActualizada });
                        });
                    } else {
                        return res.status(500).send({ mensaje: "No puedes editar el Rol" })
                    }
                } else {
                    return res.status(500).send({ mensaje: "No puedes editar esta empresa, intenta de nuevo" });
                }
            }
        })

    }

}*/

function editarEmpresa (req, res) {
    var IdEmpr = req.params.idEmpresa;
    var parametros = req.body;

    //if(idEmpr !== req.user.sub) return res.status(500).send({mensaje: 'No puede editar otras Empresas'});

    Empresas.findByIdAndUpdate(req.user.sub, parametros, { new: true } ,(err, empresaActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaActualizada) return res.status(404).send( { mensaje: 'Error al Editar la empresa'});

        return res.status(200).send({ empresa: empresaActualizada});
    });
}

function editarEmpresaAdmin (req, res) {
    var IdEmpr = req.params.idEmpresa;
    var parametros = req.body;

    //if(idEmpr !== req.user.sub) return res.status(500).send({mensaje: 'No puede editar otras Empresas'});

    Empresas.findByIdAndUpdate(IdEmpr, parametros, { new: true } ,(err, empresaActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaActualizada) return res.status(404).send( { mensaje: 'Error al Editar la empresa'});

        return res.status(200).send({ empresa: empresaActualizada});
    });
}

//Eliminar
function eliminarEmpresa(req, res) {
    var idUser = req.params.idEmpresa;

    Empresas.findByIdAndDelete(idUser, (err, empresaEliminada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!empresaEliminada) return res.status(500).send({ mensaje: "Error al eliminar esta empresa, intenta de nuevo" });
        return res.status(200).send({ empresa: empresaEliminada });
    })
}

function ObtenerEmpresas(req,res){
    Empresas.find((err,empresasObtenidas)=>{
        if(err) return res.send({mensaje: "Error: " + err})

        return res.send({empresas: empresasObtenidas})
    })
}

function ObtenerEmpresaId(req, res) {
    var IdEmpr = req.params.idEmpresa;

    Empresas.findById(IdEmpr, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!empresaEncontrada) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ empresa: empresaEncontrada });
    })
}



module.exports = {
    //UsuarioInicial,
    Login,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    ObtenerEmpresas,
    ObtenerEmpresaId,
    editarEmpresaAdmin
}
