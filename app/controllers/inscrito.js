module.exports = function(app) {
    var Inscrito = app.models.inscrito;
    var Evento = app.models.evento;

    var controller = {};
    controller.salvaInscricao = function(req, res) {
        var id = req.body._id;
        inscrito = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            cidade: req.body.cidade,
            estado: req.body.estado,
            pais: req.body.pais,
            nasc: req.body.nasc,
            contato: req.body.contato,
            email: req.body.email,
            eventos: req.body.eventos
        }
        if (id) {
            Inscrito.findByIdAndUpdate(id, inscrito).exec()
                .then(
                    function(inscricao) {
                        res.json(inscricao);
                    },
                    function(erro) {
                        res.status(500).json(erro);
                    }
                );
        } else {
            Inscrito.create(inscrito)
                .then(
                    function(inscrito) {
                        res.status(201).json(inscrito);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        }

        atualizaQtdInscritos(inscrito);

    }

    var atualizaQtdInscritos = function(inscrito) {
        for (var i = 0; i < inscrito.eventos[inscrito.eventos.length - 1].atividades.length; i++) {
            Evento.findOneAndUpdate({ _id: inscrito.eventos[inscrito.eventos.length - 1].evento_id, 'atividades._id': inscrito.eventos[inscrito.eventos.length - 1].atividades[i] }, { $inc: { 'atividades.$.qtdInscritos': 1 } }, { upsert: true }).exec()
                .then(
                    function(evento) {
                        console.log(evento.atividades);
                    },
                    function(erro) {
                        console.error(erro);
                    }
                );
        }
    }

    controller.buscaPorCpf = function(req, res) {
        var cpf = req.params.cpf;
        Inscrito.findOne({ 'cpf': cpf })
            .then(function(inscricao) {
                    res.json(inscricao);
                },
                function(erro) {
                    console.log('erro');
                    res.status(500).json(erro);
                })
    }
    return controller;
}