var express = require('express'),
    router = express.Router();

var Campground = require('../models/campground');

// INDEX - show all campgrounds
router.get('/', function(req, res) {
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

// CREATE - add new campground to DB
router.post('/', isLoggedIn, function(req, res) {
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
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

// NEW - show form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// SHOW - show more info about one campground
router.get('/:id', function(req, res) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
