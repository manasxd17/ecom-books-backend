const mongoose = require('mongoose')
const { isEmail, isMobilePhone } = require('validator')

const cartSchema = new mongoose.Schema({
    book_id:{
        type:String,
        unique:true
    },
    title:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number,
        minimum:1
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
    role:{
        type:String,
        required:true,
        enum:["Admin", "Customer"]
    },
    address:{
        addressLine:{
            type:String,
            required:false
        },
        city:{
            type:String,
            required:false
        },
        pincode:{
            type:Number,
            required:false
        }
    },
    contactNumber:{
        type:Number,
        required:true,
        validate:{
            validator:isMobilePhone,
            message:"Incorrect contact information, add country code as well"
        }
    },
    cart:[cartSchema]
    },
    { timestamps:true }
)

const User = mongoose.model('User', userSchema)

module.exports = { User }