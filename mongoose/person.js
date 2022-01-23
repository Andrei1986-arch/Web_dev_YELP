const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
mongoose.connect('mongodb://localhost:27017/shopApp' , {useNewUrlParser: true , useUnifiedTopology:true})
.then(() => {
    console.log("Connected...");
}).catch( err => {
    console.log("There has been an error...");
    console.log(err);
})

const personSchema = new mongoose.Schema({
    first:String,
    last:String
})

personSchema.virtual('fullName').get(function () {
    return `${this.first} ${this.last}`
})

const Person = mongoose.model('Person' , personSchema);