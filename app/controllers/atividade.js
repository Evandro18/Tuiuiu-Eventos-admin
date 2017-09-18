module.exports = function(app) {
    var Evento = app.models.evento;

    var controller = {};

    //método para pegar todas as atividades do Evento
    controller.listaAtividades = function(req, res) {
            var idEvento = req.params.idEvento;
            var nomeAtividade = req.params.nomeAtividade;
            Evento.find({ "_id": idEvento }, { "atividades": [] }).exec()
                .then(function(atividades) {
                        atividades.forEach(function(element) {
                            element.atividades.forEach(function(atividade) {
                                if (atividade.nome == nomeAtividade) {
                                    res.json(atividade);
                                }
                            });
                        }, this);
                    },
                    function(erro) {
                        console.log(erro);
                    });
        }
        //método Obeter uma atividade
    controller.obtemAtividade = function(req, res) {
            var idEvento = req.params.idEvento;
            var nomeAtividade = req.params.nomeAtividade;
            Evento.find({ "_id": idEvento }, { 'atividades': { $elemMatch: { 'nome': nomeAtividade } } }).exec()
                .then(function(atividade) {
                        console.log(atividade);
                        res.json(atividade);
                    },
                    function(erro) {
                        console.log(erro);
                    });
        }
        //fim
        //Remover atividades pronto!!!!
        /*    controller.removeAtividade = function(req, res) {
                var _id = req.body._id;
                var nomeAtividade = req.params.nomeAtividade;
                Evento.findOneAndUpdate({ '_id': _id, 'atividades.nome': nomeAtividade }, { $set: { 'atividades.$.nome': } }).exec()
                    .then(
                        function(evento) {
                            console.log(evento);
                            evento.atividades.forEach(function(atividade) {
                                if (atividade.nome == nomeAtividade) {
                                    atividade.remove();
                                    console.log('removeu');
                                }
                            });
                            res.status(204).end();
                        },
                        function(erro) {
                            return console.log(erro);
                        }
                    );
            };*/

    controller.addAtividade = function(req, res) {
        console.log("Espero que adicione");
        var idEvento = req.params.idEvento;
        var idAtividade = req.params.nomeAtividade;
        if (_id) {
            Atividade.update(_id, req.body).exec()
                .then(
                    function(Atividade) {
                        res.json(Atividade);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        } else {
            Atividade.create(req.body)
                .then(
                    function(Atividade) {
                        res.status(201).json(Atividade);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        }
    };
    return controller;
};