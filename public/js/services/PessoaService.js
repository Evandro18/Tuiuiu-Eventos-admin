angular.module('certificado').factory('Pessoa', function($resource) {
    return $resource('/api/registro/');
});