const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema({
    book_id:{
        type:String
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

const orderSchema = new mongoose.Schema({
    buyer_id:{
        type:String,
        required:true
    },
    buyerName:{
        type:String,
        required:true
    },
    shippingAddress:{
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
        required:true
    },
    paymentType:{
        type:String,
        enum:["Card", "COD", "UPI"],
        required:true
    },
    totalBill:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["Delivered", "Transit", "Shipped", "Pending"]
    },
    orderDetails:[orderDetailSchema]
    },
    { timestamps:true }
)

const Orders = mongoose.model('Orders', orderSchema)

module.exports = { Orders }