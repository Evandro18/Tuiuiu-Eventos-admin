angular.module('certificado').controller('RegistroController',
    function($stateParams, $routeParams, $scope, Pessoa, $state) {

        $scope.pessoa = new Pessoa();

        // var carregaPessoas = function() {
        //     Eventos.query(null,
        //         function(pessoas) {
        //             $scope.pessoa = pessoas;
        //         },
        //         function(erro) {
        //             console.log("Não foi possível obter a lista de Eventos");
        //             console.log(erro);
        //         });
        // }

        // carregaPessoas();
        console.log("Registro Controller");

        $scope.salva = function() {
            console.log('salvando');
            $scope.pessoa.$save()
                .then(
                    function(resposta) {
                        console.log('Salvo com sucesso!');
                        if (resposta.status != 401) {
                            $scope.pessoa = new Pessoa();
                            $scope.mensagem = {
                                texto: 'Salvo com sucesso',
                                sucesso: true
                            }
                        } else {
                            $scope.mensagem = {
                                texto: 'Você não possui privilégios de administrador',
                                sucesso: false
                            }
                        }
                    },
                    function(erro) {
                        console.log(erro);
                        $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                    }
                );
        }

    });