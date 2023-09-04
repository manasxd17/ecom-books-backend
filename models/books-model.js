const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        enum: [0,1, 2, 3, 4, 5],
        default:0
    },
    comment:{
        type:String,
        required:false
    }
})

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    publish_year:{
        type:Number,
        required:false
    },
    copies_available:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    reviews:[reviewSchema]
    },
    { timestamps:true }
)

const Books = mongoose.model('Books', bookSchema)

module.exports = { Books }