var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function() {
    var schema = mongoose.Schema({

        nome: {
            type: String,
            require: true,
            index: {
                unique: true
            }
        },
        local: {
            type: String,
            require: true
        },
        contato: {
            type: String,
            require: true
        },
        coordenacao: {
            type: String,
            require: true
        },
        dataInicial: {
            type: Date,
            require: true
        },
        dataFinal: {
            type: Date,
            require: true
        },
        descricao: {
            type: String,
            require: true
        },
        logo: String,

        urlLogo: {
            type: String
        },

        modeloCertificado: [String],

        atividades: [mongoose.Schema({

            nome: {
                type: String,
                require: true,
            },
            tipo: {
                type: String,
                require: true,
            },
            cargaHoraria: {
                type: Number,
                require: true
            },
            dataInicialAtividade: {
                type: Date,
                require: true
            },
            dataFinalAtividade: {
                type: Date,
                require: true
            },
            horario: {
                type: String,
                require: true
            },
            descricao: {
                type: String,
                require: true
            },
            integrantes: {
                type: String,
                require: true
            },
            acaoMae: {
                type: String,
                require: true
            },
            quantidadeVagas: {
                type: Number,
                require: true
            },
            restricaoAcesso: {
                type: String,
                require: true
            },
            qtdInscritos: {
                type: Number
            }
        })],

        pessoas: [mongoose.Schema({

            nome: {
                type: String,
                require: true,
            },
            cpf: {
                type: String,
                require: false,
                // index: {
                //       unique: true
                //    }
            },
            naturalidade: {
                type: String,
                require: true
            },
            estado: {
                type: String,
                require: true
            },
            nacionalidade: {
                type: String,
                require: true
            },

            dataNascimento: {
                type: Date,
                require: true
            },

            sobre: {
                type: String,
                require: true
            },
            funcao: {
                type: String,
                require: true
            },
            email: {
                type: String,
                require: false,
                //  index: {
                //       unique: true
                //    }
            }
        })]
    });
    return mongoose.model('Evento', schema);
};