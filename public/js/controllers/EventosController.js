angular.module('certificado').controller('EventosController',
    function($window, $scope, Eventos, Evento, $resource) {

        $scope.eventos = [];
        $scope.imagens = [];

        $scope.filtro = '';

        $scope.pagina = 1;

        function buscaEventos() {
            Eventos.query({ pagina: $scope.pagina },
                function(eventos) {
                    $scope.eventos = eventos;
                    console.log(eventos);
                },
                function(erro) {
                    console.log("Não foi possível obter a lista de Eventos");
                    console.log(erro);
                });
        };

        buscaEventos();

        $scope.proxima = function() {
            $scope.pagina = $scope.pagina + 1;
            buscaEventos();
        }

        $scope.anterior = function() {
            $scope.pagina = $scope.pagina - 1;
            buscaEventos();
        }

        $scope.recarrega = function() {
            $window.location.reload()
        }

        $scope.remove = function(evento) {
            if ($window.confirm('Deseja realmente remover este evento?')) {
                Evento.delete({ id: evento._id },
                    $scope.recarrega(),
                    function(erro) {
                        console.log(erro);
                        $scope.mensagem = { texto: 'Não foi possível remover o evento' };
                    }
                );
            }
        };
    });