$(document).ready(function() {
    $('ul.tabs').tabs();
});

//inicializa select
$(document).ready(function() {
    $('select').material_select();
});

//Inicializa dropdown
$('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false // Displays dropdown below the button
});

/**Calendario em portugues */
$('.datepicker').pickadate({
    language: 'pt-BR',
    monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    weekdaysLetter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Pronto',
    labelMonthNext: 'Próximo mês',
    labelMonthPrev: 'Mês anterior',
    labelMonthSelect: 'Selecione um mês',
    labelYearSelect: 'Selecione um ano',
    selectMonths: true,
    selectYears: 50,
    onSet: function(arg) {
        if ('select' in arg) {
            this.close();
        }
    }
});

window.scrollTo(0, 0);

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#image_upload_preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#inputFile").change(function() {
    readURL(this);
});