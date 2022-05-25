const mongoose = require('mongoose');
const app = require('./app');
const Empresa = require('./src/models/empresas.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('./src/services/jwt');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SucursalesEmpresas', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

    app.listen(3000, function () {
        console.log("Hola Mundo!");
        console.log("La base de datos esta corriendo en el puerto 3000!");
        Empresa.find({ nombre: 'SuperAdmin' }, (err, usuarioEcontrado) => {
            if (usuarioEcontrado == 0) {

                bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                    Empresa.create({
                        nombre: 'SuperAdmin',
                        email: 'admin@kinal.com',
                        rol: 'SuperAdmin',
                        password: passwordEncriptada
                        
                    })

                });
            } else {

            }

        })
    })


}).catch(error => console.log(error))