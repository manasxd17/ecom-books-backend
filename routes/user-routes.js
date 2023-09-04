const { userCheckMiddleware } = require('../middleware/api-auth')

const router = require('express').Router()

module.exports = () => {
    router.put('/add_review', userCheckMiddleware(), require('../controllers/user-activity-controller').addReview())
    return router
}