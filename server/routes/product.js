const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploadCloud = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getAllProducts)
router.put('/rating', [verifyAccessToken], ctrls.ratings)

router.put('/uploadimages/:pid', [verifyAccessToken, isAdmin], uploadCloud.array('images', 10), ctrls.uploadImagesProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.get('/:pid', ctrls.getProduct)

module.exports = router