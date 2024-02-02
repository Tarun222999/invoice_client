import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import HomePage from './pages/HomePage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import SignInPage from './pages/SignInPage.tsx'
import { AuthProvider } from './components/AuthProvider.tsx'
import { Toaster } from 'react-hot-toast'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <div><Toaster /></div>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
