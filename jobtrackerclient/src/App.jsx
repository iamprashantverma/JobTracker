import './App.css'
import SignUp from './pages/SignUp'
import Login from './pages/LogIn'
import NavBar from './component/NavBar'
import { ToastContainer } from 'react-bootstrap'
function App() {
 
  return (
    <>
    <ToastContainer/>
    <NavBar/>
    <Login/>
    <SignUp/>
    </>
  )
}

export default App
