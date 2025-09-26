import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
            <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover />
        </AuthProvider>
    </StrictMode>
)
