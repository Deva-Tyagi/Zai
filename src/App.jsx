import './App.css'
import Navbar from './components/navbar/Navbar'
import Privacy from './components/Privacy/Privacy'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Navbar />} />
        <Route path='/privacy' element={<Privacy />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
