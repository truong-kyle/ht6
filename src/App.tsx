import { useState, useEffect } from "react";
// CHANGE: Added useNavigate import for React Router navigation
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, DollarSign, Shield, Users, Truck, CloudRain, Route, Star } from "lucide-react";
import { testWeatherOutput} from "./services/weatherService";
import { checkIncentive } from "./services/checkIncentives";

testWeatherOutput()
checkIncentive()
export default function CampusCourierLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // CHANGE: Added useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // CHANGE: Added navigation handler for Order Now buttons
  const handleOrderNow = () => {
    navigate('/login');
  };

  // CHANGE: Added navigation handler for Carrier buttons
  const handleBecomeCarrier = () => {
    navigate('/login');
  };

  const featureCards = [
    {
      icon: <MapPin className="w-8 h-8 text-red-700" />,
      title: "Smart Route Optimization",
      description: "Our TSP algorithm finds the most efficient delivery routes, reducing wait times and maximizing carrier earnings.",
      highlight: "AI-powered routing",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      icon: <CloudRain className="w-8 h-8 text-blue-600" />,
      title: "Weather-Aware Pricing",
      description: "Dynamic pricing adjusts automatically based on weather conditions using real-time OpenWeatherAPI data.",
      highlight: "Smart weather fees",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Campus-Only Security",
      description: "University email verification and student ID confirmation ensure safe, trusted deliveries within campus bounds.",
      highlight: "Verified students only",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Place Your Order",
      description: "Search food categories, select items, and confirm your delivery request",
      icon: <Users className="w-6 h-6" />
    },
    {
      step: "2",
      title: "Smart Matching",
      description: "Our algorithm matches you with the nearest available campus carrier",
      icon: <Route className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Real-Time Tracking",
      description: "Track your delivery with live updates and weather-adjusted ETAs",
      icon: <Clock className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Secure Payment",
      description: "Pay securely through Stripe with automatic weather fee calculations",
      icon: <DollarSign className="w-6 h-6" />
    }
  ];

  const stats = [
    { value: "< 15min", label: "Average Delivery" },
    { value: "95%", label: "On-Time Rate" },
    { value: "$2-8", label: "Delivery Range" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-red-50/30 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-900 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-red-700 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className={`w-full max-w-none px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="flex justify-between items-center py-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 group">
              <div className="transform transition-transform duration-300 group-hover:scale-110">
              <div className="w-12 h-12 bg-gradient-to-r from-red-900 to-red-700 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
  <img 
    src="src/assets/DormDash.png" 
    alt="Courier Logo" 
    className="w-full h-full object-cover" 
  />
</div>

              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">DormDash</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-full shadow-sm">
                  Fast & Smart
                </span>
              </div>
              
            </div>
            
            {/* CHANGE: Added onClick handlers to header buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBecomeCarrier}
                className="px-4 py-2 text-red-900 hover:text-red-700 font-medium transition-all duration-300 transform hover:scale-105 hover:bg-red-50 rounded-lg"
              >
                For Carriers
              </button>
              <button 
                onClick={handleOrderNow}
                className="px-6 py-2 bg-red-900 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-red-800"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="w-full">
        {/* Hero Section */}
        <main className="w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-red-900/80 to-red-700 bg-clip-text text-transparent">
              Campus Food <span className="bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">Delivery</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Smart, fast, and reliable food delivery for university students. Weather-aware pricing, 
              AI-optimized routes, and campus-verified carriers.
            </p>
            <div className={`flex justify-center space-x-8 text-sm text-gray-500 mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              {[
                { color: "bg-red-500", text: "AI Route Optimization" },
                { color: "bg-blue-500", text: "Weather Integration" },
                { color: "bg-green-500", text: "Campus Verified" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center group transform transition-all duration-300 hover:scale-110">
                  <div className={`w-2 h-2 ${item.color} rounded-full mr-2 animate-pulse group-hover:animate-bounce`}></div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* CHANGE: Added onClick handlers to hero CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={handleOrderNow}
                className="inline-flex items-center px-8 py-4 bg-red-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-red-800 group"
              >
                <Truck className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Order Food Now
              </button>
              <button 
                onClick={handleBecomeCarrier}
                className="inline-flex items-center px-8 py-4 bg-gray-100/80 backdrop-blur-sm text-gray-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Carrier
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="transform transition-all duration-500 hover:scale-110 animate-fade-in-up" style={{ animationDelay: `${400 + idx * 200}ms` }}>
                  <div className="text-2xl font-bold text-red-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {featureCards.map((card, idx) => (
              <div 
                key={idx}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:bg-white/90 ${
                  hoveredCard === idx ? 'animate-bounce-gentle' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className={`w-16 h-16 ${card.bgColor} rounded-xl flex items-center justify-center mb-6 transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 transition-colors duration-300 hover:text-red-800">{card.title}</h3>
                <p className="text-gray-600 mb-4 transition-colors duration-300 hover:text-gray-800">
                  {card.description}
                </p>
                <div className={`text-sm ${card.textColor} font-medium transition-all duration-300 hover:scale-105`}>
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From order to delivery in four smart steps, optimized for campus life
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative group animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full mb-4 mx-auto font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-lg mb-2">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Connecting Arrow */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <div className="w-6 h-0.5 bg-gradient-to-r from-red-300 to-red-500 relative">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-red-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technology Highlight */}
          <div className={`bg-gradient-to-r from-red-900 to-red-700 rounded-2xl p-8 text-white text-center mb-16 shadow-2xl transform transition-all duration-1000 delay-900 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 animate-shimmer"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Powered by Smart Technology</h2>
              <p className="text-lg mb-6 opacity-90">
                Advanced algorithms, real-time weather data, and secure payments all in one platform
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {[
                  { icon: <Route className="w-6 h-6" />, label: "TSP Algorithm" },
                  { icon: <CloudRain className="w-6 h-6" />, label: "Weather API" },
                  { icon: <DollarSign className="w-6 h-6" />, label: "Stripe Payments" },
                  { icon: <MapPin className="w-6 h-6" />, label: "Real-time Maps" }
                ].map((tech, idx) => (
                  <div key={idx} className="flex flex-col items-center transform transition-all duration-500 hover:scale-110 animate-fade-in-up" style={{ animationDelay: `${600 + idx * 100}ms` }}>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/30 transition-all duration-300">
                      {tech.icon}
                    </div>
                    <span className="text-sm font-medium">{tech.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className={`text-center transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience Smart Delivery?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who trust Campus Courier for fast, reliable food delivery
            </p>
            {/* CHANGE: Added onClick handler to final CTA "Start Ordering" button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOrderNow}
                className="inline-flex items-center px-8 py-4 bg-red-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-red-800 group"
              >
                <Star className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Start Ordering
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-red-200 text-red-800 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-red-50 hover:border-red-300">
                Learn More
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Delivery Bot */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-gentle">
        <div className="relative group">
          <div className="w-16 h-16 bg-white rounded-full shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center justify-center border-4 border-red-200 hover:border-red-300">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Robot Body */}
              <rect x="30" y="60" width="40" height="25" rx="8" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
              
              {/* Robot Head */}
              <rect x="35" y="35" width="30" height="30" rx="15" fill="#EF4444" stroke="#991B1B" strokeWidth="2"/>
              
              {/* Eyes */}
              <circle cx="42" cy="45" r="3" fill="#991B1B"/>
              <circle cx="58" cy="45" r="3" fill="#991B1B"/>
              <circle cx="42" cy="44" r="1" fill="white"/>
              <circle cx="58" cy="44" r="1" fill="white"/>
              
              {/* Smile */}
              <path d="M45 55 Q50 58, 55 55" stroke="#991B1B" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              {/* Delivery Box */}
              <rect x="40" y="20" width="20" height="12" rx="2" fill="#FCA5A5" stroke="#991B1B" strokeWidth="1"/>
              <line x1="45" y1="20" x2="45" y2="32" stroke="#991B1B" strokeWidth="1"/>
              <line x1="55" y1="20" x2="55" y2="32" stroke="#991B1B" strokeWidth="1"/>
              <line x1="40" y1="26" x2="60" y2="26" stroke="#991B1B" strokeWidth="1"/>
              
              {/* Wheels */}
              <circle cx="38" cy="88" r="6" fill="#374151" stroke="#991B1B" strokeWidth="1"/>
              <circle cx="62" cy="88" r="6" fill="#374151" stroke="#991B1B" strokeWidth="1"/>
              <circle cx="38" cy="88" r="3" fill="#6B7280"/>
              <circle cx="62" cy="88" r="3" fill="#6B7280"/>
              
              {/* Antenna */}
              <line x1="50" y1="35" x2="50" y2="28" stroke="#991B1B" strokeWidth="2"/>
              <circle cx="50" cy="25" r="2" fill="#EF4444" stroke="#991B1B" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-20 right-0 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pointer-events-none whitespace-nowrap">
            <div className="text-sm font-medium">Need help? I'm CourierBot! 🤖</div>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white/90"></div>
          </div>
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `}
      </style>
    </div>
  );
}