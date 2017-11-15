var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var Campground = require("./models/campground"),
    Comment = require("./models/comment");

var seedDB = require("./seeds");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

app.post("/campgrounds", function(req, res) {
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    };
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log("Create new Campground:");
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", { campground: campground });
            }
        });
});

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments/", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log("The YelpCamp Server has started...");
});
