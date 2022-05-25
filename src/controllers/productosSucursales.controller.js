const Sucursales = require('../models/sucursales.model');
const ProductoSucursal = require('../models/productosSucursales.model');
const Producto = require('../models/productos.model');


function obtenerProductosSucursales(req,res){
    ProductoSucursal.find((err,productosSucursales)=>{
        if(err) return res.send({mensaje: "Error: " + err})

        return res.send({productosSucursales: productosSucursales})
    })
}


function agregarProductoSucursal(req, res) {
    var parametros = req.body;
    var idSucu = req.params.idSucursal;
    if (req.user.rol != 'Empresa') return res.status(500).send({ message: 'Solo las empresas pueden acceder a esta información' })
    if (parametros.cantidadVendida) return res.status(500).send({ message: "Este campo no se puede agregar" });
    if (parametros.stockSucursal <= 0) return res.status(500).send({ message: "Debe ingresar un digito mayor a 0" })
    if (parametros.nombreProducto && parametros.stockSucursal && parametros.idSucursal
        && parametros.nombreProducto != "" && parametros.stockSucursal != "" && parametros.idSucursal != "") {
        Sucursales.findOne({ idSucu, idEmpresa: req.user.sub }, (err, sucursalEncontrada) => {
            if (err) return res.status(400).send({ message: 'Sucursal no encontrada, intente de nuevo' });
            if (!sucursalEncontrada) return res.status(400).send({ message: 'Esta sucursal no existe111' })
            ProductoSucursal.findOne({ nombreProducto: parametros.nombreProducto, idSucursal: sucursalEncontrada._id }, (err, productoEncontradoSucursal) => {
                if (err) return res.status(404).send({ message: 'Error en la petición' })
                if (productoEncontradoSucursal == null) {
                    Producto.findOne({ NombreProducto: parametros.nombreProducto, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Esta sucursal no existe' });
                        if (!productoEmpresaStock) return res.status(400).send({ message: 'El producto no existe en la empresa' })
                        if (parametros.stockSucursal <= 0) return res.status(500).send({ message: 'Debe ingresar un digito mayor a 0' });
                        if (productoEmpresaStock.stock == 0) return res.status(500).send({ message: 'Stock agotado, ingrese mas productos en la empresa' })
                        if (parametros.stockSucursal > productoEmpresaStock.stock) {
                            return res.status(500).send({ message: 'No hay suficiente stock' });
                        }
                        var ProductosSucursalModelo = new ProductoSucursal();
                        ProductosSucursalModelo.nombreProducto = parametros.nombreProducto;
                        ProductosSucursalModelo.stockSucursal = parametros.stockSucursal;
                        ProductosSucursalModelo.idSucursal = sucursalEncontrada._id;
                        ProductosSucursalModelo.idEmpresa = req.user.sub;
                        ProductosSucursalModelo.cantidadVendida = 0;

                        var restarStock = (parametros.stockSucursal * -1)
                        Producto.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'No se pudo editar el producto de la empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No se ha podido encontrar el producto para editar' });
                            ProductosSucursalModelo.save((err, ProductoGuardado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!ProductoGuardado) return res.status(404).send({ message: 'No hay productos' });
                                return res.status(200).send({ ProductosSucursal: ProductoGuardado });
                            });
                        })

                    })
                } else {
                    var restarStock = (parametros.stockSucursal * -1)
                    Producto.findOne({ NombreProducto: parametros.nombreProducto, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Sucursal no encontrada, intente de nuevo' });
                        if (!productoEmpresaStock) return res.status(400).send({ message: 'El producto no existe en la empresa' })
                        if (parametros.stockSucursal <= 0) return res.status(500).send({ message: 'Debe ingresar un digito mayor a 0' });
                        if (productoEmpresaStock.stock == 0) return res.status(500).send({ message: 'Stock agotado, ingrese mas productos en la empresa' })
                        if (parametros.stockSucursal > productoEmpresaStock.stock) {
                            return res.status(500).send({ message: 'No hay suficiente stock' });
                        }
                        Producto.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'No se pudo editar el producto de la empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'El producto no existe en la empresa' });

                            ProductoSucursal.findOneAndUpdate({ _id: productoEncontradoSucursal._id }, { $inc: { stockSucursal: parametros.stockSucursal } }, { new: true }, (err, productoSucursalEditado) => {
                                if (err) return res.status(500).send({ message: 'No se pudo editar el producto de la empresa' });
                                if (!productoSucursalEditado) return res.status(404).send({ message: 'No se encontraron productos para editar' });
                                return res.status(200).send({ ProductosSucursal: productoSucursalEditado });
                            });
                        })
                    });

                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Ingrese todos los datos necesarios' });
    }
}

function editarProductoSucursal (req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

   
    ProductoSucursal.findByIdAndUpdate(idProd, parametros, { new: true } ,(err, productoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!productoActualizado) return res.status(404).send( { mensaje: 'Error, no a podido editar el producto'});
        
            return res.status(200).send({ producto: productoActualizado});
        });
        
    
}


function simularVenta(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;
    if (req.user.rol == 'Empresa') {
        ProductoSucursal.findById(idProd, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!productoEncontrado) return res.status(400).send({ message: "Error, no se pudo ingresar el producto" });
            if (parametros.stockSucursal <= 0) return res.status(404).send({ message: 'Ese valor es superior al stock o menor que 0' });
            if (productoEncontrado.stockSucursal >= parametros.stockSucursal) {
                ProductoSucursal.findByIdAndUpdate(idProd, { $inc: { cantidadVendida: parametros.stockSucursal}}, { new: true }, (err, compraActualizada) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion" });
                    if (!compraActualizada) return res.status(400).send({ message: "Error, no se pudo ingresar el producto" });
                    ProductoSucursal.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stockSucursal * -1 } }, { new: true }, (err, entregaRealizada) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion" });
                        if (!entregaRealizada) return res.status(400).send({ message: "Error, no se pudo ingresar el producto" });
                        return res.status(200).send({ producto: entregaRealizada });
                    })
                })
            } else {
                return res.status(500).send({ message: "El stock no tiene suficientes productos" });
            }
        })
    }

}


function eliminarProductoSucursal(req, res) {
    var idProd = req.params.idProducto;
        ProductoSucursal.findByIdAndDelete(idProd, (err, productoEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEliminado) return res.status(404).send({ mensaje: 'Error a la hora de eliminar el producto' });

            return res.status(200).send({ producto: productoEliminado });
        })
    
}

function ObtenerProductosSucursalesId(req, res) {
    var idProd = req.params.idProducto;

    ProductoSucursal.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

module.exports = {
    obtenerProductosSucursales,
    agregarProductoSucursal,
    editarProductoSucursal,
    eliminarProductoSucursal,
    simularVenta,
    ObtenerProductosSucursalesId
}
