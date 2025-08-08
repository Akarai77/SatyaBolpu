import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MAP from './pages/MAP'
import Editor from './pages/Editor'
import Categories from './pages/Categories'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard'
import Updates from './pages/Updates'
import BasicDetails from './pages/BasicDetails'

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
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/new-post' element={<BasicDetails/>}/>
        <Route path='/new-post/editor' element={<Editor/>}/>
        <Route path='/updates' element={<Updates />}/>
        <Route path='/:title/categories' element={<Categories/>}/>
        <Route path='/map' element={<MAP/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
