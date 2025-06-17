const blogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body
    if (!title) throw new Error('Missing inputs')
    const response = await blogCategory.create({ title } )
    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create blog category'
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await blogCategory.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        blogCategories: response ? response : 'Cannot get blog categories'
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const { title } = req.body
    if (!title) throw new Error('Missing inputs')
    const response = await blogCategory.findByIdAndUpdate(bcid, { title }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Cannot update blog category'
     })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await blogCategory.findByIdAndDelete(bcid)
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Cannot delete blog category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}