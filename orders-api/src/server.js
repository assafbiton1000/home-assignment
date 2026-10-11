import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Order } from './order.js'

const port = process.env.PORT ?? 3001
const mongoUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017/shop'
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

const app = express()

app.use(cors({ origin: clientOrigin }))
app.use(express.json())

app.post('/orders', async (req, res) => {
  const { fullName, address, email, items } = req.body ?? {}

  try {
    const order = await Order.create({ fullName, address, email, items })
    res.status(201).json({ id: order.id })
  } catch (err) {
    if (err.name !== 'ValidationError') throw err
    res.status(400).json({ error: err.message })
  }
})

await mongoose.connect(mongoUrl)
app.listen(port, () => console.log(`Orders API listening on port ${port}`))
