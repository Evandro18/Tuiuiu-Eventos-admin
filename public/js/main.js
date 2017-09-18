angular.module('certificado', ['ngRoute', 'ngResource', 'ngFileUpload', 'ngMask', 'ui.router', 'ngImgur', 'ncy-angular-breadcrumb'])
    .config(function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $breadcrumbProvider) {

        $httpProvider.interceptors.push('meuInterceptor');

        $breadcrumbProvider.setOptions({
            template: '<div class="breadcrumb">Evento<span ng-repeat="step in steps" class="breadcrumb"> > {{step.ncyBreadcrumbLabel}}</span></div>'
        });

        $stateProvider
            .state('eventos', {
                url: '/eventos',
                templateUrl: 'partials/eventos.html',
                controller: 'EventosController'
            })
            .state('eventosDetalhes', {
                url: '/eventos/:id',
                templateUrl: 'partials/central.html',
                ncyBreadcrumb: {
                    skip: true
                },
                controller: function($scope, $state, $stateParams) {
                    $scope.params = $stateParams;
                    $scope.go = function() {
                        $state.go('eventosDetalhes.evento', { $stateParams });
                    };
                    $scope.go();
                }
            })
            .state('novo', {
                url: '/#!eventos',
                templateUrl: 'partials/central.html',
                controller: function($scope, $state, $stateParams) {
                    $scope.params = $stateParams;
                    $scope.go = function() {
                        $state.go('eventosDetalhes.evento', { id: null });
                    };

                    $scope.go();
                }
            })
            .state('eventosDetalhes.evento', {
                url: '/evento',
                templateUrl: 'partials/evento.html',
                controller: 'EventoController',
                ncyBreadcrumb: {
                    label: 'Dados Gerais'
                }
            })
            .state('eventosDetalhes.atividade', {
                url: '/atividades',
                templateUrl: 'partials/atividade.html',
                controller: 'AtividadeController',
                ncyBreadcrumb: {
                    label: 'Atividades'
                }
            })
            .state('eventosDetalhes.equipe', {
                url: '/equipe',
                templateUrl: 'partials/equipe.html',
                controller: 'EquipeController',
                ncyBreadcrumb: {
                    label: 'Equipe'
                }
            })
            .state('eventosDetalhes.modeloCertificado', {
                url: '/modelos',
                templateUrl: 'partials/modeloCertificado.html',
                controller: 'ModelosController',
                ncyBreadcrumb: {
                    label: 'Modelo de Certificado'
                }
            })
            .state('listaDeInscritos', {
                url: '/listaDeInscritos/:id',
                templateUrl: 'partials/listaDeInscritos.html',
                controller: 'ListaInscritosController'
            })
            .state('manual', {
                url: '/manual',
                templateUrl: 'partials/manual.html'
            })
            .state('registro', {
                url: '/registro',
                templateUrl: 'partials/registro.html',
                controller: 'RegistroController'
            })
            .state('login', {
                url: '/',
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            })


        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });

    });