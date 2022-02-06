const mongoose = require('mongoose');
// in place of mongoose.Schema  now we can put just Schema
const {Schema} =  mongoose;

mongoose.connect('mongodb://localhost:27017/relationshipDemo' , {useNewUrlParser: true , useUnifiedTopology:true})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const productSchema = new Schema({
    name:String,
    price:Number,
    season:{
        type:String,
        enum:['spring' , 'summer' , 'fall' , 'winter']
    }
})

const farmSchema = new Schema({
    name:String,
    city:String,
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]
})

const Product = mongoose.model('Product' , productSchema);
const Farm = mongoose.model('Farm' , farmSchema)

// Product.insertMany([
    //     {name:'Goddess Melon' , price:4.99 , season:'summer'},
//     {name:'Sugar Melon' , price:4.99 , season:'spring'},
//     {name:'Pear' , price:4.99 , season:'fall'}
// ])

const makeFarm = async () => {
    try {
        const farm = new Farm({name:'Small Farm' , city:"Radulesti"});
        const melon = await Product.findOne({name:'Goddess Melon'});
        farm.products.push(melon)
        await farm.save()
        console.log(farm); 
    } catch (error) {
        console.log(error);
    }
}

const addProduct = async () => {
    const farm = await Farm.findOne({name:'Small Farm'})
    const watermelon = await Product.findOne({name:'Sugar Melon'});
    farm.products.push(watermelon);
    await farm.save()
    console.log(farm);
}

addProduct();