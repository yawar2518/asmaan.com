import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import BuyPage from './pages/BuyPage'
import RentPage from './pages/RentPage'
import PlotsPage from './pages/PlotsPage'
import SellPage from './pages/SellPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import LoginPage from './pages/LoginPage'
import SellerStatusPage from './pages/SellerStatusPage'
import AgentDashboardPage from './pages/agent/AgentDashboardPage'
import AgentVisitDetailPage from './pages/agent/AgentVisitDetailPage'
import AdminQueuePage from './pages/admin/AdminQueuePage'
import AdminReviewPage from './pages/admin/AdminReviewPage'
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/buy" />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/plots" element={<PlotsPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/track/:token" element={<SellerStatusPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/agent/dashboard" element={
            <ProtectedRoute role="agent"><AgentDashboardPage /></ProtectedRoute>
          } />
          <Route path="/agent/visit/:id" element={
            <ProtectedRoute role="agent"><AgentVisitDetailPage /></ProtectedRoute>
          } />

          <Route path="/admin/queue" element={
            <ProtectedRoute role="staff"><AdminQueuePage /></ProtectedRoute>
          } />
          <Route path="/admin/review/:id" element={
            <ProtectedRoute role="staff"><AdminReviewPage /></ProtectedRoute>
          } />
          <Route path="/admin/properties" element={
            <ProtectedRoute role="staff"><AdminPropertiesPage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App