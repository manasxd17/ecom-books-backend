const { adminCheckMiddleware } = require('../middleware/api-auth')

const router = require('express').Router()

module.exports = () => {
    router.post('/add_book', adminCheckMiddleware(), require('../controllers/admin-controller').createBookListing())
    router.put('/upgrade_role', adminCheckMiddleware(), require('../controllers/admin-controller').upgradeRole())
    router.put('/update_status', adminCheckMiddleware(), require('../controllers/admin-controller').updateStatus())
    return router
}