
const { campgroundSchema , reviewSchema } = require('../schemas.js')
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
// in req we find req.user
// we create in session a returnTo var wich stores prev url / before redirecting to /login
module.exports.isLoggedIn = (req , res , next) => {
 if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error' , 'You must pe signed in in order to add a campground!')
        return res.redirect('/login')
    }
    next()
} 

module.exports.validateCampground = (req , res , next) => {
   // joi schema is applied before mongoose schema
        const {error} = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg , 400)
        }  else {
            next();
        } 
}

module.exports.isAuthor = async(req , res , next) => {
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error' , 'You do not have permission to edit.')
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}
// id is for campground &  reviewId is for review
module.exports.isReviewAuthor = async(req , res , next) => {
    const { id , reviewId } = req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error' , 'You do not have permission to edit.')
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

module.exports.validateReview = ( req , res , next) => {
     const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg , 400)
        }  else {
            next();
        } 
}