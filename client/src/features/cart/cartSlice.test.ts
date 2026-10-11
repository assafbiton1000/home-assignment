import { expect, test } from 'vitest'
import type { RootState } from '../../app/store.ts'
import reducer, { addItem, selectCartByCategory } from './cartSlice.ts'
import type { CartItem } from './cartSlice.ts'

const cottage: CartItem = { productId: 1, productName: "קוטג'", categoryName: 'חלב וגבינות', quantity: 1 }
const milk: CartItem = { productId: 2, productName: 'חלב 3%', categoryName: 'חלב וגבינות', quantity: 2 }
const salmon: CartItem = { productId: 7, productName: 'סלמון', categoryName: 'בשר ודגים', quantity: 1 }

const cartOf = (...items: CartItem[]) =>
  items.reduce((state, item) => reducer(state, addItem(item)), reducer(undefined, { type: 'init' }))

test('adding the same product twice merges the quantities', () => {
  const cart = cartOf(cottage, { ...cottage, quantity: 3 })

  expect(cart.items).toEqual([{ ...cottage, quantity: 4 }])
})

test('the cart is grouped by category', () => {
  const state = { cart: cartOf(cottage, salmon, milk) } as RootState

  expect(selectCartByCategory(state)).toEqual([
    { categoryName: 'חלב וגבינות', items: [cottage, milk] },
    { categoryName: 'בשר ודגים', items: [salmon] },
  ])
})
