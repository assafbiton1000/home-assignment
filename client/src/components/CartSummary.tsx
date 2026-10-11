import { useAppSelector } from '../app/hooks.ts'
import { selectCartByCategory } from '../features/cart/cartSlice.ts'

export default function CartSummary() {
  const groups = useAppSelector(selectCartByCategory)

  if (groups.length === 0) {
    return <p className="muted">הסל ריק</p>
  }

  return (
    <div className="cart">
      {groups.map((group) => (
        <section key={group.categoryName} className="cart-group">
          <h2>{group.categoryName}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.productId}>
                {item.productName} – {item.quantity}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
