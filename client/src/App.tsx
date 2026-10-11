import { Navigate, Route, Routes } from 'react-router-dom'
import OrderPage from './pages/OrderPage.tsx'
import ShoppingPage from './pages/ShoppingPage.tsx'

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<ShoppingPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
