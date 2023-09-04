const { User } = require("../models/user-model")
const { checkUser, hashPassword, comparePassword, generateToken } = require("../utils/additional_functions")

const registerUser = () => {
    return async(req, res, next) => {
        try{
            if(req.body.email && req.body.password){
                const userExists = await checkUser(req.body.email)
                if(!userExists){
                    // Insert user in the DB
                    const userData = {
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        email:req.body.email,
                        password:await hashPassword(req.body.password),
                        cart:[]       
                        // CART KEPT INITIALLY EMPTY
                    }
                    const resp = await User.create(userData)
                    res.status(200).json({success:true, message:"User registered successfully"})
                }
                else{
                    res.status(400).json({success:false, message:"User exists in the database."})
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


const loginController = () => {
    return async(req, res, next) => {
        try{
            const { email, password } = req.body
            const user = await checkUser(email)
            if(user){
                const checkPassword = await comparePassword(password, user[0].password)
                if(checkPassword){
                    const token = await generateToken({email:user[0].email})
                    res.status(200).json({success:true, message:"Login successful", data:{email:user[0].email, token}})
                }
                else{
                    res.status(401).json({success:false, message:"Unauthorized, Incorrect Password"})
                }
            }
            else{
                res.status(404).json({success:false, message:"User is not registered."})
            }
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

module.exports = { registerUser, loginController }