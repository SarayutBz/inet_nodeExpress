const mongoose = require('mongoose')
const { Schema } = mongoose

const orderModel = new Schema({
    userData: { type: Array },
    orderUser: { type: Array },
}, {
    timestamps: true
})

module.exports = mongoose.model('orders', orderModel)


