const routes = require('express').Router()


module.exports = () => {
    routes.use('/auth', require('./auth-routes')())
    routes.use('/books', require('./books-routes')())
    routes.use('/admin', require('./admin-routes')())
    routes.use('/user', require('./user-routes')())
    routes.use('/orders', require('./order-routes')())
    return routes
}