import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BuyPage from './pages/BuyPage'
import RentPage from './pages/RentPage'
import PlotsPage from './pages/PlotsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/buy" />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/plots" element={<PlotsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App