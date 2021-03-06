var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override');

// Models
var Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user');

// Routes
var indexRoutes = require('./routes/index'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments');

// DB
var seedDB = require('./seeds');
mongoose.Promise = global.Promise;
var databaseUrl =
    process.env.YELPCAMP_DATABASE_URL || 'mongodb://localhost/yelp_camp';

mongoose.connect(databaseUrl, { useMongoClient: true });

var port = process.env.PORT || 3000;

// seedDB(); // seed DB
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// passport config
app.use(
    require('express-session')({
        secret: process.env.YELPCAMP_PASSPORT_KEY,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// global
app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments/', commentRoutes);

app.listen(port, function() {
    console.log('The YelpCamp server has started on port ' + port);
});
