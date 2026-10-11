import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    productName: { type: String, required: true, trim: true },
    categoryName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, validate: Number.isInteger },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    items: {
      type: [itemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },
  },
  { timestamps: true },
)

export const Order = mongoose.model('Order', orderSchema)
