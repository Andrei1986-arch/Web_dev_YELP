const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        required:true,
        type:String,
        unique:true
    }
});

//passportLocalMongoose  it adds automaticaly an username and password field in the schema

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , UserSchema)


