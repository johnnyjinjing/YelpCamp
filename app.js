var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

var Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user');

var seedDB = require('./seeds');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

seedDB();

// passport config
app.use(
    require('express-session')({
        secret: 'ahdadhkadhsdashasd',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// routes
app.get('/', function(req, res) {
    res.render('landing');
});

// campground index page
app.get('/campgrounds', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds
            });
        }
    });
});

// post new campground
app.post('/campgrounds', function(req, res) {
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    };
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log('Create new Campground:');
            console.log(campground);
            res.redirect('/campgrounds');
        }
    });
});

// form to add a new campground
app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
});

// single campground
app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                res.render('campgrounds/show', { campground: campground });
            }
        });
});

// new comment form
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

// post a comment
app.post('/campgrounds/:id/comments/', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// auth routes
app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/register', function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds');
        });
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    function(req, res) {}
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, function() {
    console.log('The YelpCamp Server has started...');
});
