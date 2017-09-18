angular.module('certificado')
    .factory('meuInterceptor', function($location, $q, $state) {
        var interceptor = {
            responseError: function(resposta) {
                if (resposta.status == 401) {
                    $state.go('login');
                    // $location.path('/#!/login');
                }
                return $q.reject(resposta);
            }
        }
        return interceptor;
    });