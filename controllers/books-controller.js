const { Books } = require("../models/books-model")

const fetchBooks = () => {
    return async(req, res, next) => {
        try{
            const resp = await Books.find({})
            res.status(200).json({success:true, data:resp})
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

module.exports = { fetchBooks }