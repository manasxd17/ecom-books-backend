const { saltRounds, SECRET_KEY } = require("../config")
const { User } = require("../models/user-model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const checkUser = async(email) => {
    const userExists = await User.find({email})
    if(userExists.length){
        return userExists
    }
    else{
        return false
    }
}

const hashPassword = async(password) => {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

const comparePassword = async(password, hash) => {
    const resp = await bcrypt.compare(password, hash)
    return resp
}

const generateToken = async(obj) => {
    const token = await jwt.sign({obj}, SECRET_KEY, {"expiresIn":"1h"})
    return token
}

const decodeToken = async(token) => {
    const resp = await jwt.verify(token, SECRET_KEY)
    return resp
}

module.exports = { checkUser, hashPassword, comparePassword, generateToken, decodeToken }