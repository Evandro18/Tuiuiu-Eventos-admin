var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

    var User = require('../app/models/pessoa');

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'senha'
        },
        function(username, password, done) {
            User.findOne({ nome: username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(senha)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    return passport;
}