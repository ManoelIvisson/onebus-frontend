import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Trajetos from './pages/Trajetos'
import Viagens from './pages/Viagens'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/trajetos' element={<Trajetos />} />
          <Route path='/viagens' element={<Viagens />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
