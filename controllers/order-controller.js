const { Orders } = require("../models/orders-model")

const fetchOrders = () => {
    return async(req, res, next) => {
        try{
            const resp = await Orders.find({buyer_id : req.userId}, {orderDetails:1, shippingAddress:1, paymentType:1, status:1}, {limit:5, sort:{ 'updatedAt': -1}})
            res.status(200).json({success:true, data:resp})
        }
        catch(error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

module.exports = { fetchOrders }