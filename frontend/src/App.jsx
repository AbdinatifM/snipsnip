import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainPage from './pages/MainPage'

function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route  path='/' element={<MainPage />}/>
    </Routes>
    </>
  )
}

export default App
