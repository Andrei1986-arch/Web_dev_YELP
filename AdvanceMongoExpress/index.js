const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Product = require('./models/product');
const Farm = require('./models/farm')
const AppError = require('./views/AppError');
//const farmRoutes = require('./routes/farms')


mongoose.connect('mongodb://localhost:27017/farmStand2' , {useNewUrlParser: true , useUnifiedTopology:true})
.then(() => {
    console.log("Connected...");
}).catch( err => {
    console.log("There has been an error...");
    console.log(err);
})

app.set('views' ,  path.join(__dirname ,  'views'));
app.set('view engine' , 'ejs');

//app.use('/farms' , farmRoutes);
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));



//FARM ROUTES

app.get('/farms' , async(req , res) => {
    const farms = await Farm.find({});
    res.render('farms/index' , {farms})
})

app.get('/farms/new' , (req , res) => {
    res.render('farms/new')
})

app.get('/farms/:id' , async(req , res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    res.render('farms/show' , {farm})
})


app.post('/farms' , async(req , res) => {
    const farm = new Farm(req.body)
    await farm.save();
    res.redirect('/farms')
})

app.get('/farms/:id/products/new' , async (req , res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new' , {categories , farm})
})

app.post('/farms/:id/products' , async (req , res ) => {
    const {id} = req.params;
    const farm = await Farm.findById(id)
    const {name , price , category} = req.body;
    const product = new Product({name , price , category})
    farm.products.push(product);
    product.farm =  farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`)
})

app.delete('/farms/:id' , async (req , res) => {
    const {id} = req.params;
    const deletedFarm = await Farm.findByIdAndDelete(id);
    res.redirect('/farms')
})



//**************************************************************************************** */
// PRODUCT ROUTES

const categories = ['fruit' , 'vegetable' , 'dairy' , 'fungi'];

app.get('/products' , async (req , res) => {
    const {category} = req.query;
    if(category){
        const products = await Product.find({category})
        res.render('products/index' , {products , category})
    } else {
        const products = await Product.find({})  
        res.render('products/index' , {products , category: "All"})
    }
})

app.get('/products/new' , (req , res) => {
    // in this case err should be conditional / ex: only admins can add prod
    //throw new AppError('NOT ALLOWED' , 401)
    res.render('products/new' , {categories})
})

app.post('/products' , async (req , res , next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/products/${newProduct._id}`)      
    } catch (error) {
       next(error) 
    }
})

// it is used to replace try/ catch and not to be required to do it for evry route
// now you just wrap it 
function wrapAsync(fn) {
    return function(req , res , next){
        fn(req , res , next).catch(e => next(e))
    }
}

// ex just for "show page"
app.get('/products/:id' , wrapAsync(async (req , res , next) => {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.render('products/show' , {product})      
}))

app.get('/products/:id/edit' , async (req , res , next) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.render('products/edit' , {product , categories})
    } catch (error) {   
        return  next( new AppError('product not found' , 404) );
    }
}) 

app.put('/products/:id' , async(req , res , next) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id , req.body , {runValidators: true , new:true})
        res.redirect(`/products/${product._id}`)
    } catch (error) {
        next(error)
    }
})
app.delete('/products/:id' , async(req, res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.redirect('/products');  
})

app.get('/' , (req, res) => {
    res.render('home.ejs')
})

// ERROR HANDLING HAS TO PE AT THE END OF EXPRESS APP / AFTER ROUTERS

//mongoose error handling
app.use((err , req , res , next) => {
    console.log(err.name);
    next(err);
})

// error handling 
app.use((err, req , res , next) => {
    const {status = 500 , message ="Some error here"} = err;
    res.status(status).send(message)
})


app.listen(3000 , () => {
    console.log("APP IS LISTENING TO PORT 3000....");
})