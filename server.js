var http = require('http');
var app = require('./config/express')();

 require('./config/database.js')('mongodb://tuiuiu:tuiuiu@cluster0-shard-00-00-mbkcn.mongodb.net:27017,cluster0-shard-00-01-mbkcn.mongodb.net:27017,cluster0-shard-00-02-mbkcn.mongodb.net:27017/Cluster0?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
//require('./config/database.js')('mongodb://localhost/eventos');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server escutando na porta ' + app.get('port'));

});
