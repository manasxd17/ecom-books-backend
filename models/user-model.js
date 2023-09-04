const mongoose = require('mongoose')
const { isEmail } = require('validator')

const cartSchema = new mongoose.Schema({
    book_id:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:{
            validator:isEmail,
            message:"Invalid email."
        }
    },
    password:{
        type:String,
        required:true
    },
    cart:[cartSchema]
    },
    { timestamps:true }
)

const User = mongoose.model('User', userSchema)

module.exports = { User }