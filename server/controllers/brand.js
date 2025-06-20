const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body
    if (!title) throw new Error('Missing inputs')
    const response = await Brand.create({ title } )
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create brand'
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find()
    return res.status(200).json({
        success: response ? true : false,
        brands: response ? response : 'Cannot get brand'
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const { title } = req.body
    if (!title) throw new Error('Missing inputs')
    const response = await Brand.findByIdAndUpdate(bid, { title }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update brand'
     })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete brand'
    })
})

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}