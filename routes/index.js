const routes = require('express').Router()


module.exports = () => {
    routes.use('/auth', require('./auth-routes')())
    routes.use('/books', require('./books-routes')())
    return routes
}