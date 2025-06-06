
import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MAP from './pages/MAP'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/map' element={<MAP/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
