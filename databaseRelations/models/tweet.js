const mongoose = require('mongoose');
// in place of mongoose.Schema  now we can put just Schema
const {Schema} =  mongoose;

mongoose.connect('mongodb://localhost:27017/relationshipDemo' , {useNewUrlParser: true , useUnifiedTopology:true})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const userSchema = new Schema({
    username:String,
    age:Number
})

const tweetSchema = new Schema({
    tweet:String ,
    likes:Number,
    user:{type: Schema.Types.ObjectId , ref:'User'}
})

const User = mongoose.model('User' , userSchema);
const Tweet = mongoose.model('Tweet' , tweetSchema);

// const makeTweets = async () => {
//     // const user = new User({username:'troll' , age:33});
//     const user = await User.findOne({username:'troll'})
//     // const tweet1 = new Tweet({tweet:'i like my car' , likes:1});
//     const tweet2 = new Tweet({tweet:'i like my Ferrari' , likes:1612});
//     tweet2.user = user
//     tweet2.save()
// }

// makeTweets()

const findTweet = async () => {
    const t = await Tweet.find({username:'troll'}).populate('user' , 'username');
    console.log(t)
}

findTweet()
