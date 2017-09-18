angular.module('certificado').factory('Login', function($resource) {
    return $resource('/api/login/');
});