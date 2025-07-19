import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-800 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-red-900 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Food delivery themed decorative elements */}
      <div className="absolute top-10 left-1/4 text-6xl opacity-5 animate-bounce animation-delay-1000">🍕</div>
      <div className="absolute bottom-32 right-1/4 text-5xl opacity-5 animate-bounce animation-delay-3000">🍔</div>
      <div className="absolute top-1/3 right-10 text-4xl opacity-5 animate-bounce animation-delay-5000">🍜</div>

      <div className="max-w-md w-full space-y-8 p-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto mb-4 text-6xl">🚚</div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-gray-900 via-red-800 to-red-900 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your campus food delivery account
          </p>
          <p className="text-xs text-red-700 font-medium mt-1">
            🏫 York University Campus Delivery
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignIn 
            routing="path" 
            path="/login"
            signInUrl="/dashboard"
            signUpUrl="/login"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl border-0 bg-white/90 backdrop-blur-sm border border-white/20",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/95 hover:bg-white border border-gray-200 text-gray-700 hover:border-red-800/30 transition-all duration-300 hover:shadow-lg",
                formButtonPrimary: "bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-105",
                footerActionLink: "text-red-800 hover:text-red-700 transition-colors duration-300",
                formFieldInput: "border-gray-200 focus:border-red-800 focus:ring-red-800/20",
                formFieldLabel: "text-gray-700",
                identityPreviewText: "text-gray-600",
                identityPreviewEditButton: "text-red-800 hover:text-red-700"
              },
              variables: {
                colorPrimary: "#7f1d1d", // red-900
                colorBackground: "#ffffff",
                colorInputBackground: "#ffffff",
                colorInputText: "#374151",
                colorText: "#374151",
                colorTextSecondary: "#6b7280",
                borderRadius: "0.5rem"
              }
            }}
          />
        </div>

        {/* Additional context for food delivery */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🕒 Fast delivery • 📍 Campus-wide coverage • ⭐ Trusted carriers</p>
        </div>
      </div>

      <style>{`
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-3000 { animation-delay: 3000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
        .animation-delay-5000 { animation-delay: 5000ms; }
      `}</style>
    </div>
  );
}