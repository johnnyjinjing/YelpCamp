var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgrounds = [
    {
        name: "something",
        image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg"
    },
    {
        name: "something",
        image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"
    },
    {
        name: "something",
        image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"
    }
];

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds_new");
});

app.listen(3000, function() {
    console.log("The YelpCamp Server has started...");
});
