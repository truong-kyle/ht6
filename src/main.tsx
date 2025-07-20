import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Customer from './pages/Customer.tsx'
import Courier from './pages/Courier.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import Welcome from './pages/Welcome.tsx'
import Choose from './pages/Choose.tsx' // Add this import
import "leaflet/dist/leaflet.css";

//  publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key - Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file")
}

// Enhanced Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-900 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-red-700 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
      
      <div className="flex flex-col items-center space-y-6 relative z-10">
        {/* Campus Courier Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-r from-red-900 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">Campus Courier</span>
            <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-full">
              Loading...
            </span>
          </div>
        </div>
        
        {/* Loading Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 absolute top-0 left-0"></div>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">Getting things ready...</p>
          <p className="text-sm text-gray-600">🚚 Smart delivery platform loading</p>
        </div>
      </div>
    </div>
  );
}

// App Router component
function AppRouter() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show enhanced loading while auth state is being determined
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Landing page route - your App.tsx */}
      <Route path="/" element={<App />} />
      
      {/* Auth routes - redirect to dashboard if already signed in */}
      <Route 
        path="/login/*" 
        element={isSignedIn ? <Navigate to="/choose" replace /> : <Login />} 
      />
      
      <Route 
        path="/register/*" 
        element={isSignedIn ? <Navigate to="/choose" replace /> : <Register />} 
      />

      {/* Welcome route for new users */}
      <Route 
        path="/welcome" 
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        } 
      />

      {/* Choose route - main dashboard */}
      <Route 
        path="/choose" 
        element={
          <ProtectedRoute>
            <Choose />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard route - redirect to choose */}
      <Route 
        path="/dashboard" 
        element={<Navigate to="/choose" replace />} 
      />
      
      {/* Protected courier route */}
      <Route 
        path="/courier" 
        element={
          <ProtectedRoute>
            <Courier />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected customer route */}
      <Route 
        path="/customer" 
        element={
          <ProtectedRoute>
            <Customer />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#7f1d1d', // red-900
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#374151',
          colorText: '#374151',
          colorTextSecondary: '#6b7280',
          borderRadius: '0.5rem'
        }
      }}
      signInUrl="/login"
      signUpUrl="/register"
      afterSignInUrl="/choose"
      afterSignUpUrl="/welcome"
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)