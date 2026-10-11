import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import CartSummary from '../components/CartSummary.tsx'
import { addItem, selectCartItems } from '../features/cart/cartSlice.ts'
import { fetchCatalog } from '../features/catalog/catalogSlice.ts'

export default function ShoppingPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { categories, status } = useAppSelector((state) => state.catalog)
  const cartItems = useAppSelector(selectCartItems)

  const [categoryId, setCategoryId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')

  useEffect(() => {
    dispatch(fetchCatalog())
  }, [dispatch])

  const category = categories.find((c) => c.id === Number(categoryId))
  const product = category?.products.find((p) => p.id === Number(productId))

  function handleCategoryChange(id: string) {
    setCategoryId(id)
    setProductId('')
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!category || !product) return

    dispatch(
      addItem({
        productId: product.id,
        productName: product.name,
        categoryName: category.name,
        quantity: Number(quantity),
      }),
    )
    setProductId('')
    setQuantity('1')
  }

  return (
    <>
      <h1>רשימת קניות</h1>

      {status === 'loading' && <p className="muted">טוען מוצרים…</p>}
      {status === 'failed' && <p className="error">טעינת המוצרים נכשלה. נסו לרענן את הדף.</p>}

      <form className="add-item" onSubmit={handleSubmit}>
        <label>
          קטגוריה
          <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} required>
            <option value="">בחר קטגוריה</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          מוצר
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={!category}
            required
          >
            <option value="">בחר מוצר</option>
            {category?.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          כמות
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>

        <button type="submit">הוסף מוצר לסל</button>
      </form>

      <CartSummary />

      <button type="button" disabled={cartItems.length === 0} onClick={() => navigate('/order')}>
        המשך הזמנה
      </button>
    </>
  )
}
