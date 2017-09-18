var http = require('http');
var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var busboyBodyParser = require('busboy-body-parser');
var flash = require('connect-flash');
var connect = require('connect');
var session = require('express-session');
var passport = require('passport');

module.exports = function() {

    var app = express();

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.set('port', 3300);

    //middleware
    app.use(express.static('./public'));
    app.set('view engine', 'ejs');
    app.set('views', '../app/views/');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(require('method-override')());
    app.use(busboyBodyParser());
    app.set('trust proxy', 1) // trust first proxy 
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    load('models', { cwd: 'app' })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
}