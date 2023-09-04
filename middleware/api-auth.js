const { decodeToken, checkUser } = require("../utils/additional_functions")

const userCheckMiddleware = () => {
    return async(req, res, next) => {
        try{
            if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
                const decode = await decodeToken(req.headers.authorization.split(" ")[1])
                req.userId = decode.obj.userId
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

const adminCheckMiddleware = () => {
    return async(req, res, next) => {
        try{
            if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
                const decode = await decodeToken(req.headers.authorization.split(" ")[1])
                const user = await checkUser(decode.obj.email)
                if(user[0].role == "Admin"){
                    req.userId = decode.obj.userId
                    next()
                }
                else{
                    res.status(403).json({success:false, message:"Forbidden"})
                }
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

module.exports = { userCheckMiddleware, adminCheckMiddleware }

