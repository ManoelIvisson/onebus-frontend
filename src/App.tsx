import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Frotas from './pages/Frotas'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'
import Rotas from './pages/Rotas'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/frotas' element={<Frotas />} />
          <Route path='/rotas' element={<Rotas />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
