const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
mongoose.connect('mongodb://localhost:27017/shopApp' , {useNewUrlParser: true , useUnifiedTopology:true})
.then(() => {
    console.log("Connected...");
}).catch( err => {
    console.log("There has been an error...");
    console.log(err);
})



const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    isOnsale:{
        type:Boolean,
        required:false
    }
})

const Product =  mongoose.model('Product' , productSchema);

const bike = new Product({name:'Mountain Bike' , price:599})
bike.save()
.then(data => {
    console.log("it is saved");
    console.log(data);
})
.catch(err => {
    console.log("you have some errors :(");
    console.log(err);
})
