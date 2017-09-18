var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
    var bcrypt = require('bcrypt');
    const saltRounds = 10;

    var Pessoa = app.models.pessoa;

    var controller = {};

    controller.listaPessoas = function(req, res) {
        Pessoa.find().exec()
            .then(
                function(pessoas) {
                    res.json(pessoas);
                },
                function(error) {
                    res.status(500).json(erro);
                    console.log(erro);
                });
    };

    controller.removePessoas = function(req, res) {
        var _id = req.params.id;
        Pessoa.remove({ "_id": _id }).exec()
            .then(
                function() {
                    res.status(204).end();
                },
                function(erro) {
                    return console.log(erro);
                }
            );
    };

    controller.obtemPessoa = function(req, res) {
        var _id = req.params.id;
        Pessoa.findById(_id).exec()
            .then(
                function(pessoa) {
                    if (!pessoa) {
                        res.status(404).json('Pessoa não encontrada!');
                    } else {
                        res.json(pessoa);
                    }
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );
    };

    controller.salvaPessoa = function(req, res) {
        // console.log(req.body);

        var pessoa = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            grupo: req.body.grupo
        }

        bcrypt.hash(pessoa.senha, saltRounds, function(err, senha) {
            pessoa.senha = senha;
            console.log(pessoa);
            Pessoa.create(pessoa)
                .then(
                    function(pessoa) {
                        res.status(201).json(pessoa);
                    },
                    function(erro) {
                        console.error(erro);
                        res.status(500).json(erro);
                    }
                );
        });
    }

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'senha'
        },
        function(username, password, done) {
            Pessoa.findOne({ email: username }, function(err, user) {
                if (err) { return done(err); }

                var resultado = false;

                if (user) {
                    resultado = bcrypt.compareSync(password, user.senha);
                }
                if (!user || !resultado) {
                    console.log("resultado = " + resultado);
                    return done(null, false, { message: 'Dados inválidos.' });
                }

                return done(null, user);
            });
        }
    ));

    return controller;
}