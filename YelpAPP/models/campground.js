const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String    
})
//where we have /upload we replace with 
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload' , '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title:String,
    images:[ ImageSchema ],
    price:Number,
    description:String,
    location:String,
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
});
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