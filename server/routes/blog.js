const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploadCloud = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog)
router.put('/likes/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislikes/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.put('/image/:bid', [verifyAccessToken, isAdmin], uploadCloud.single('images'), ctrls.uploadImagesBlog)
router.get('/', ctrls.getBlogs)
router.get('/one/:bid', ctrls.getBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router