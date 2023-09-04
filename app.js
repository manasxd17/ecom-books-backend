const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')


module.exports = async() => {
    const app = express()

    app.use(helmet())

    app.use(bodyParser.urlencoded({ extended:true }))
    
    app.use(bodyParser.json())

    app.use(cors({
        origin : "*",
        methods : ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders : ["Content-Type", "Authorization"],
        preflightContinue:true
    }))

    app.use('/app/healthCheck', (req, res) => {
        res.status(200).json({message : "Server is up and running."})
    })

    app.use('/api/v1', require('./routes')())

    return app;
}