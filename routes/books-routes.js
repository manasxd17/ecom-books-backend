const { userCheckMiddleware } = require('../middleware/api-auth')

const router = require('express').Router()

module.exports = () => {
    // BELOW ROUTE SUPPORTS PAGINATION AND SEARCH QUERYING
    router.post('/all', userCheckMiddleware(), require('../controllers/books-controller').fetchBooks())
    router.get('/book_info', userCheckMiddleware(), require('../controllers/books-controller').fetchParticularBook())
    return router
}