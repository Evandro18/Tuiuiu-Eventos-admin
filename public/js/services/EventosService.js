angular.module('certificado').factory('Eventos', function($resource) {
    // Ligação entre o AngularJS e os RESTful endpoints do Express de CRUD de avaliação
    return $resource('http://localhost:3300/eventos/lista/:pagina', { pagina: '@pagina' });
});