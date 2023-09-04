const mongoose = require('mongoose')
const { DB_CONNECTION_URL } = require('../config')

const mongoConnect = async() => {
    try{
        if(mongoose.connection.readyState != 1){
            await mongoose.connect(DB_CONNECTION_URL)
            console.log("DB connection successful.")
        }
        else{
            console.log("DB already connected.")
        }

    }
    catch(error){
        console.log("DB connection failed.")
        process.exit(1)
    }
}

module.exports = {mongoConnect}