const productCategory = require('../models/productCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body
    if (!title) throw new Error('Missing inputs')
    const response = await productCategory.create({ title } )
    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create category'
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await productCategory.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        productCategories: response ? response : 'Cannot get product categories'
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const { title } = req.body
    if (!title) throw new Error('Missing inputs')
    const response = await productCategory.findByIdAndUpdate(pcid, { title }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Cannot update product category'
     })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await productCategory.findByIdAndDelete(pcid)
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Cannot delete product category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}