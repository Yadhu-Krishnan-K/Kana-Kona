import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { SignUp, Home, Login, Profile, Settings } from './pages';
import {NavBar} from './components'
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from "./store/useThemeStore";
import {Toaster} from 'react-hot-toast'
function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(()=>{
    checkAuth()
  },[])
  
  if(!authUser && isCheckingAuth){
    return (<div className='flex items-center justify-center h-screen'>
      <span className="loading loading-infinity loading-lg"></span>
    </div>)
  }

  return (
    <>  
    <div data-theme={theme}>
        <NavBar />
        <Routes>
          <Route path='/' element={!authUser?<SignUp/>:<Navigate to={'/home'}/>} />
          <Route path='/home' element={authUser?<Home/>:<Navigate to={'/'}/>}  />
          <Route path='/login' element={!authUser?<Login/>:<Navigate to={'/home'}/>} />
          <Route path='/profile' element={authUser?<Profile/>:<Navigate to={'/'}/>} />
          <Route path='/settings' element={authUser?<Settings/>:<Navigate to={'/'}/>} />
        </Routes>
        <Toaster />
    </div>
    </>
  )
}

export default App