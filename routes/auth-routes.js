const router = require('express').Router()

module.exports = () => {
    router.post('/register', require('../controllers/auth-controller').registerUser())
    router.post('/login', require('../controllers/auth-controller').loginController())
    return router
}