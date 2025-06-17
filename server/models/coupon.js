const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Coupon', couponSchema)