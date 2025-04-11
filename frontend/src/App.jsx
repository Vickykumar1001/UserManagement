import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import UserManagement from './UserManagement'
import Signup from './pages/Signup'
import Login from './pages/Login';
import Error from './pages/Error';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<UserManagement />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
