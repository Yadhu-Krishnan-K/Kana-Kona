import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'
import { useAuthStore } from './store/useAuthStore'
import { NavBar } from './components'
import { Toaster } from 'react-hot-toast'

const SignUp = lazy(() => import('./pages/SignUp'))
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const VerifyOTP = lazy(() => import('./pages/VerifyOtp'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))

function App() {

  const { authUser, checkAuth, isCheckingAuth, openOtpPage } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [])


  if (isCheckingAuth) {
    return (<div className='flex items-center justify-center h-screen'>
      <span className="loading loading-infinity loading-lg"></span>
    </div>)
  }

  return (
    <>
      <div data-theme={theme}>
        <NavBar />
        <Suspense fallback={
          <div className='flex items-center justify-center h-screen'>
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        }>
          <Routes>
            <Route path='/' element={!authUser ? <SignUp /> : <Navigate to={'/home'} />} />
            <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/home'} />} />
            <Route path='/verify-otp' element={!authUser && openOtpPage ? <VerifyOTP /> : <Navigate to={'/home'} />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>



            {/* <Route path='/forgot-password' element={!authUser?<ForgotPassword/>:<Navigate to={'/home'}/>} /> */}
            {/* <Route path='/reset-password' element={!authUser?<ResetPassword/>:<Navigate to={'/home'}/>} /> */}


            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </>
  )
}

export default App