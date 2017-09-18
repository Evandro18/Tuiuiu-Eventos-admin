angular.module('certificado').controller('LogoutController',
    function($window, $scope, $resource) {

        Logout = $resource('http://localhost:3300/api/logout')

        Logout.get(null,
            function(resposta) {
                console.log(resposta)
                $window.location.reload();
            },
            function(erro) {
                console.log(erro)
            })

        // $scope.logout = function() {
        //     $window.open('http://localhost/api/logout')
        // }

        // $scope.logout()
    })