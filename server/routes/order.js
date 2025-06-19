const router = require('express').Router()
const ctrls = require('../controllers/order')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], ctrls.createNewOrder)
router.get('/', [verifyAccessToken], ctrls.getUserOrders)
router.put('/status/:oid', [verifyAccessToken, isAdmin], ctrls.UpdateStatusOrder)
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getUserOrdersByAdmin)

module.exports = router 