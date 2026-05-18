import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LeadPage from './pages/leads/LeadPage';
import UserPage from './pages/users/UserPage';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './pages/login/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 PRIVATE */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
        
          <Route path="leads" element={<LeadPage />} />
          <Route path="users" element={<UserPage />} />
        </Route>

        {/* 🔄 DEFAULT */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;