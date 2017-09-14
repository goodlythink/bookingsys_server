const passport = require('passport');
//const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//mockup
const user = {
    id: 101
}

// Create Local strategy
const localOptions = { usernameField: 'username', passwordField:'password', passReqToCallback: true };
const localLogin = new LocalStrategy(localOptions, function (req, username, password, done) {

    // Verify this username and password, call done with the user
    // if it is the correct username and password
    // otherwise, call done with false

    req.getConnection(function (err, connection) {
        connection.query('select id from user where username=?', [username], function (err, user) {
            if (err) return done(err);

            if (user.length > 0) {
                //console.log('localLogin username=>', username, 'password=>', password, 'req.phone=>', req.body.phone);
                //console.log('user', user[0].id)
                return done(null, user[0]);
            } else {
                //console.log('done', done);
                const user = {
                    invalid: true
                }
                //return done(null, false, { message: 'Incorrect User.' });
                return done(null, user);
            }
        });
    });
});

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    //jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config.secret,
    passReqToCallback: true
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (req, payload, done) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with the other
    // Otherwise, call done without a user object

    /*
    User.findById(payload.sub, function (err, user) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    })
    */

    console.log('jwtLogin', payload);
    //done(null , user);
    //done(new Error("User not found"), null);
    //done(null, false, {message: 'Login expire !!'});
    //return res.json(200, "wrong password");
    const user = {
        invalidToken: false
    }

    done(null, user);
});

// Tell passport to use the strategy
passport.use(jwtLogin)
passport.use(localLogin);