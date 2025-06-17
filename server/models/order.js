const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            color: String,
            count: Number
        }
    ],
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled']
    },
    paymentIntent: {},
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Order', orderSchema)