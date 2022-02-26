

const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const {places , descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp' , {
    useNewUrlParser: true , 
    useUnifiedTopology:true

})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}


const seedDB = async () => {
    await Campground.deleteMany({})
    for( let i = 0 ; i < 400 ; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30 +10);
        const camp =  new Campground ({
            // this author is username id
            author:'620f5ecbe390e962b81a6ff7',
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos fugiat facere reprehenderit nisi inventore similique totam veritatis et, atque ratione est unde voluptas porro qui, laboriosam, voluptatibus dolores dolore! Dignissimos.\
    Iure magnam eligendi aut dolorum saepe ipsa consectetur minus officiis, sapiente quaerat non reprehenderit, odit deleniti obcaecati possimus quos soluta voluptates in fugit enim harum maiores! Corrupti quos sed doloribus.',
        price,
        geometry:{
            type: 'Point',
            coordinates: [ cities[random1000].longitude,
                            cities[random1000].latitude, ]
            },
        images:[
            {
                url : "https://res.cloudinary.com/dggghnwn9/image/upload/v1645693959/YelpCamp/fh7ukgfcyon8v1hq6toz.jpg",
                filename : "YelpCamp/ptmhauhugj0m2fczsypz"
             }
         ]
        })
        await camp.save()
    }
    
}

seedDB()
.then(() => {
    mongoose.connection.close()
})