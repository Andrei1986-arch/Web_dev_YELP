const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String    
})
//where we have /upload we replace with /upload/w_200 whre w_200 is desired width
// this is to resize the image without having another set of images of smaller size
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload' , '/upload/w_200')
})

//virtuals are not in included in the JSON file by default / must be specified to include them
// in this case we have them at the end of schema
const opts = {toJSON:{virtuals:true}}

const CampgroundSchema = new Schema({
    title:String,
    images:[ ImageSchema ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required:true
        }
    },
    location:String,
    price:Number,
    description:String,
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
} , opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return (
        `<a href="/campgrounds/${this._id}">${this.title} </a>
        <p>${this.description.substring(0 , 25)}...</p>`
        
        )
})

// this is a Query Midleware
// post referes to the fact that is used as midelware after action --> see midleware doc
// here --> when we delete one campground we find and delete all reviews for the camp
CampgroundSchema.post('findOneAndDelete' , async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground' ,CampgroundSchema)