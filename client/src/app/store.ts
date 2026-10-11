import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice.ts'
import catalogReducer from '../features/catalog/catalogSlice.ts'
import orderReducer from '../features/order/orderSlice.ts'

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    cart: cartReducer,
    order: orderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
