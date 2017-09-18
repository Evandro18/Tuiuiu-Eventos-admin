angular.module('certificado').controller('ListaInscritosController',
    function($stateParams, $routeParams, $scope, $timeout, ListaInscritos) {

        $scope.evento = new ListaInscritos();

        $scope.filtroAtividades = "";

        $scope.dadosEvento = {};

        $scope.atividades = [];

        $scope.ativo = true;

        $scope.atividadeEmFoco = undefined;

        $scope.inscritosSelecionados = [];

        $scope.atividadesSelecionadas = [];

        $scope.statusAtividade = true;

        $scope.evento.id = '';

        $scope.filtraAtividades = function(atividade) {
                $scope.filtroAtividades = atividade;
                console.log($scope.filtroAtividades);
                $scope.atividadeEmFoco = atividade;
                // desabilitaInscritos(id);
            }
            // TODO: Voltar ao método de impressão por atividades e deletar as atividades não feitas diretamente no DOCUMENTO de cada inscrito!
        var carregaEvento = function() {
            if ($stateParams.id) {
                ListaInscritos.get({ tipo: 'lista', id: $stateParams.id },
                    function(listaInscritos) {
                        $scope.dadosEvento = listaInscritos;
                        console.log($scope.dadosEvento);
                        $scope.atividades = $scope.dadosEvento.evento.atividades;
                        $scope.filtroAtividades = $scope.dadosEvento.evento.atividades[0]._id;
                        $scope.atividadeEmFoco = $scope.atividades[0]._id;
                        $scope.evento.id = $scope.dadosEvento.evento._id;
                        $scope.atividades = $scope.dadosEvento.evento.atividades;
                    },
                    function(erro) {
                        $scope.mensagem = { texto: 'Evento não existe. Novo evento.', sucesso: false };
                        console.log(erro);
                    }
                );
            }
        }
        carregaEvento();

        var contemItem = function(objeto, lista) {
            for (var i = 0; i < lista.length; i++) {
                if (objeto._id === lista[i]._id) {
                    return i;
                }
            }
            return -1;
        }

        $scope.selecionaAtividades = function(status, atividade) {
            var indice = contemItem($scope.inscritoEmFoco, $scope.dadosEvento.dadosInscritos);
            var indiceAtividade = contemItem(atividade, $scope.dadosEvento.dadosInscritos[indice].eventos[0].atividades);
            if (indice > -1) {
                if (status && indiceAtividade === -1) {
                    $scope.dadosEvento.dadosInscritos[indice].eventos[0].atividades.push(atividade);
                }
                if (!status && indiceAtividade != -1) {
                    $scope.dadosEvento.dadosInscritos[indice].eventos[0].atividades.splice(indiceAtividade, 1);
                }
            }
            console.log($scope.dadosEvento.dadosInscritos[indice].eventos[0].atividades);
        }

        $scope.selecionainscritos = function(ativo, inscrito) {
            if (confirm("Tem certeza que deseja excluir dessa lista ?") === true) {
                for (var i = 0; i < inscrito.eventos[0].atividades.length; i++) {
                    if ($scope.atividadeEmFoco._id === inscrito.eventos[0].atividades[i]._id) {
                        inscrito.eventos[0].atividades.splice(i, 1);
                    }
                }
            }
        }

        $scope.salva = function() {
                $scope.evento.dados = $scope.dadosEvento.dadosInscritos;
                $scope.evento.$save({ tipo: 'geraCertificado' })
                    .then(
                        function(resposta) {
                            console.log(resposta)
                            window.open('http://localhost:3300/download')
                            alert('baixado com sucesso')
                        },
                        function(erro) {
                            console.log(erro);
                            $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                        }
                    );
            }
            // }
    });