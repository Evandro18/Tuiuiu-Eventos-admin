var docxtemplater = require('./docxtemplater');
var JSZip = require('jszip');
var path = require('path');
const mime = require('mime')
const rimraf = require('rimraf')

module.exports = function(app) {
    var Evento = app.models.evento;

    var Inscrito = app.models.inscrito;

    var controller = {};

    var fs = require('fs');
    var mongoose = require('mongoose');
    var rimraf = require('rimraf');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    controller.geraCertificados = function(req, res) {
        var gfs = Grid(mongoose.connection.db);
        var idCertificado = req.body.id;
        gfs.findOne({ "metadata.idEvento": req.body.id }, function(erro, certificado) {
            if (erro) {
                console.log(erro);
            } else {
                if (certificado) {
                    idCertificado = certificado._id;
                    var buffer = [];
                    const download = './download'
                    const downEvento = download + '/' + certificado.metadata.idEvento
                    atualizaPastas(download, downEvento)
                    var certificadoLeitura = gfs.createReadStream({ "_id": idCertificado })
                    certificadoLeitura.on('data', function(data) {
                        buffer.push(data);
                    }).on('close', function(file) {
                        fs.writeFile(downEvento + '/' + certificado.filename, buffer[0], 'binary', (err) => {
                            if (err) throw err;
                            console.log('Modelo lido com sucesso');
                            docxtemplater.gerador(downEvento, certificado.filename, req.body)
                                .then(
                                    (saida) => {
                                        var zipBuffer = docxtemplater.zipArquivos(downEvento + '/pdfs')
                                        var caminho = 'zipados.zip'
                                        console.log(zipBuffer)
                                        pathFile = '/home/evandro/Documentos/Projeto Gerador Certificados/workspace/certificado/zipados.zip'
                                        fs.writeFile(__dirname + '/' + caminho, zipBuffer, (result) => {
                                            console.log(result)
                                            console.log('arquivo escrito com sucesso')
                                            atualizaPastas(download)
                                            res.json({ mensagem: 'Arquivo criado com sucesso' })
                                        })
                                    },
                                    (erro) => {
                                        console.log('Erro', erro)
                                    })
                        });
                    });
                } else {
                    res.status(404).json('Modelo não foi encontrado');
                }
            }
        });
    };

    var atualizaPastas = function(download, downEvento) {
        if (!fs.existsSync(download)) {
            fs.mkdirSync(download)
            fs.mkdirSync(downEvento)
        } else {
            rimraf(download, (err) => {
                if (err) throw err;
                console.log('pasta ' + download + ' excluida')
            })
        }

    }

    controller.listaAtividadesInscritos = function(req, res) {
        var id = req.params.id;
        var dados = {
            dadosInscritos: [],
            evento: {}
        };

        var retornarDadosInscrito = function() {
            Inscrito.find({ eventos: { $elemMatch: { evento_id: id } } }, { nome: 1, cpf: 1, cidade: 1, estado: 1, pais: 1, nasc: 1, contato: 1, email: 1, 'eventos.$': 1 }).exec()
                .then(
                    function(inscricao) {
                        dados.dadosInscritos = inscricao;
                        res.send(dados);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        }

        Evento.findById(id, { _id: 1, "atividades.nome": 1, "atividades._id": 1 }).exec()
            .then(
                function(evento) {
                    dados.evento = evento;
                    retornarDadosInscrito();
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );
    }

    return controller;
}