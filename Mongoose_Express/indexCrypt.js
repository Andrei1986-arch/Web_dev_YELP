const express = require('express')
const mongoose = require('mongoose')
const app = express();
const User = require('./models/userCrypt')
const bcrypt = require('bcrypt')
const session = require('express-session')

mongoose.connect('mongodb://localhost:27017/AuthDemo' , {
    useNewUrlParser: true , 
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
console.log("Database connected");
});

app.set('view engine' ,  'ejs');
app.set('views' , 'views')

app.use(express.urlencoded({extended:true}))

const sessionConfig = {
    secret: 'poorsecret',
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true ,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

const requireLogin = (req , res , next) => {
    if(!req.session.user_id){
       return res.redirect('/login')
    }
    next();
}

app.use(session(sessionConfig))

app.get('/' , (req , res) => {
    res.send('Home page')
})
app.get('/register' , (req , res) => {
    res.render('registerCrypt')
})

app.post('/register' , async(req , res) => {
    const {username , password} = req.body
    // const hash = await bcrypt.hash(password , 12)
    // const user = new User({
    //     username:username,
    //     password:hash
    // })  // one way to do it

    const user = new User({
        username:username,
        password:password
    })

    await user.save()
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login' , (req, res) => {
    res.render('loginCrypt')
})

app.post('/login' , async (req, res) => {
    const {username , password} = req.body;
    const foundUser = await User.findAndValidate(username , password)
    if(foundUser){
        req.session.user_id = foundUser._id;
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})

app.post('/logout' , (req , res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login')
})

app.get('/secret' , requireLogin , (req , res) => {   
   
    res.render('secretCrypt')
})
app.get('/topsecret' , requireLogin , (req , res) => {   
   
    res.send("'TOP SECRET'")
})


app.listen(3000 , () => {
    console.log("APP IS LISTENING TO PORT 3000....");
})