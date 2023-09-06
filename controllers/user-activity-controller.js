const { Books } = require("../models/books-model")
const { Orders } = require("../models/orders-model")
const { User } = require("../models/user-model")
const mongoose = require('mongoose')

const addReview = () => {
    return async (req, res, next) => {
        try {
            const conditions = {
                _id: req.query.bookId,
                "reviews.user_id": { $ne: req.userId }
            }
            const update = {
                $addToSet: { reviews: { user_id: req.userId, rating: req.body.rating, comment: req.body.comment ? req.body.comment : null } }
            }
            const resp = await Books.findOneAndUpdate(conditions, update)
            if (resp == null) {
                res.status(400).json({ success: false, message: "You've already rated this book" })
            }
            else {
                res.status(200).json({ success: true, message: "Review added" })
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}

// AVAILABILITY OF BOOKS TO BE RESTRICTED FROM FRONTEND
const addToCart = () => {
    return async (req, res, next) => {
        try {
            const bookId  = req.query.bookId
            let quantity = req.body.quantity ? req.body.quantity : 1
            const bookData = await Books.findOne({_id : bookId})
            if (bookData) {
                const price = bookData.price
                const cond = {
                    _id: req.userId,
                    "cart.book_id": { $ne: bookId }
                }
                const update = {
                    $addToSet: {
                        cart: {
                            book_id: bookId,
                            title:bookData.title,
                            price,
                            quantity
                        }
                    }
                }
                let resp = await User.findOneAndUpdate(cond, update)
                if (resp == null) {
                    const incQuantity = {
                        $inc : { 'cart.$.quantity' : quantity }
                    }
                    resp = await User.updateOne({'cart.book_id': bookId}, incQuantity)
                }
                res.status(200).json({ success: true, message: "Books added to the cart." })
            }
            else{
                res.status(400).json({success:false, message:"Incorrect Book Id passed"})
            }
        }
        catch (error) {
            res.status(500).json({ sucess: false, message: error.message })
        }
    }
}


const removeBook = () => {
    return async(req, res, next) => {
        try{
            let resp;
            const bookId = req.query.bookId
            let quantity = req.body.quantity ? req.body.quantity : 1
            const bookData = await Books.findOne({_id : bookId})
            if(!bookData){
                res.status(400).json({success:false, message:"Incorrect Book Id"})
            }
            else{
                const checkBookInCart = await User.find({_id : req.userId}).select({cart :{ $elemMatch :{ book_id : bookId}}})

                if(checkBookInCart[0].cart.length == 0 || checkBookInCart[0].cart[0].quantity <= 0){
                    await User.updateOne({_id : req.userId}, {$pull : { cart :{ book_id : bookId}}}, {safe:true, multi:false})
                    res.status(404).json({success:false, message:"No such book found in your cart"})
                }

                else if (checkBookInCart[0].cart[0].quantity < quantity){
                    res.status(400).json({success:false, message:`Can't remove, You have only ${checkBookInCart[0].cart[0].quantity} books in your cart.`})
                }

                else{
                    if(quantity == "all"){
                        // delete the entry from cart
                        resp = await User.updateOne({_id : req.userId}, {$pull : { cart :{ book_id : bookId}}}, {safe:true, multi:false})
                    }
                    else{
                        const decQuantity = {
                            $inc : { 'cart.$.quantity' : -quantity }
                        }
                        resp = await User.findOneAndUpdate({_id : req.userId, 'cart.book_id': bookId}, decQuantity, {new:true})
                        resp.cart.forEach(async(doc) => {
                            if(doc.book_id == bookId && doc.quantity <= 0){
                                await User.updateOne({_id : req.userId}, {$pull : { 'cart' :{ 'book_id' : bookId}}}, {safe:true, multi:false})
                            }
                        })
                    }
                    res.status(200).json({success:true, message:"Books removed from the cart."})
                }
            }
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}



const showCart = () => {
    return async(req, res, next) => {
        try{
            let user_id = req.userId
            const cartData = await User.findOne({_id : user_id}, {'cart.title':1, 'cart.price':1, 'cart.quantity':1})
            if(cartData.cart.length){
                const totalAmount = await User.aggregate([
                    { $match : {
                        _id : new mongoose.Types.ObjectId(user_id)
                    }},
                    {
                        $unwind:"$cart"
                    },
                    {
                        $set:{
                            "total_price" :{
                                $multiply:[
                                    "$cart.quantity",
                                    "$cart.price"
                                ]
                            }
                        }
                    },
                    {
                        $group:{
                            _id:user_id,
                            "total_amount":{
                                $sum:"$total_price"
                            }
                        }
                    }
                ])
                res.status(200).json({success:true, data:cartData.cart, total_bill:totalAmount[0]['total_amount']})
            }
            else{
                res.status(200).json({success:true, message:"The cart is empty right now."})
            }
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

const checkout = () => {
    return async(req, res, next) => {
        try{
            let bill = 0;
            const userData = await User.findById(req.userId).select('-cart._id')
            if(userData.cart.length){
                const totalAmount = await User.aggregate([
                    { $match : {
                        _id : new mongoose.Types.ObjectId(req.userId)
                    }},
                    {
                        $unwind:"$cart"
                    },
                    {
                        $set:{
                            "total_price" :{
                                $multiply:[
                                    "$cart.quantity",
                                    "$cart.price"
                                ]
                            }
                        }
                    },
                    {
                        $group:{
                            _id:req.userId,
                            "total_amount":{
                                $sum:"$total_price"
                            }
                        }
                    }
                ])
                bill = totalAmount[0]['total_amount']
            }
            const orderContent = {
                buyer_id:req.userId,
                buyerName:userData.firstName + " " + userData.lastName,
                shippingAddress:userData.address ? userData.address : null,
                contactNumber:userData.contactNumber,
                paymentType:req.body.paymentType,
                status:"Pending",
                totalBill: bill
            }
            // ADDITIONAL AVAILABILITY CHECK
            const bookIdSet = userData.cart.map((doc) => {
                return new mongoose.Types.ObjectId(doc.book_id)
            })
            const fetchCopies = await Books.find({_id :{$in : bookIdSet}}, {copies_available:1})
            let unavailableSet = []
            userData.cart.forEach((e) => {
                fetchCopies.forEach((doc) => {
                    if(doc._id == e.book_id && doc.copies_available < e.quantity){
                        unavailableSet.push(e.title)
                    }
                })
            })
            if(unavailableSet.length){
                res.status(400).json({success:false, message:`There are some items in your cart which are unavailable right now, Items - ${unavailableSet.toString()}`})
            }
            else{
                // Make Cart Empty, Insert data into orders table and reduce the copies count.
                orderContent['orderDetails'] = userData.cart
                await Orders.create(orderContent)
                // MODIFY AVAILABLE COPIES COUNT
                let newCount;
                userData.cart.forEach(async(e) => {
                    fetchCopies.forEach(async(doc) => {
                        if(doc._id == e.book_id){
                            newCount = doc.copies_available - e.quantity
                            await Books.updateOne({_id : doc._id}, {$set: { copies_available: newCount}}, {new : true, safe:true, multi:false})
                        }
                    })
                })
                await User.updateOne({_id : req.userId}, {$set : {cart : []}})
                res.status(200).json({success:true, message:"You have successfully checked out."})
            }
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

module.exports = { addReview, addToCart, removeBook, showCart, checkout }