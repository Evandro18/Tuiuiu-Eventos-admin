angular.module('certificado').controller('EventoController',
    function($stateParams, $routeParams, $scope, $timeout, Evento, Upload, $state, imgur, $filter) {

        //Chave da API para setar imagens no imgur
        imgur.setAPIKey('Client-ID a0628ed9d9d3115');

        $scope.requerido = true;

        $scope.logo = '';

        $scope.evento = {};

        $scope.evento.pessoas = [];

        $scope.pessoa = {};

        $scope.$watch("evento.dataInicial", function(newvalue) {
            $scope.evento.dataInicial = $filter("date")(newvalue, " dd MMM, yyyy");
        });

        $scope.$watch("evento.dataFinal", function(newvalue) {
            $scope.evento.dataFinal = $filter("date")(newvalue, " dd MMM, yyyy");
        });

        var carregaEvento = function() {
            if ($stateParams.id) {
                Evento.get({ id: $stateParams.id },
                    function(evento) {
                        $scope.evento = evento;
                    },
                    function(erro) {
                        $scope.mensagem = { texto: 'Evento não existe. Novo evento.', sucesso: false };
                        console.log(erro);
                    }
                );
            } else {
                $scope.evento = new Evento();
                $scope.nome = 'Novo evento';
            }
        }

        carregaEvento();
        console.log("Evento Controller");

        function salvaImagem() {
            if ($scope.logo != '') {
                imgur.upload($scope.logo).then(function then(model) {
                    $scope.evento.urlLogo = model.link;
                    console.log("link: " + model.link + " linkSalvo: " + $scope.evento.urlLogo);
                    $scope.evento.$urlsave()
                        .then(
                            function(resposta) {
                                console.log(resposta);
                            })
                        .catch(
                            function(erro) {
                                console.log(erro);
                            });
                });
            }
        }

        $scope.salva = function() {
            $scope.evento.logo = '';
            $scope.evento.logo = $scope.logo.name;
            console.log($scope.evento);
            $scope.evento.$save()
                .then(
                    function(evento) {
                        salvaImagem();
                        $scope.mensagem = { texto: 'Salvo com sucesso.', sucesso: true };
                        _idEvento = evento._id;
                        $stateParams.id = _idEvento;
                        console.log($stateParams);
                        $state.go("eventosDetalhes.equipe", { id: _idEvento });
                    },
                    function(erro) {
                        console.log(erro);
                        $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                    }
                );
        }

        function fazUploadLogo(idEvento) {
            if ($scope.logo) {
                $scope.logo.upload = Upload.upload({
                    url: '/upload',
                    data: { logo: $scope.logo, idEvento: idEvento }
                });

                $scope.logo.upload.then(
                    function(resposta) {
                        $timeout(function() {
                            $scope.logo.resultado = resposta.data;
                        });
                    },
                    function(resposta) {
                        if (resposta.status > 0) {
                            $scope.mensagem = { texto: "Erro ao tentar enviar a logo ao servidor.", sucesso: false };
                        }
                    },
                    function(evento) {
                        $scope.logo.progresso = Math.min(100, parseInt(100.0 * evento.loaded / evento.total));
                    }
                );
            }
        };
    });