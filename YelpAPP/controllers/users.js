const User = require('../models/user');

module.exports.renderRegisterForm =  (req , res) => {
    res.render('users/register')
}

module.exports.registerUser = async(req , res , next) => {
    try {
        const {email , username , password} = req.body
        const user = new User({email , username})
        const registerdUser = await User.register(user , password);
        //passport login needs a callback func AKA err => { if(err) return next(err)}
        req.login(registerdUser , err => {
            if(err) return next(err)
        })
        req.flash('success' , 'Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
    } catch (error) {
        req.flash("error" , error.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req , res) => {
    res.render('users/login')
}

// req.session.returnTo must be deleted / we want one url , otherwise we should choose
// witch one to redirect / also on refresh we DO NOT WANT to have a url saved
module.exports.loginUser = (req , res) => {
    const {username} = req.body;
    req.flash('success' , `Welcome back ${username}!`)
    const redirectUrl = req.session.returnTo || 'campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req , res) => {
    req.logOut();
    req.flash('success' , 'Logout successfully!')
    res.redirect('/campgrounds')
}