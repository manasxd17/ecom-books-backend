const { Books } = require("../models/books-model")
const { User } = require("../models/user-model")

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

// AVAILABILITY TO BE RESTRICTED FROM FRONTEND
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
                else{
                    if(quantity == "all"){
                        // delete the entry from cart
                        resp = await User.updateOne({_id : req.userId}, {$pull : { cart :{ book_id : bookId}}}, {safe:true, multi:false})
                    }
                    else{
                        const decQuantity = {
                            $inc : { 'cart.$.quantity' : -quantity }
                        }
                        resp = await User.updateOne({_id : req.userId, 'cart.book_id': bookId}, decQuantity)
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
                res.status(200).json({success:true, data:cartData.cart, total_bill:totalAmount})
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

module.exports = { addReview, addToCart, removeBook, showCart }