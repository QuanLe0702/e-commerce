const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Brand', brandSchema)