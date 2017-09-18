angular.module('certificado').factory('ListaInscritos', function($resource) {
    return $resource('/api/certificado/:tipo/:id')
})