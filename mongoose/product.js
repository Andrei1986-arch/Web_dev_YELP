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
        required:true,
        maxlength: 20
    },
    price:{
        type:Number,
        required:true,
        min: [0.01 , 'Price must pe positive!']
    },
    isOnsale:{
        type:Boolean,
        required:false
    },
    categories:[String],
    qty: {
        online:{
            type:Number,
            default:0
        },
        inStore:{
            type:Number,
            default:0
        }
    },
    size:{
        type:String,
        enum:['S' , 'M' , 'L']
    }
})



// const bike = new Product({name:'Jersey' , price:6.99 , categories:['Cycling'] , size:'S' , isOnsale: true})
// bike.save()
// .then(data => {
//     console.log("it is saved");
//     console.log(data);
// })
// .catch(err => {
//     console.log("you have some errors :(");
//     console.log(err);
// })

productSchema.methods.greet = function() {
    console.log("hyyyyyyyy");
    console.log(`This ${this.name} is for you`);
}

//add on methods to the schema that you can call this function on any product
productSchema.methods.toggleOnSale = function () {
    this.isOnsale = !this.isOnsale;
    return this.save();
}

productSchema.statics.fireSale = function() {
   return this.updateMany({} , {isOnsale: true , price: 1})
}

// !!!!!!!!!!!!!!!!!!!!!!   AFTER SCHEMA
const Product =  mongoose.model('Product' , productSchema);



const findProduct = async () => {
    const foundProduct = await Product.findOne({name:"Jersey"})
    console.log(foundProduct);
    foundProduct.greet()
    await foundProduct.toggleOnSale();
}

Product.fireSale().then(res => console.log(res))

//findProduct()

// Product.findOneAndUpdate({name:'Jersey'} , {price: 35 , isOnsale:true} , {new: true , runValidators:true})
// .then(data => {
//     console.log("it is saved");
//     console.log(data);
// })
// .catch(err => {
//     console.log("you have some errors :(");
//     console.log(err);
// })