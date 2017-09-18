module.exports = function(app) {
    var Evento = app.models.evento;

    var controller = {};
    controller.listaEventos = function(req, res) {
        var limite = 6;
        var pagina = req.params.pagina;
        console.log('pegando lista de eventos na página ' + pagina);
        var pulo = limite * (pagina - 1);
        Evento.find().skip(pulo).limit(limite).sort({ dataFinal: '-1' }).exec()
            .then(
                function(eventos) {
                    res.json(eventos);
                },
                function(erro) {
                    res.status(500).json(erro);
                    console.log(erro);
                });
    };

    controller.removeEventos = function(req, res) {
        var _id = req.params.id;
        Evento.remove({ "_id": _id }).exec()
            .then(
                function() {
                    res.status(204).end();
                },
                function(erro) {
                    return console.error(erro);
                }
            );
    };

    controller.obtemEvento = function(req, res) {
        var _id = req.params.id;
        console.log('pegando evento de id: ' + _id);
        Evento.findById(_id).exec()
            .then(
                function(evento) {
                    if (!evento) {
                        res.status(404).json('Evento não encontrado!');
                    } else {
                        res.json(evento);
                    }
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );
    };

    controller.salvaUrlImagem = function(req, res) {
        var _id = req.params.id;
        var url = req.params.urlLogo;
        console.log(req.params);
        Evento.findByIdAndUpdate(_id, { $set: { urlLogo: url } }, { new: true }).exec()
            .then(
                function(evento) {
                    res.json(evento);
                },
                function(erro) {
                    res.status(500).json(erro);
                });
    }

    controller.salvaEvento = function(req, res) {
        var _id = req.body._id;
        if (_id) {
            Evento.findByIdAndUpdate(_id, req.body).exec()
                .then(
                    function(evento) {
                        res.json(evento);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        } else {
            Evento.create(req.body)
                .then(
                    function(evento) {
                        res.status(201).json(evento);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        }
    };

    //Realização de upload e download da logo
    var fs = require('fs');
    var mongoose = require('mongoose');
    var rimraf = require('rimraf');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    controller.fazUploadLogo = function(req, res) {
        var gfs = Grid(mongoose.connection.db);
        var logo = req.files.logo;
        var idEvento = req.body.idEvento;
        var writeStream = gfs.createWriteStream({
            filename: logo.name,
            mode: 'w',
            content_type: logo.mimetype,
            metadata: {
                idEvento: idEvento
            }
        });

        var pastaRaiz = './uploads/';
        var pastaArquivo = pastaRaiz + idEvento + '/';
        if (!fs.existsSync(pastaRaiz)) {
            fs.mkdirSync(pastaRaiz);
        }
        if (!fs.existsSync(pastaArquivo)) {
            fs.mkdirSync(pastaArquivo);
        }
        var caminhoArquivo = pastaArquivo + logo.name;
        console.log(caminhoArquivo);

        fs.writeFile(caminhoArquivo, logo.data, function(erro) {
            if (erro) {
                console.log(erro);
            }
            console.log("Arquivo '" + logo.name + "' salvo em " + caminhoArquivo + ".");
        });

        writeStream.on('close', function(arquivo) {
            console.log('Foto salva com sucesso');
            res.send('Foto salva com sucesso!');
            rimraf(pastaArquivo, function() {
                console.log('Pasta ' + pastaArquivo + ' removida')
            });
        });

        fs.createReadStream(caminhoArquivo).pipe(writeStream);
    };
    i = 0;
    controller.obtemLogo = function(req, res) {
        var idEvento = req.params.idEvento;
        var nomeLogo = req.params.nomeLogo;

        var gfs = Grid(mongoose.connection.db);
        gfs.findOne({ "metadata.idEvento": idEvento }, function(erro, logo) {
            if (erro) {
                console.log(erro);
            } else {
                if (logo) {
                    res.setHeader('Content-type', logo.contentType);
                    res.setHeader('Content-disposition', 'filename=' + logo.filename);
                    gfs.createReadStream({ "_id": logo._id }).pipe(res);
                } else {
                    res.status(404).json('Imagem não encontrada');
                }
            }
        });
    };

    //modelo do certificado
    controller.fazUploadCertificado = function(req, res) {
        var gfs = Grid(mongoose.connection.db);
        var certificado = req.files.certificado;
        var idEvento = req.body.idEvento;
        var writeStream = gfs.createWriteStream({
            filename: certificado.name,
            mode: 'w',
            content_type: certificado.mimetype,
            metadata: {
                idEvento: idEvento
            }
        });

        var pastaRaizModelo = './uploadsModelos/';
        var pastaArquivoModelo = pastaRaizModelo + idEvento + '/';
        if (!fs.existsSync(pastaRaizModelo)) {
            fs.mkdirSync(pastaRaizModelo);
        }
        if (!fs.existsSync(pastaArquivoModelo)) {
            fs.mkdirSync(pastaArquivoModelo);
        }
        var caminhoArquivoModelo = pastaArquivoModelo + certificado.name;
        fs.writeFile(caminhoArquivoModelo, certificado.data, function(erro) {
            if (erro) {
                console.log(erro);
            }
            console.log("Arquivo '" + certificado.name + "' salvo em " + caminhoArquivoModelo + ".");
        });

        // writeStream.on('close', function(arquivoCertificado) {
        //     console.log('Certificado salvo com sucesso');
        //     res.send('Certificado salvo com sucesso!');
        //     rimraf(pastaArquivoModelo, function() {
        //         console.log('Pasta ' + pastaArquivoModelo + ' removida')
        //     });
        // });

        gfs.findOne({ "metadata.idEvento": idEvento }, function(erro, arquivo) {
            console.log(arquivo);
            if (arquivo) {
                gfs.remove({ _id: arquivo._id }, function(erro) {
                    if (erro) console.log(erro);
                    console.log("Arquivo existente removido");
                    fs.createReadStream(caminhoArquivoModelo).pipe(writeStream);
                    res.json({ mensagem: "Arquivo substituido" });
                });
            } else {
                fs.createReadStream(caminhoArquivoModelo).pipe(writeStream);
            }
        });
    };

    controller.obtemCertificado = function(req, res) {
        var idEvento = req.params.idEvento;
        var nomeCertificado = req.params.nomeCertificado;

        var gfs = Grid(mongoose.connection.db);
        gfs.findOne({ "metadata.idEvento": req.params.idEvento }, function(erro, certificado) {
            if (erro) {
                console.log(erro);
            } else {
                if (certificado) {
                    res.setHeader('Content-type', certificado.contentType);
                    res.setHeader('Content-disposition', 'filename=' + certificado.filename);
                    gfs.createReadStream({ "_id": certificado._id }).pipe(res);
                } else {
                    res.status(404).json('Modelo não encontrado');
                }
            }
        });
    };

    return controller;
};