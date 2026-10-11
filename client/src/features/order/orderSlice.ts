import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { CartItem } from '../cart/cartSlice.ts'

export interface OrderRequest {
  fullName: string
  address: string
  email: string
  items: CartItem[]
}

interface OrderState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  orderId: string | null
}

const initialState: OrderState = {
  status: 'idle',
  orderId: null,
}

export const submitOrder = createAsyncThunk('order/submit', async (order: OrderRequest) => {
  const response = await fetch(`${import.meta.env.VITE_ORDERS_API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  if (!response.ok) throw new Error(`Order request failed with status ${response.status}`)
  const { id } = (await response.json()) as { id: string }
  return id
})

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orderId = action.payload
      })
      .addCase(submitOrder.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { resetOrder } = orderSlice.actions
export default orderSlice.reducer
