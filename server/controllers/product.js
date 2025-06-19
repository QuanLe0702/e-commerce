const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})
// Filtering, sorting & pagination
const getAllProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)
    console.log(formatedQueries)

    // Filtering
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    } else {
        queryCommand = queryCommand.sort('-createdAt')
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    } else {
        queryCommand = queryCommand.select('-__v')
    }

    // Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand = queryCommand.skip(skip).limit(limit)

    // Execute query
    const response = await queryCommand.exec()
    const counts = await Product.find(formatedQueries).countDocuments()
    return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : 'Cannot get products',
        currentPage: page,
        totalPages: Math.ceil(counts / limit)
    })
})
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    
    if (!star || !pid) throw new Error('Missing inputs')
    if (star < 1 || star > 5) throw new Error('Star rating must be between 1 and 5')
    
    // Check if product exists
    const ratingProduct = await Product.findById(pid)
    if (!ratingProduct) throw new Error('Product not found')
    
    // Check if user has already rated
    const alreadyRating = ratingProduct?.ratings?.find(
        el => el.postedBy.toString() === _id.toString()
    )
    
    if (alreadyRating) {
        // Update star & comment
        await Product.updateOne({_id: pid, ratings: { $elemMatch: alreadyRating }},
            {$set: {"ratings.$.star": star, "ratings.$.comment": comment }})
    } else {
        // Add new rating
        await Product.findByIdAndUpdate(pid, {
                $push: { ratings: { star, comment, postedBy: _id } }
            }, {new: true })
    }
           
    //Average rating
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10

    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        message: alreadyRating ? 'Rating updated successfully' : 'Rating successfully',
        updatedProduct: await Product.findById(pid)
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params
        if (!req.files || req.files.length === 0) throw new Error('No files uploaded')
        const response = await Product.findByIdAndUpdate(
            pid,
            { $push: { images: { $each: req.files.map(el => el.path) } } }, // Sử dụng $each để thêm nhiều ảnh vào mảng
            { new: true }
        )

        return res.status(200).json({
            status: response ? true : false,
            uploadedImages: response ? response : 'Cannot upload images'
        })
})

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}