require('dotenv').config()
module.exports = {
    PORT : process.env.PORT,
    DB_CONNECTION_URL : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ecom-book-cluster.kbjoclk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    saltRounds : 10,
    SECRET_KEY : process.env.SECRET_KEY
}