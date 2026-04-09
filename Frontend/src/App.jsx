import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { SignUp, Home, Login, Profile, Settings } from './pages';
import {NavBar} from './components'
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from "./store/useThemeStore";
import {Toaster} from 'react-hot-toast'
import VerifyOTP from './pages/VerifyOtp';
import NotFound from './pages/NotFound';
// import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
// import ResetPassword from './pages/ForgotPassword/ResetPassword';
function App() {

  const {authUser, checkAuth, isCheckingAuth,openOtpPage} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(()=>{
    checkAuth()
  },[])
  // useEffect(()=>{
  //   console.log('openOtpPage🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒 =',openOtpPage)
  //   console.log('authUser🐵🐵🐵🐵🐵🐵🐵🐵🐵🐵🐵🐵=',authUser)
  // },[openOtpPage,authUser])
  
  if(isCheckingAuth){
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
          <Route path='/verify-otp' element={!authUser&&openOtpPage?<VerifyOTP/>:<Navigate to={'/home'}/>} />
          {/* <Route path='/forgot-password' element={!authUser?<ForgotPassword/>:<Navigate to={'/home'}/>} /> */}
          {/* <Route path='/reset-password' element={!authUser?<ResetPassword/>:<Navigate to={'/home'}/>} /> */}


          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster />
    </div>
    </>
  )
}

export default App