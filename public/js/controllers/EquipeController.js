angular.module('certificado').controller('EquipeController',
    function($stateParams, $routeParams, $scope, $timeout, Evento, $interval, $filter) {

        $scope.evento = {};

        $scope.evento.pessoas = [];

        $scope.estados = [];

        $scope.pessoa = {};

        var isCpf = false;

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
            isCpf = verificaCPF(cpf);
        }

        $scope.$watch("dataFinalAtividade", function(newvalue) {
            $scope.dataFinalAtividade = $filter("date")(newvalue, " dd MMM, yyyy");
        });

        var _idEvento = '';

        $scope.salva = function() {
            if (isCpf) {
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

    var verificaCPF = (strCpf) => {
        var resto;
        if (strCpf === "00000000000" || strCpf === "11111111111" || strCpf === "22222222222" || 
            strCpf === "33333333333" || strCpf === "44444444444" || strCpf === "55555555555" || 
            strCpf === "66666666666" || strCpf === "77777777777" || strCpf === "88888888888" || 
            strCpf === "99999999999") {
            return false;
        }

        resto = calculaRestoSoma(strCpf, 11, 9)
        console.log(`Resto: ${resto}`)
        
        if (!verificaDigito(resto, strCpf, strCpf.substring(9, 10))) {
             return false   
        }

        resto = calculaRestoSoma(strCpf, 12, 10)
        console.log(`Resto: ${resto}`)
        return verificaDigito(resto, strCpf, strCpf.substring(10, 11))
    }

    var verificaDigito = (resto, strCpf, digitoVerificador) => {
        resto = 11 - resto;
        if (resto > 9) {
            resto = 0;
        }

        if (resto != parseInt(digitoVerificador)) {
            return false;
        }
        return true
    }

    var calculaRestoSoma = (strCpf, numInicio, fimLaco) => {
        let soma = 0
        for (i = 1; i <= fimLaco; i++) {
            let digito = parseInt(strCpf.substring(i - 1, i))
            soma = soma + digito * (numInicio - i);
        }
        return soma % 11
    }