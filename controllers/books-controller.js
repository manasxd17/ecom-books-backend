const { Books } = require("../models/books-model")
const searchAbleFields = ['title', 'author', 'genre']

// RETURNS ALL THE BOOKS AS PER THE PASSED PARAMETERS LIKE SORT, PAGINATION, SEARCH TERM
const fetchBooks = () => {
    return async(req, res, next) => {
        try{
            let builderObj = {};
            let searchObj = {};
            if(req.body.sort){
                let order = req.body.order ? req.body.order : 1
                builderObj['sort'] = {[req.body.sort]:order}
            }
            if(req.body.searchTerm && req.body.searchTerm.length >=3 ){
                searchObj["$or"] = searchAbleFields.map((e) => {
                    return {[e] : {$regex: req.body.searchTerm, $options : "i"}}
                })
            }
            let skip = req.query.from ? req.query.from : 0
            let size = req.query.size ? req.query.size : 10
            builderObj['skip'] = skip
            builderObj['limit'] = size
            console.log(JSON.stringify(searchObj))
            const resp = await Books.find(searchObj, {__v:0}, builderObj)
            res.status(200).json({success:true, data:resp})
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

// FETCH ALL INFO ABOUT A PARTICULAR BOOK
const fetchParticularBook = () => {
    return async(req, res, next) => {
        try{
            if(req.query.bookId){
                const resp = await Books.findOne({_id : req.query.bookId}, {__v:0})
                if(!resp){
                    res.status(404).json({success:false, message:"No Book Found"})
                }
                else{
                    res.status(200).json({success:true, message:"Book Found", data:resp})
                }
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

module.exports = { fetchBooks, fetchParticularBook }