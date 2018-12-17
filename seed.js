const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")

const data = [
    {
        name: "Cloud's Rest",
        image: "https://www.campsitephotos.com/photo/camp/22064/feature_Faria_County_Beach_Park-f3.jpg",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium aut sequi laborum quis voluptas ad eos nulla, beatae repudiandae ex quam voluptatibus numquam, rerum eligendi inventore vitae veritatis ab facilis."
    },
    {
        name: "Grand Tetton",
        image: "https://www.campsitephotos.com/photo/camp/71055/feature_Gros_Ventre-f1.jpg",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium aut sequi laborum quis voluptas ad eos nulla, beatae repudiandae ex quam voluptatibus numquam, rerum eligendi inventore vitae veritatis ab facilis."
    },
    {
        name: "Sea Park",
        image: "https://www.campsitephotos.com/photo/camp/35403/feature_Lake_Manatee_State_Park-f3.jpg",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium aut sequi laborum quis voluptas ad eos nulla, beatae repudiandae ex quam voluptatibus numquam, rerum eligendi inventore vitae veritatis ab facilis."
    }
];

function seedDb() {
    //remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) console.log(err);
        console.log("Removed Campgrounds!");
    });
    //add a few campgrounds
    data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
            if (err) console.log(err);
            console.log("added a campground");
            Comment.create({
                text: "This place is great but I wish there was internet",
                author: "Homer"
            }, (err, comment) => {
                if (err) console.log(err);
                campground.comments.push(comment);
                campground.save();
                console.log("Created new comment");
            });
        });
    });

    //add a few comments
}

module.exports = seedDb;