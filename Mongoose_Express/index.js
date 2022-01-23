const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopApp' , {useNewUrlParser: true , useUnifiedTopology:true})
.then(() => {
    console.log("Connected...");
}).catch( err => {
    console.log("There has been an error...");
    console.log(err);
})

app.set('views' ,  path.join(__dirname ,  'views'));
app.set('view engine' , 'ejs');



app.listen(3000 , () => {
    console.log("APP IS LISTENING TO PORT 3000....");
})