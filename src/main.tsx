import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Customer from './pages/Customer.tsx'
import Courier from './pages/Courier.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import "leaflet/dist/leaflet.css";

//  publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key - Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file")
}

// App Router component
function AppRouter() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while auth state is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing page route - your App.tsx */}
      <Route path="/" element={<App />} />

      {/* Auth routes - redirect to dashboard if already signed in */}
      <Route
        path="/login/*"
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected routes - require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="w-screen h-screen bg-[#7a1212] flex items-center justify-center">
              <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-sm w-full">
                <img src="src/assets/No-background.png" alt="DormDash Logo" className="mx-auto mb-6 w-24 h-24" />
                <h1 className="text-3xl font-bold mb-8 text-[#801515]">Choose Your Role</h1>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => window.location.href = '/courier'}
                    className="transition-all duration-300 border-2 border-white bg-white text-[#801515] hover:bg-[#801515] hover:text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    I'm a Courier
                  </button>
                  <button
                    onClick={() => window.location.href = '/customer'}
                    className="transition-all duration-300 border-2 border-white bg-white text-[#801515] hover:bg-[#801515] hover:text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    I'm a Customer
                  </button>
                </div>
              </div>
            </div>


          </ProtectedRoute>
        }
      />

      <Route
        path="/courier"
        element={
          <ProtectedRoute>
            <Courier />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <Customer />
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to home */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      0    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)