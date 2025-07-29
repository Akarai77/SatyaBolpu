
import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MAP from './pages/MAP'
import Daivaradhane from './pages/Daivaradhane'
import Editor from './components/Editor'
import CategoriesList from './pages/CategoriesList'
import CategoryPage from './pages/CategoryPage'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/map' element={<MAP/>}/>
        <Route path='/explore/daivaradhane' element={<Daivaradhane/>}/>
        <Route path='/editor' element={<Editor/>}/>
        <Route path='/:title/categories' element={<CategoriesList/>}/>
        <Route path='/:title/categories/:category' element={<CategoryPage />}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
