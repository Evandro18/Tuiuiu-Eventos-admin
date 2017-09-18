angular.module('certificado').controller('LoginController',
    function($stateParams, $routeParams, $scope, Login, $state) {

        $scope.login = new Login();

        console.log("Login Controller");

        $scope.logar = function() {
            console.log('salvando');
            $scope.login.$save()
                .then(
                    function(resposta) {
                        console.log(resposta);
                        if (resposta.status != 500) {
                            $state.go('eventos');
                        }
                    },
                    function(erro) {
                        console.log(erro);
                        $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                        alert('Ocorreu um erro, por favor verifique os dados informados')
                    }
                );
        }

    });