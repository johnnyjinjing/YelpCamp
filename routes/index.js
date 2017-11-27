var express = require('express'),
    router = express.Router();

var passport = require('passport');

var User = require('../models/user');

// root router
router.get('/', function(req, res) {
    res.render('landing');
});

// registration
router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    var user = new User({ username: req.body.username });
    User.register(user, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome, ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});

// log in
router.get('/login', function(req, res) {
    res.render('login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    function(req, res) {}
);

// log out
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have successfully logged out.');
    res.redirect('/campgrounds');
});

module.exports = router;
