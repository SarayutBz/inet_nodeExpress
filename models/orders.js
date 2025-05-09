const mongoose = require('mongoose')
const { Schema } = mongoose

const orderModel = new Schema({
    userData: { type: Array },
    orderUser: { type: Array },
    totalOrders: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('orders', orderModel)


