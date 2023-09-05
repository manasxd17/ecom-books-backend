const { userCheckMiddleware } = require('../middleware/api-auth')

const router = require('express').Router()

module.exports = () => {
    router.put('/add_review', userCheckMiddleware(), require('../controllers/user-activity-controller').addReview())
    router.post('/add_to_cart', userCheckMiddleware(), require('../controllers/user-activity-controller').addToCart())
    router.delete('/remove_from_cart', userCheckMiddleware(), require('../controllers/user-activity-controller').removeBook())
    router.get('/show_cart', userCheckMiddleware(), require('../controllers/user-activity-controller').showCart())
    return router
}