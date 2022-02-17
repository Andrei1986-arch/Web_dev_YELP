const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Product = require('./models/product');
const AppError = require('./views/AppError');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash');


mongoose.connect('mongodb://localhost:27017/farmStand' , {useNewUrlParser: true , useUnifiedTopology:true})
.then(() => {
    console.log("Connected...");
}).catch( err => {
    console.log("There has been an error...");
    console.log(err);
})

app.set('views' ,  path.join(__dirname ,  'views'));
app.set('view engine' , 'ejs');

//session implement
const sessionOptions = {secret : 'notagoodsecret' , resave: false , saveUninitialized: false}
app.use(session(sessionOptions))
app.use(cookieParser('mysecret'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

//flash use
//we have to pass the message in the route if we want to be display
app.use(flash())

// midleware of flash
app.use((req , res , next) => {
    res.locals.messages = req.flash('success')
    next()
})


//**************************** */
// COOKIE and ... sessions

app.get('/viewcount' , (req , res) => {
    if(req.session.count){
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    res.send(`You have opened this session: ${req.session.count}`)
})

app.get('/register' , (req , res) => {
    const { username = 'Anonymous'} = req.query;
    req.session.username = username;
    res.redirect('/greet')
})

app.get('/greet' , (req , res) => {
    const {username } = req.session
    res.send(`Welcome back  ${username}`)
})

app.get('/setname' , (req , res) => {
    res.cookie('name' , 'Andrei')
    res.send("We got a cookie")
})

app.get('/signedcookie' , (req , res) => {
    res.cookie('fruit' , 'grape' , {signed:true})
    res.send('cookie is sent')
})

app.get('/verifyfruit' , (req , res) => {
    console.log(req.cookies);
    res.send(req.cookies)   
})

//*********************************************** */

// PRODUCTS


// flash implementation / after registering a product it will display a message
// the message is passed to index.ejs to be render after registration
app.get('/products' , async (req , res) => {
    const {category} = req.query;
    if(category){
        const products = await Product.find({category})
        res.render('products/index' , {products , category })
    } else {
        const products = await Product.find({})  
        res.render('products/index' , {products , category: "All" })
    }
})

const categories = ['fruit' , 'vegetable' , 'dairy' , 'fungi'];

app.get('/products/new' , (req , res) => {
    // in this case err should be conditional / ex: only admins can add prod
    //throw new AppError('NOT ALLOWED' , 401)
    res.render('products/new' , {categories})
})

// here we define the message for flash / it will have the key of succes in this case
app.post('/products' , async (req , res , next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        req.flash('success' , 'You register a new product')
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