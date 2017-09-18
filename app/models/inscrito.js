var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function() {
    var schema = mongoose.Schema({

        nome: {
            type: String,
            require: true
        },
        cpf: {
            type: String,
            require: true,
            index: {
                unique: true
            }
        },
        cidade: {
            type: String,
            require: true
        },
        estado: {
            type: String,
            require: true
        },
        pais: {
            type: String,
            require: true
        },
        nasc: {
            type: Date,
            require: true
        },
        contato: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            index: {
                unique: true
            }
        },
        eventos: [{
            evento_id: {
                type: String
            },
            nome: {
                type: String
            },
            dataInicial: {
                type: Date,
            },
            dataFinal: {
                type: Date,
            },
            local: {
                type: String
            },
            descricao: {
                type: String,
            },
            atividades: []
        }]
    });
    return mongoose.model('Inscricao', schema);
}