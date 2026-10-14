import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import CartSummary from '../components/CartSummary.tsx'
import { selectCartItems } from '../features/cart/cartSlice.ts'
import { resetOrder, submitOrder } from '../features/order/orderSlice.ts'

export default function OrderPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const { status, orderId } = useAppSelector((state) => state.order)
  const [form, setForm] = useState({ fullName: '', address: '', email: '' })

  // Leaving the page clears the last result, so the next visit starts a fresh order
  useEffect(() => () => void dispatch(resetOrder()), [dispatch])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    dispatch(submitOrder({ ...form, items }))
  }

  if (status === 'succeeded') {
    return (
      <>
        <h1>ההזמנה התקבלה</h1>
        <p>מספר הזמנה: {orderId}</p>
        <Link to="/">להזמנה חדשה</Link>
      </>
    )
  }

  if (items.length === 0) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <h1>סיכום ההזמנה</h1>

      <CartSummary />

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          שם פרטי ומשפחה
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>

        <label>
          כתובת מלאה
          <input name="address" value={form.address} onChange={handleChange} required />
        </label>

        <label>
          מייל
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        {status === 'failed' && <p className="error">שליחת ההזמנה נכשלה. נסו שוב.</p>}

        <div className="actions">
          <button type="submit" disabled={status === 'loading'}>
            אשר הזמנה
          </button>
          <Link to="/">חזרה לרשימת הקניות</Link>
        </div>
      </form>
    </>
  )
}
