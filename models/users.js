const mongoose = require('mongoose')
const { Schema } = mongoose

const userModel = new Schema({
    email: { type: String },
    name: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    password: { type: String },
    approve: { type: Boolean },
}, {
    timestamps: true
})


module.exports = mongoose.model('users', userModel);
