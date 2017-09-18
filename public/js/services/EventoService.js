angular.module('certificado').factory('Evento', function($resource) {
    // Ligação entre o AngularJS e os RESTful endpoints do Express de CRUD de avaliação
    return $resource('/eventos/:id/:urlLogo', null, {
        'urlsave': { method: 'POST', params: { id: '@_id', urlLogo: '@urlLogo' } }
    });
});