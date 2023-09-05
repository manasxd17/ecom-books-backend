const { userCheckMiddleware } = require('../middleware/api-auth')

const router = require('express').Router()

module.exports = () => {
    router.get('/history', userCheckMiddleware(), require('../controllers/order-controller').fetchOrders())
    return router
}