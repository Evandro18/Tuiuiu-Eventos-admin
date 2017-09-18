angular.module('certificado').controller('AtividadeController',
    function($stateParams, $routeParams, $scope, $timeout, Evento, $filter) {

        $scope.evento = {};

        $scope.atividade = {};

        $scope.evento.atividades = [];

        $scope.pessoas = [];

        $scope.dataInicialAtividade = '';

        $scope.dataFinalAtividade = '';

        $scope.horaInicialAtividade = undefined;

        $scope.horaFinalAtividade = undefined;

        $scope.hide = true;

        $scope.hidePublico = false;

        $scope.integrantes = undefined;

        $scope.$watch("dataInicialAtividade", function(newvalue) {
            $scope.dataInicialAtividade = $filter("date")(newvalue, " dd MMM, yyyy");
        });

        $scope.$watch("dataFinalAtividade", function(newvalue) {
            $scope.dataFinalAtividade = $filter("date")(newvalue, " dd MMM, yyyy");
        });

        $scope.change = function() {
            console.log($scope.atividade.integrantes);
        }

        var carregaEvento = function() {
            if ($stateParams.id) {
                Evento.get({ id: $stateParams.id },
                    function(evento) {
                        $scope.evento = evento;
                        $scope.pessoas = evento.pessoas;
                        $(document).ready(function() {
                            $('select').material_select();
                        });
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

        $('#tipoAtividade').change(function() {
            if (this.value === "outro") {
                this.value = "";
                $scope.hide = false;
            } else {
                $scope.hide = true;
            }
        });

        $('#restricao').change(function() {
            if (this.value === "Privado") {
                $scope.hidePublico = true;
            } else {
                $scope.hidePublico = false;
            }
        });

        $scope.addNovaAtividade = function() {
            var novaAtividade = {
                nome: $scope.atividade.nome,
                quantidadeVagas: $scope.atividade.quantidadeVagas,
                cargaHoraria: $scope.atividade.cargaHoraria,
                descricao: $scope.atividade.descricao,
                tipo: $scope.atividade.tipo,
                restricaoAcesso: $scope.atividade.restricaoAcesso,
                integrantes: $scope.atividade.integrantes,
                dataInicialAtividade: new Date($scope.dataInicialAtividade),
                dataFinalAtividade: new Date($scope.dataFinalAtividade)
            };

            novaAtividade.dataInicialAtividade = converteData(novaAtividade.dataInicialAtividade, $scope.horaInicialAtividade.toString());
            novaAtividade.dataFinalAtividade = converteData(novaAtividade.dataFinalAtividade, $scope.horaFinalAtividade.toString());

            console.log(novaAtividade);
            if ($scope.evento.atividades === undefined) {
                $scope.evento.atividades = novaAtividade;
            } else {
                $scope.evento.atividades.push(novaAtividade);
                console.log($scope.evento.atividades);
                $('#fAtividade').each(function() {
                    this.reset();
                });
            }
        }

        var converteData = function(objtData, stringHora) {
            objtData.setHours(stringHora.substring(0, 2));
            objtData.setMinutes(stringHora.substring(3, 5));
            return objtData;
        }

        $scope.salva = function() {
            if (!angular.equals($scope.atividade, {})) {
                $scope.addNovaAtividade();
                $scope.evento.$save()
                    .then(
                        function(evento) {
                            $scope.mensagem = { texto: 'Salvo com sucesso.', sucesso: true };
                            _idEvento = evento._id;
                            carregaEvento();
                        },
                        function(erro) {
                            console.log(erro);
                            $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                        }
                    );
            }
        }
    });