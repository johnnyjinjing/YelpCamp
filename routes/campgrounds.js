var express = require('express'),
    router = express.Router();

var Campground = require('../models/campground');

var middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds,
                page: 'campgrounds'
            });
        }
    });
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
    var campground = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create(campground, function(err, campground) {
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
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// SHOW - show more info about one campground
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(err, campground) {
            if (err || !campground) {
                req.flash('error', 'Campground not found.');
                res.redirect('back');
            } else {
                res.render('campgrounds/show', { campground: campground });
            }
        });
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(
    req,
    res
) {
    Campground.findById(req.params.id, function(err, campground) {
        if (error) {
            req.flash('error', 'Campground not found.');
        } else {
            res.render('campgrounds/edit', { campground: campground });
        }
    });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        campground
    ) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
