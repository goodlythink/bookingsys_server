const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


const faculty = require('./controllers/faculty');
const depart = require('./controllers/depart');

module.exports = function (app) {

    app.get('/', requireAuth, function (req, res) {
        res.send({ message: 'Success' })
    });

    /*
    app.get('/', function (req, res) {
        res.send({ message: 'Super secret code is ABC123' });
    })
    */

    app.post('/signin', requireSignin, Authentication.signin);

    //app.post('/signup', Authentication.signup);

    /*========= Faculty ==========*/
    app.get('/facultys', requireAuth, faculty.list);
    app.post('/faculty', requireAuth, faculty.save);
    app.get('/faculty/delete/:id', requireAuth, faculty.delete);
    app.get('/faculty/:id', requireAuth, faculty.detail);

    /*========= Depart ==========*/
    app.get('/departs', requireAuth, depart.list);
    app.post('/depart', requireAuth, depart.save);
    app.get('/depart/delete/:id', requireAuth, depart.delete);
    app.get('/depart/:id', requireAuth, depart.detail);
}