const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo' , {useNewUrlParser: true , useUnifiedTopology:true})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const userSchema = new mongoose.Schema({
    first:String ,
    last:String,
    adresses:[
        {
            street:String,
            city:String,
            state:String,
            country:{
                type:String,
                required:true
            }
        }
    ]
})

const User = mongoose.model('User' , userSchema);

const makeUser = async () => {
    const u = new User({
        first:'Andrei',
        last:'Panaite'
    })
    u.adresses.push({
        street:'Cuza Voda',
        city:'Focsani',
        state:'VN',
        country:'RO'
    })
    const res = await u.save()
    console.log(res);
}

const addAdress = async(id) => {
    const user = await User.findById(id)
    
    user.adresses.push({
        street:'Independentei 88',
        city:'Focsani',
        state:'VN',
        country:'RO'
    })
    const res = await user.save()
    console.log(res);
}

addAdress('61fea3d45a9f74c2f8e0cfe9')