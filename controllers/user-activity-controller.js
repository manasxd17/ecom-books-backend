const { Books } = require("../models/books-model")
const { User } = require("../models/user-model")

const addReview = () => {
    return async(req, res, next) => {
        try{
            const conditions = {
                _id:req.query.bookId,
                "reviews.user_id":{ $ne : req.userId}
            }
            const update = {
                $addToSet: { reviews: { user_id: req.userId, rating: req.body.rating, comment: req.body.comment ?  req.body.comment : null} }
            }
            const resp = await Books.findOneAndUpdate(conditions, update)
            if(resp == null){
                res.status(400).json({success:false, message:"You've already rated this book"})
            }
            else{
                res.status(200).json({success:true, message:"Review added"})
            }
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}


module.exports = { addReview }