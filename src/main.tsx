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
            {/* You'll need to create a dashboard component or redirect to another page */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Choose Your Role</h1>
                <div className="space-x-4">
                  <button 
                    onClick={() => window.location.href = '/courier'}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    I'm a Courier
                  </button>
                  <button 
                    onClick={() => window.location.href = '/customer'}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
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