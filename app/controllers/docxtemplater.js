var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
const unoconv = require('unoconv')
var buf = new Buffer(5)
const download = './download'
    //Load the docx file as a binary
module.exports.gerador = function(pastaEvento, caminhoEntrada, body) {
    downEvento = pastaEvento
    const caminhoPdf = downEvento + '/pdfs'
    var content = fs
        .readFileSync(downEvento + '/' + caminhoEntrada, 'binary');
    var executePdf = function() {
        if (!fs.existsSync(caminhoPdf)) {
            fs.mkdirSync(caminhoPdf)
        }
        child = exec('soffice --headless --convert-to pdf ' + downEvento + '/*docx --outdir ' + caminhoPdf)
        return execute(child)
    }

    for (var i = 0; i < body.dados.length; i++) {
        var zip = new JSZip(content);
        substituiVariaveis(zip, body.dados[i])
    }
    return executePdf()
}

var formataDescricao = function(inscrito) {
    var textoDescricao = "";
    var responsaveis = "";
    inscrito.eventos[0].atividades.forEach(function(atividade) {
        textoDescricao += atividade.descricao + "\n";
        responsaveis += atividade.integrantes + ", ";
    });
    return [textoDescricao, responsaveis];
}

var somaCargaHoraria = function(inscrito) {
    var total = 0;
    inscrito.eventos[0].atividades.forEach(function(atividade) {
        total += atividade.cargaHoraria;
    }, this);
    return total;
}

var substituiVariaveis = function(zip, inscrito) {
    var doc = new Docxtemplater()
    doc.loadZip(zip);
    //set the templateVariables
    doc.setData({
        nomePessoa: inscrito.nome,
        localNascimento: inscrito.cidade,
        cpfPessoa: inscrito.cpf,
        dataFinalEvento: inscrito.eventos[0].dataFinal,
        nomeEvento: inscrito.eventos[0].nome,
        dataInicialEvento: inscrito.eventos[0].dataInicial,
        responsavelAtividade: formataDescricao(inscrito)[0],
        cargaHoraria: somaCargaHoraria(inscrito),
        descricaoAtividades: formataDescricao(inscrito)[1]
    })

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    } catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }
    buf = doc.getZip()
    var bufContent = buf.generate({ type: 'nodebuffer' })
    var caminhoDocx = downEvento + '/' + inscrito.nome.replace(/ /g, '') + ".docx";
    fs.writeFileSync(caminhoDocx, bufContent)
}

function execute(child) {
    return new Promise((resolve, reject) => {
        child.addListener("error", reject)
        child.addListener("exit", resolve)
    })
};

module.exports.zipArquivos = function(caminhoPasta) {
    var zip = new JSZip()
    var files = fs.readdirSync(caminhoPasta)
    for (var i = 0; i < files.length; i++) {
        console.log(files[i])
        var conteudo = fs.readFileSync(caminhoPasta + '/' + path.basename(files[i]))
        zip.folder('certificados').file(files[i], conteudo)
    }
    return zip.generate({ type: 'nodebuffer' })
}