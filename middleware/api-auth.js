const { decodeToken } = require("../utils/additional_functions")

const userCheckMiddleware = () => {
    return async(req, res, next) => {
        try{
            if(req.headers.authorization && req.headers.authorization.split(" ")[0] == Bearer){
                const decode = await decodeToken(req.headers.authorization.split(" ")[1])
                next()
            }
            else{
                res.status(400).json({success:false, message:"No token passed with the request."})
            }
        }
        catch(error){
            res.status(401).json({success:false, message:`Unauthorized request - ${error.message}`})
        }
    }
}

module.exports = { userCheckMiddleware }

