const Productos = require('../models/productos.model');

/*function agregarProducto(req, res) {
    var parametros = req.body;
    console.log(parametros);
    var ProductosEmpresaModelo = new Productos();
    if (req.user.rol == 'Admin') {
        return res.status(500).send({ message: 'El administrador no puede realizar esta accion' });
    } else {
        if (parametros.nombreProducto && parametros.nombreProveedor) {
            ProductosEmpresaModelo.nombreProducto = parametros.nombreProducto;
            ProductosEmpresaModelo.nombreProveedor = parametros.nombreProveedor;
            if (parametros.Stock == 0) {
                ProductosEmpresaModelo.Stock = 0;
            } else {
                ProductosEmpresaModelo.Stock = parametros.Stock;
            }

            ProductosEmpresaModelo.idEmpresa = req.user.sub;

            Productos.find({ NombreProducto: parametros.NombreProducto, idEmpresa: req.user.sub }, (err, productoEncontrado) => {
                if (productoEncontrado == 0) {
                    ProductosEmpresaModelo.save((err, ProductoGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });
                        if (!ProductoGuardado) return res.status(404).send({ message: 'No se encontraron productos para esta empresa' });
                        console.log(productoEncontrado)
                        return res.status(200).send({ Productos: ProductoGuardado });
                    });
                } else {
                    return res.status(500).send({ message: 'Este producto existe' })
                }
            });

        } else {
            console.log('no se guarda')
            return res.status(500).send({ message: 'Error en la peticion' });
        }
    }

}*/

//Agregar Empresa
function agregarProducto(req, res) {
    var parametros = req.body;
    var productosModel = new Productos();

    if (parametros.nombreProducto) {
        productosModel.nombreProducto = parametros.nombreProducto;
        productosModel.nombreProveedor = parametros.nombreProveedor;
        productosModel.stock = parametros.stock;
        productosModel.idEmpresa = req.user.sub;

        productosModel.save((err, productoGuardado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!productoGuardado) return res.status(500).send({ mensaje: "ocurrio un error al intentar agregar" })

            return res.status(200).send({ empleado: productoGuardado })
        })

    } else {
        return res.status(500).send({ mensaje: "debe llenar todos los campos necesarios" })
    }

       
    
}

function editarProducto (req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

   
        Productos.findByIdAndUpdate(idProd, parametros, { new: true } ,(err, productoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!productoActualizado) return res.status(404).send( { mensaje: 'Error, no a podido editar el producto'});
        
            return res.status(200).send({ producto: productoActualizado});
        });
        
    
}

/*function eliminarProducto(req, res) {
    var idProd = req.params.idProducto;
    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes permiso para realizar esta accion'});
    }else{
        Productos.findByIdAndDelete(idProd, (err, productoEliminado) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!productoEliminado) return res.status(404).send( { mensaje: 'Error no se a podido eliminar el producto'});
    
            return res.status(200).send({ producto: productoEliminado});
        });
    }
}*/

function eliminarProducto(req, res) {
    var idProd = req.params.idProducto;

    Productos.findByIdAndDelete(idProd, (err, productoEliminado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!productoEliminado) return res.status(500).send({ mensaje: "Error al eliminar este producto, intenta de nuevo" });
        return res.status(200).send({ producto: productoEliminado });
    })
}


function obtenerProductos (req, res) {
    if (req.user.rol == "SuperAdmin") {
        Productos.find((err, productosObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ productos: productosObtenidos })

    })
    }else{
        Productos.find({idEmpresa: req.user.sub},(err, productosObtenidos) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ productos: productosObtenidos })
    
        })
    }
}

function ObtenerProductosId(req, res) {
    var idProd = req.params.idProducto;

    Productos.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

function ObtenerProductosIdEmpresa(req, res) {
    var idEmp = req.params.idEmpresa;

    Productos.find( { idEmpresa : idEmp}, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

module.exports = {
    obtenerProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    ObtenerProductosId,
    ObtenerProductosIdEmpresa
}
