const { Books } = require("../models/books-model")
const { Orders } = require("../models/orders-model")
const { User } = require("../models/user-model")
const mongoose = require('mongoose')

const createBookListing = () => {
    return async(req, res, next) => {
        try{
            let bookData = {
                title:req.body.title,
                description:req.body.description,
                genre:req.body.genre,
                author:req.body.author,
                publish_year:req.body.publish_year,
                copies_available:req.body.copies_available,
                price:req.body.price,
                reviews:[]
                // KEEPING REVIEWS EMPTY INITIALLY
            }
            const resp = await Books.create(bookData)
            res.status(200).json({success:true, message:"Listing Created."})
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

// ONLY ADMIN CAN UPGRADE ROLE OF EXISTING USER
const upgradeRole = () => {
    return async(req, res, next) => {
        try{
            const resp = await User.findOneAndUpdate({email:req.body.email}, {role:"Admin"}, {new:true, runValidators:true})
            res.status(200).json({success:true, message:"Role upgraded successfully"})
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

// ONLY ADMIN CAN CHANGE THE STATUS OF THE ORDER PLACED
const updateStatus = () => {
    return async(req, res, next) => {
        try{
            if(req.query.orderId){
                const resp = await Orders.findOneAndUpdate({_id : new mongoose.Types.ObjectId(req.query.orderId)}, {status : req.query.status}, {new:true, runValidators:true})
                res.status(200).json({success:true, message:"Status updated successfully"})
            }
            else{
                throw new Error("Insufficient data")
            }
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

module.exports = { createBookListing, upgradeRole, updateStatus }