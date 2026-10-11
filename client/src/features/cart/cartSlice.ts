import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store.ts'
import { submitOrder } from '../order/orderSlice.ts'

export interface CartItem {
  productId: number
  productName: string
  categoryName: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.productId === action.payload.productId)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitOrder.fulfilled, () => initialState)
  },
})

export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartByCategory = createSelector([selectCartItems], (items) => {
  const groups = new Map<string, CartItem[]>()
  for (const item of items) {
    groups.set(item.categoryName, [...(groups.get(item.categoryName) ?? []), item])
  }
  return [...groups].map(([categoryName, items]) => ({ categoryName, items }))
})

export const { addItem } = cartSlice.actions
export default cartSlice.reducer
