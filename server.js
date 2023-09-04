const http = require('http')
const expressApp = require('./app')
const { PORT } = require('./config')
const { mongoConnect } = require('./utils/mongo-connection')

expressApp().then(async(app) => {
    const server = http.createServer(app)
    server.listen(PORT, (err) => {
        if(err){
            console.log(`Error - Something went wrong - ${err}`)
        }
        else{
            console.log(`Server is running on PORT - ${PORT}`)
        }
    })
    await mongoConnect()
}).catch((error) => {
    console.log(`Error - ${error}`)
})