const { response } = require("express");
const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id).select("cart").populate("cart.product", "title price image");
  if (!userCart) throw new Error("Cart not found");
  const products = userCart?.cart.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce((sum, el) => sum + el.product.price * el.quantity,0);
  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total = Math.round(total * (1 - +selectedCoupon?.discount / 100) /1000) * 1000 || total
    createData.total = total
    createData.coupon = coupon

  }
  const response = await Order.create({
    products,
    total,
    orderBy: _id
  })
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot get user cart",
  });
});

const UpdateStatusOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing Status");
  const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot get user cart",
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot get user cart",
  });
});

const getUserOrdersByAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Cannot get user cart",
  });
});

module.exports = {
  createNewOrder,
  UpdateStatusOrder,
  getUserOrders,
  getUserOrdersByAdmin
};
