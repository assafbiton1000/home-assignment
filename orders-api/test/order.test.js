import test from 'node:test'
import assert from 'node:assert/strict'
import { Order } from '../src/order.js'

const validOrder = {
  fullName: 'ישראל ישראלי',
  address: 'הרצל 1, תל אביב',
  email: 'israel@example.com',
  items: [{ productId: 1, productName: "קוטג'", categoryName: 'חלב וגבינות', quantity: 2 }],
}

const errorsOf = (order) => Object.keys(new Order(order).validateSync()?.errors ?? {}).sort()

test('accepts a complete order', () => {
  assert.deepEqual(errorsOf(validOrder), [])
})

test('requires the customer details', () => {
  assert.deepEqual(errorsOf({ items: validOrder.items }), ['address', 'email', 'fullName'])
})

test('rejects a malformed email', () => {
  assert.deepEqual(errorsOf({ ...validOrder, email: 'israel@example' }), ['email'])
})

test('rejects an order without items', () => {
  assert.deepEqual(errorsOf({ ...validOrder, items: [] }), ['items'])
})

test('rejects a non-positive quantity', () => {
  const items = [{ ...validOrder.items[0], quantity: 0 }]
  assert.deepEqual(errorsOf({ ...validOrder, items }), ['items.0.quantity'])
})
