angular.module('certificado').controller('ModelosController',
    function($stateParams, $routeParams, $scope, $timeout, Evento, Upload) {

        $scope.evento = {};

        $scope.mCertificado = '';

        var carregaEvento = function() {
            if ($stateParams.id) {
                Evento.get({ id: $stateParams.id },
                    function(evento) {
                        $scope.evento = evento;
                    },
                    function(erro) {
                        $scope.mensagem = { texto: 'Evento não existe. Novo evento.', sucesso: false };
                        console.log(erro);
                    }
                );
            } else {
                $scope.evento = new Evento();
                $scope.nome = 'Novo evento';
            }
        }

        carregaEvento();

        $scope.salva = function() {
            //modelo do certificado
            $scope.evento.modeloCertificado = $scope.mCertificado.name;
            angular.forEach($scope.mCertificado, function(certificado) {
                $scope.evento.modeloCertificado.push(certificado.name);
            });
            $scope.evento.$save()
                .then(
                    function(evento) {
                        if ($scope.mCertificado.name) {
                            fazUploadCertificado(evento._id);
                        }
                        $scope.mensagem = { texto: 'Salvo com sucesso.', sucesso: true };
                        _idEvento = evento._id;
                        carregaEvento();
                    },
                    function(erro) {
                        console.log(erro);
                        $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                    }
                );
        };

        //UPLOAD DO MODELO DE CERTIFICADO
        function fazUploadCertificado(idEvento) {
            if ($scope.mCertificado.name != '') {
                $scope.mCertificado.upload = Upload.upload({
                    url: '/uploadsModelos',
                    data: { certificado: $scope.mCertificado, idEvento: idEvento }
                });
                $scope.mCertificado.upload.then(
                    function(resposta) {
                        console.log('Success ' + resposta + 'uploaded. Response: ' + resposta.data);
                    },
                    function(resposta) {
                        console.log('Error status: ' + resposta.status);
                        // if (resposta.status > 0) {
                        //     $scope.mensagem = { texto: "Erro ao tentar enviar o modelo de certificado ao servidor.", sucesso: false };
                        // }
                    },
                    function(evento) {
                        $scope.progressPercentage = parseInt(100.0 * evento.loaded / evento.total);
                        console.log('progress: ' + $scope.progressPercentage + '% ' + evento);
                    }
                );
            } else {
                console.log("Não Enviou o  Certificado");
            }
        };
    });