const { userCheckMiddleware } = require('../middleware/api-auth')

const router = require('express').Router()

module.exports = () => {
    router.get('/all', userCheckMiddleware(), require('../controllers/books-controller').fetchBooks())
    return router
}