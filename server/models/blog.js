const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberViews: {
        type: Number,
        default: 0,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    image: {
        type: String,
        default: 'https://www.shutterstock.com/image-photo/smartphone-tablet-pc-mock-on-260nw-1287357250.jpg',
    },
    author: {
        type: String,
        default: 'Admin',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

module.exports = mongoose.model('Blog', blogSchema)