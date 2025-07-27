// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Home from './pages/Home';
import ForgotPasswordPage from './pages/ForgetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ItemDetail from './pages/items/ItemDetail';
import FloatingAddButton from './components/FloatingAddButton';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              
              <Home />
              {/* <Navbar/> */}
              <FloatingAddButton />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/item/:id" element={
          <>
            <ItemDetail />
            <FloatingAddButton />
          </>
        } />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;