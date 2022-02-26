const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder =  mbxGeocoding({ accessToken: mapBoxToken })
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req , res) => {
    const campgrounds = await Campground.find({}).populate('author'); 
    res.render('campgrounds/index' , {campgrounds})
}

module.exports.renderNewForm = (req , res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground =   async(req , res , next) => {
    const geoData = await geocoder.forwardGeocode ({
        query: req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path , filename: f.filename}))
    campground.author = req.user._id
    console.log(campground.geometry);
    await campground.save();
    req.flash('success' , 'Successfully made a new campgrounds!')
    res.redirect(`/campgrounds/${campground._id}`)
 }

//!!!!!! populate -> if we do not populate we are looking at ID's only --> from findById(id)
// with populate we add reviews and author or whatever we want have access to
// ex: in show.ejs if we call campground.author.username  we will get undefined because without populate ww find just camp id's
module.exports.showCampground =  async(req , res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            path:'reviews',
            populate:{
                path:'author'
            }
        }).populate('author')
        if(!campground){
            req.flash('error' , 'cannot find campground!')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show' , {campground})
    }

module.exports.renderEditForm = async (req , res, next) => {
        const {id} = req.params
        const campground = await Campground.findById(id);
        if(!campground){
            req.flash('error' , 'Cannot find that campground!')
            res.redirect('/campgrounds')
        }   
        res.render('campgrounds/edit' , {campground})
    }   

module.exports.updateCampground = async (req , res , next) => { 
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground})
    // imgs it will be an array
    // we do not want to push an array to an existing one / just push waht is in the array aka ...obj
    const imgs = req.files.map(f => ({url: f.path , filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            // delete from cloudinary
            cloudinary.uploader.destroy(filename)
        }
    // delete from mongodb
    // pull the images wich have a filename that is in req.body.deleteImages
        await campground.updateOne({ $pull:  { images: { filename: { $in: req.body.deleteImages }}}})
        console.log(campground);
    }
    req.flash('success' , 'Edit completed successfully')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req , res, next) => {
    const {id} = req.params;
  
    const deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}