import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MAP from './pages/MAP'
import Daivaradhane from './pages/Daivaradhane'
import Editor from './components/Editor'
import CategoriesList from './pages/CategoriesList'
import CategoryPage from './pages/CategoryPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        limit={5}
        className='space-y-2'
        toastClassName={
          `relative font-semibold flex p-4 min-h-10 max-w-fit text-md rounded-md 
          justify-between overflow-hidden cursor-pointer mb-2 shadow-lg`
        }
        closeButton={true}
        hideProgressBar={false}
        draggable={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        pauseOnHover={true}
        theme='dark'
        style={{
          width: '320px',
        }}
      />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/profile' element={<Profile/>}/>
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
