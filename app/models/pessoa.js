var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function() {

    var servidor = mongoose.Schema({
        nome: {
            type: String,
            required: true
        },
        senha: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        grupo: {
            type: String,
            required: true
        }
    });
    return mongoose.model('Pessoa', servidor);
}