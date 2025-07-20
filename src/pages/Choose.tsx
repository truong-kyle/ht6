import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Car,
  Users,
  ShoppingBag,
  Clock,
  DollarSign,
  Shield,
  MapPin,
  Star,
} from "lucide-react";

export default function Choose() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const handleOrderClick = () => {
    navigate("/customer");
  };

  const handleCarrierClick = () => {
    navigate("/courier");
  };

  const handleBackClick = () => {
    navigate("/"); // Navigate back to App.tsx (root route)
  };

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-red-900 to-red-700 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Car className="w-7 h-7 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 relative overflow-hidden">
      {/* Animated Background Elements with different animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-900 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-red-700 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-drift"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-3"
              >
                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-12 h-12 rounded-xl shadow-lg animate-wiggle overflow-hidden">
                    <img
                      src="DormDash.png"
                      alt="DormDash Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    DormDash
                  </span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-full shadow-sm animate-glow">
                    Fast & Smart
                  </span>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.firstName || user?.username || "User"}!
              </span>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-red-100 flex items-center justify-center">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user?.firstName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-4 h-4 text-red-700" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
          <div className="text-center mt-12 absolute top-12 left-5 ">
            <button
              onClick={handleBackClick}
              className="text-red-700 hover:text-red-800 font-medium transition-all duration-300 inline-flex items-center group hover:scale-105 animate-fade-in hover:cursor-pointer"
            >
              <span className="transform transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-125">
                ←
              </span>
              <span className="ml-2">Back to Home</span>
            </button>
          </div>
      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-red-900/80 to-red-700 bg-clip-text text-transparent animate-text-glow">
            How Do You Want to Get Involved?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Join our campus food delivery community as a customer or carrier
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100/50 transform hover:scale-105 hover:-rotate-2 group cursor-pointer ${
              hoveredCard === "customer" ? "animate-pulse-glow" : ""
            }`}
            onMouseEnter={() => setHoveredCard("customer")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleOrderClick}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-180 shadow-lg animate-bob">
                <ShoppingBag className="w-10 h-10 text-red-700" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-800 transition-colors duration-300">
                Order Food
              </h2>

              <p className="text-gray-600 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Get your favorite campus meals delivered quickly and affordably
                by verified student carriers.
              </p>

              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-spin-slow">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  Campus-verified carriers only
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-bounce-coin">
                    <DollarSign className="w-3 h-3 text-white" />
                  </div>
                  Weather-adjusted fair pricing
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-tick">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  Fast delivery under 15 minutes
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-ping-slow">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  Smart route optimization
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-twinkle">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  5-star rated service
                </li>
              </ul>

              <button
                onClick={handleOrderClick}
                className="w-full bg-red-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center group animate-button-glow"
              >
                <ShoppingBag className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Start Ordering
              </button>
            </div>
          </div>

          {/* Carrier Card */}
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100/50 transform hover:scale-105 hover:rotate-2 group cursor-pointer ${
              hoveredCard === "carrier" ? "animate-pulse-glow" : ""
            }`}
            onMouseEnter={() => setHoveredCard("carrier")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleCarrierClick}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg animate-drive">
                <img
                  src="boxes.png"
                  alt="Carrier Icon"
                  className="w-10 h-10 object-contain"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors duration-300">
                Become a Carrier
              </h2>

              <p className="text-gray-600 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Earn money delivering food to fellow students with flexible
                schedules and optimized routes.
              </p>

              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-bounce-coin">
                    <DollarSign className="w-3 h-3 text-white" />
                  </div>
                  Earn $15-25 per hour
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-tick">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  Flexible scheduling
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-ping-slow">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  AI-optimized delivery routes
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-spin-slow">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  University student network
                </li>
                <li className="flex items-center transform transition-all duration-300 hover:translate-x-3 hover:scale-105">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-spin-slow">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  Secure payments & support
                </li>
              </ul>

              <button
                onClick={handleCarrierClick}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center group animate-button-glow"
              >
                Start Delivering
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-gradient-to-r from-red-900 to-red-700 rounded-2xl p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden animate-wave">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 animate-slide"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6 animate-fade-in">
              Join Our Growing Community
            </h3>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="transform transition-all duration-500 hover:scale-110 animate-count-up">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Active Students</div>
              </div>
              <div className="transform transition-all duration-500 hover:scale-110 animate-count-up">
                <div className="text-3xl font-bold mb-2">&lt; 15min</div>
                <div className="text-sm opacity-90">Avg Delivery</div>
              </div>
              <div className="transform transition-all duration-500 hover:scale-110 animate-count-up">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-sm opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }

        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25% { transform: translateX(10px) translateY(-10px) rotate(90deg); }
          50% { transform: translateX(0px) translateY(-20px) rotate(180deg); }
          75% { transform: translateX(-10px) translateY(-10px) rotate(270deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(220, 38, 38, 0.5); }
          50% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.8); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(220, 38, 38, 0.3); }
          50% { text-shadow: 0 0 20px rgba(220, 38, 38, 0.6); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 40px rgba(220, 38, 38, 0.8);
            transform: scale(1.02);
          }
        }

        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes drive {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(5px) rotate(2deg); }
          50% { transform: translateX(0px) rotate(0deg); }
          75% { transform: translateX(-5px) rotate(-2deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-coin {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-8px) scaleY(0.8); }
        }

        @keyframes tick {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(360deg); }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.2); opacity: 0; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        @keyframes button-glow {
          0%, 100% { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 8px 30px rgba(220, 38, 38, 0.4); }
        }

        @keyframes slide {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes wave {
          0%, 100% { transform: perspective(1000px) rotateX(0deg); }
          50% { transform: perspective(1000px) rotateX(2deg); }
        }

        @keyframes count-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0px); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-drift {
          animation: drift 10s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bob {
          animation: bob 3s ease-in-out infinite;
        }

        .animate-drive {
          animation: drive 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-bounce-coin {
          animation: bounce-coin 1.5s ease-in-out infinite;
        }

        .animate-tick {
          animation: tick 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-button-glow {
          animation: button-glow 3s ease-in-out infinite;
        }

        .animate-slide {
          animation: slide 3s linear infinite;
        }

        .animate-wave {
          animation: wave 4s ease-in-out infinite;
        }

        .animate-count-up {
          animation: count-up 1s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
        }
        `,
        }}
      ></style>
    </div>
  );
}
