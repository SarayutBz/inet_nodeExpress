const mongoose = require('mongoose')
const { Schema } = mongoose

const productModel = new Schema({
    name: { type: String },
    price: { type: Number },
    stockProduct: { type: Number },
    productOrders: { type: Array },
    totalOrders: {
    type: Number,
    default: 0
  },
  totalPrice:{type:Number}
}, {
    timestamps: true
})

module.exports = mongoose.model('products', productModel)


