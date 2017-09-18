var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

function verificaAutenticacao(grupo) {
    return function(req, res, next) {
        if (req.isAuthenticated() && grupo.indexOf(req.user.grupo) != -1) {
            return next();
        } else {
            res.status('401').json('Não autorizado');
        }
    }
}

module.exports = function(app) {

    var controllerEvento = app.controllers.evento;
    var controllerAtividade = app.controllers.atividade;
    var controllerPessoa = app.controllers.pessoa;
    var controllerInscricao = app.controllers.inscrito;
    var controllerCertificacao = app.controllers.certificacao;


    var Pessoa = app.models.pessoa;

    app.route('/download')
        .get((req, res) => {
            res.download('/home/evandro/Documentos/Projeto Gerador Certificados/workspace/certificado/app/controllers/zipados.zip')
        })

    app.route('/api/certificado/geraCertificado')
        .post(controllerCertificacao.geraCertificados);

    app.route('/api/certificado/lista/:id')
        .get(controllerCertificacao.listaAtividadesInscritos);

    app.route('/api/inscricao')
        .post(controllerInscricao.salvaInscricao);

    app.route('/api/inscricao/:cpf')
        .get(controllerInscricao.buscaPorCpf);

    app.route('/inscricao/lista/:pagina')
        .get(controllerEvento.listaEventos);

    app.route('/inscricao/:id')
        .get(controllerEvento.obtemEvento);

    app.route('/eventos')
        .post(verificaAutenticacao(['Admin', 'Editor']), controllerEvento.salvaEvento);

    app.route('/eventos/lista/:pagina')
        .get(verificaAutenticacao(['Usuario', 'Editor', 'Admin']), controllerEvento.listaEventos);

    app.route('/eventos/:id')
        .get(controllerEvento.obtemEvento)
        .delete(verificaAutenticacao(['Admin', 'Editor']), controllerEvento.removeEventos);

    app.route('/upload')
        .post(controllerEvento.fazUploadLogo);

    app.route('/upload/:idEvento')
        .get(controllerEvento.obtemLogo);

    //modelo de certificados
    app.route('/uploadsModelos')
        .post(verificaAutenticacao(['Admin', 'Editor']), controllerEvento.fazUploadCertificado);

    app.route('/uploadsModelos/:idEvento')
        .get(verificaAutenticacao, controllerEvento.obtemCertificado);

    app.route('/eventos/:id/:urlLogo')
        .post(verificaAutenticacao(['Editor', 'Admin']), controllerEvento.salvaUrlImagem);

    app.route('/api/registro')
        .post(controllerPessoa.salvaPessoa);
    // verificaAutenticacao(['Admin']),
    app.route('/api/login')
        .post(function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err)
                    return next(err);
                if (!user) {
                    console.log('erro 500');
                    return res.status(500).send(info.message);
                }

                req.logIn(user, function(err) {
                    if (err) {
                        return res.status(500).json({
                            err: 'Could not log in user'
                        });
                    }
                    res.status(200).json({
                        status: 'Login successful!'
                    });
                });

            })(req, res, next);
        });

    app.route('/api/logout/')
        .get(function(req, res) {
            req.logout();
            res.status(200).send('bye')
        });

    app.route('/*')
        .get(function(req, res) {
            res.redirect('/');
        });

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Pessoa.findById(id, function(err, user) {
            done(err, user);
        });
    });

};