var mongoose = require('mongoose');

var Campground = require('./models/campground');
var Comment = require('./models/comment');

var campgrounds = [
    {
        name: 'Campground 1',
        image: 'https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg',
        description: 'First campground'
    },
    {
        name: 'Campground 2',
        image: 'https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg',
        description: 'Second campground'
    },
    {
        name: 'Campground 3',
        image: 'https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg',
        description: 'Third campground'
    }
];

function seedDB() {
    // remove all Campground
    Campground.remove({}, function(err) {
        // if (err) {
        //     console.log(err);
        // } else {
        //     console.log('Campground cleaned!');
        //     // add dummy campgrounds
        //     campgrounds.forEach(function(campground) {
        //         Campground.create(campground, function(err, campground) {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log('Campground added!');
        //                 Comment.create(
        //                     {
        //                         text: 'This is a comment',
        //                         author: 'Author 1'
        //                     },
        //                     function(err, comment) {
        //                         if (err) {
        //                             console.log(err);
        //                         } else {
        //                             campground.comments.push(comment);
        //                             campground.save();
        //                             console.log('Comment added!');
        //                         }
        //                     }
        //                 );
        //             }
        //         });
        //     });
        // }
    });
}

module.exports = seedDB;
