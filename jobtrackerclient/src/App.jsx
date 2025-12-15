import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import NavBar from './component/NavBar'
import Login from './pages/LogIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import JobList from './pages/JobList'
import AddJob from './pages/AddJob'
import EditJob from './pages/EditJob'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="page-container">
      <NavBar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={
            <PublicRoute>
              <div className="auth-container">
                <Login />
              </div>
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <div className="auth-container">
                <SignUp />
              </div>
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          } />
          <Route path="/jobs/add" element={
            <ProtectedRoute>
              <AddJob />
            </ProtectedRoute>
          } />
          <Route path="/jobs/edit/:id" element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App
