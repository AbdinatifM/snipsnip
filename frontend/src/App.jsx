import { useState } from 'react'
import './App.css'
import "remixicon/fonts/remixicon.css";
import { Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'

function App() {

  return (
    <>
    <Routes>
      <Route  path='/' element={<MainPage />}/>
    </Routes>
    </>
  )
}

export default App
