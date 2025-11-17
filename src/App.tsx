import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Trajetos from './pages/Trajetos'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/trajetos' element={<Trajetos />} />
      </Routes>
    </Router>
  )
}

export default App
