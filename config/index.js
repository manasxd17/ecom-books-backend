require('dotenv').config()
module.exports = {
    PORT : process.env.PORT,
    DB_CONNECTION_URL : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ecom-book-cluster.kbjoclk.mongodb.net/?retryWrites=true&w=majority`,
    DB_NAME : process.env.DB_NAME
}