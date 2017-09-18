angular.module('certificado').controller('EquipeController',
    function($stateParams, $routeParams, $scope, $timeout, Evento, $interval, $filter) {

        $scope.evento = {};

        $scope.evento.pessoas = [];

        $scope.estados = [];

        $scope.pessoa = {};

        var verificaCpf = false;

        $scope.listaEstados = estados;

        for (estado in estados) {
            $scope.estados.push(estado);
        }

        $scope.pessoa.estado = $scope.estados[0];

        $scope.cidades = [];

        $scope.dataNascimento = '';

        $scope.mudaEstado = function(estado) {
            $scope.cidades = $scope.listaEstados[estado];
            $(document).ready(function() {
                $('select').material_select();
            });
        }

        $scope.$watch("dataNascimento", function(newvalue) {
            $scope.dataNascimento = $filter("date")(newvalue, " dd MMM, yyyy");
        });

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
            }
        }

        carregaEvento();

        console.log("Equipe Controller");

        $scope.addNovaPessoa = function() {
            var novaPessoa = {
                nome: $scope.pessoa.nome,
                cpf: $scope.pessoa.cpf,
                email: $scope.pessoa.email,
                naturalidade: $scope.pessoa.naturalidade,
                estado: $scope.pessoa.estado,
                nacionalidade: $scope.pessoa.nacionalidade,
                dataNascimento: new Date($scope.dataNascimento),
                sobre: $scope.pessoa.sobre,
                funcao: $scope.pessoa.funcao
            };
            if ($scope.evento.pessoas == undefined) {
                $scope.evento.pessoas = novaPessoa;
            } else {
                $scope.evento.pessoas.push(novaPessoa);
                $('#fEquipe').each(function() {
                    this.reset();
                });
            }

        }

        $scope.validacpf = function() {
            var cpf = $scope.pessoa.cpf.replace(/\./g, '').replace(/\-/g, '');
            verificaCpf = VerificaCPF(cpf);
        }

        $scope.$watch("dataFinalAtividade", function(newvalue) {
            $scope.dataFinalAtividade = $filter("date")(newvalue, " dd MMM, yyyy");
        });

        var _idEvento = '';

        $scope.salva = function() {
            if (verificaCpf) {
                $scope.addNovaPessoa();
            }
            $scope.evento.$save()
                .then(
                    function(evento) {
                        $scope.mensagem = { texto: 'Salvo com sucesso.', sucesso: true };
                        _idEvento = evento._id;
                        carregaEvento();
                    },
                    function(erro) {
                        console.log(erro);
                        $scope.mensagem = { texto: 'Ocorreu um erro ao tentar salvar o evento.', sucesso: false };
                    }
                );

        }
    });

function VerificaCPF(strCpf) {

    var soma;
    var resto;
    soma = 0;
    if (strCpf == "00000000000") {
        return false;
    }

    for (i = 1; i <= 9; i++) {
        soma = soma + parseInt(strCpf.substring(i - 1, i)) * (11 - i);
    }

    resto = soma % 11;

    if (resto == 10 || resto == 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }

    if (resto != parseInt(strCpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (i = 1; i <= 10; i++) {
        soma = soma + parseInt(strCpf.substring(i - 1, i)) * (12 - i);
    }
    resto = soma % 11;

    if (resto == 10 || resto == 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }

    if (resto != parseInt(strCpf.substring(10, 11))) {
        return false;
    }

    return true;
}