import { useState } from "react";
import { Truck, Users, ShoppingBag, Clock, DollarSign, Shield, MapPin, Star } from "lucide-react";

export default function Choose() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Mock user data - in real app this would come from Clerk
  const user = { firstName: "Alex" };

  const handleOrderClick = () => {
    // In real app: navigate('/customer')
    alert("Navigating to customer dashboard...");
  };

  const handleCarrierClick = () => {
    // In real app: navigate('/carrier')
    alert("Navigating to carrier registration...");
  };

  const handleBackClick = () => {
    // In real app: navigate('/')
    alert("Navigating back to home...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-900 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-red-700 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <button onClick={handleBackClick} className="flex items-center space-x-3">
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-900 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">Campus Courier</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-full shadow-sm">
                    Fast & Smart
                  </span>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.firstName || "User"}!
              </span>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-red-700" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-red-900/80 to-red-700 bg-clip-text text-transparent">
            How Do You Want to Get Involved?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our campus food delivery community as a customer or carrier
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div 
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100/50 transform hover:scale-105 group cursor-pointer ${hoveredCard === 'customer' ? 'animate-bounce-gentle' : ''}`}
            onMouseEnter={() => setHoveredCard('customer')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                <ShoppingBag className="w-10 h-10 text-red-700" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-800 transition-colors duration-300">
                Order Food
              </h2>
              
              <p className="text-gray-600 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Get your favorite campus meals delivered quickly and affordably by verified student carriers.
              </p>
              
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  Campus-verified carriers only
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="w-3 h-3 text-white" />
                  </div>
                  Weather-adjusted fair pricing
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  Fast delivery under 15 minutes
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  Smart route optimization
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  5-star rated service
                </li>
              </ul>
              
              <button 
                onClick={handleOrderClick}
                className="w-full bg-red-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center group"
              >
                <ShoppingBag className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Start Ordering
              </button>
            </div>
          </div>

          {/* Carrier Card */}
          <div 
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100/50 transform hover:scale-105 group cursor-pointer ${hoveredCard === 'carrier' ? 'animate-bounce-gentle' : ''}`}
            onMouseEnter={() => setHoveredCard('carrier')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                <Truck className="w-10 h-10 text-blue-700" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors duration-300">
                Become a Carrier
              </h2>
              
              <p className="text-gray-600 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Earn money delivering food to fellow students with flexible schedules and optimized routes.
              </p>
              
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="w-3 h-3 text-white" />
                  </div>
                  Earn $15-25 per hour
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  Flexible scheduling
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  AI-optimized delivery routes
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  University student network
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  Secure payments & support
                </li>
              </ul>
              
              <button 
                onClick={handleCarrierClick}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center group"
              >
                <Truck className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Start Delivering
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-gradient-to-r from-red-900 to-red-700 rounded-2xl p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 animate-shimmer"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6">Join Our Growing Community</h3>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="transform transition-all duration-500 hover:scale-110">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Active Students</div>
              </div>
              <div className="transform transition-all duration-500 hover:scale-110">
                <div className="text-3xl font-bold mb-2">&lt; 15min</div>
                <div className="text-sm opacity-90">Avg Delivery</div>
              </div>
              <div className="transform transition-all duration-500 hover:scale-110">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-sm opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <button 
            onClick={handleBackClick}
            className="text-red-700 hover:text-red-800 font-medium transition-colors duration-300 inline-flex items-center group"
          >
            <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="ml-2">Back to Home</span>
          </button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `
      }}></style>
    </div>
  );
}