import './App.css'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AuthProvider from "./contexts/AuthContext"
import AppRouter from './routers/AppRouter'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}

export default App
