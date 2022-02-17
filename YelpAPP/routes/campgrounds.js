const express= require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js')

const validateCampground = (req , res , next) => {
   // joi schema is applied before mongoose schema
        const {error} = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg , 400)
        }  else {
            next();
        } 
}


router.get('/' , async (req , res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds})
})

router.get('/new' , (req , res) => {
    res.render('campgrounds/new');
})

router.post('/' , validateCampground , catchAsync(async(req , res , next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data' , 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success' , 'Successfully made a new campgrounds!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//!!!!!! populate -> if we do not populate we are looking at ID's only
router.get('/:id' ,catchAsync( async(req , res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error' , 'cannot find campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show' , {campground})
}))

router.get('/:id/edit' ,catchAsync( async (req , res, next) => {
   const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit' , {campground})
}))

router.put('/:id' , validateCampground , catchAsync(async (req , res , next) => {  
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground})
    req.flash('success' , 'Edit completed successfully')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id' , catchAsync(async(req , res, next) => {
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))



module.exports = router;