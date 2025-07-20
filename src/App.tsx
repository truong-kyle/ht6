import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Users,
  Truck,
  CloudRain,
  Route,
  Star,
  LogOut,
  UserPlus,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { testWeatherOutput } from "./services/weatherService";
import { checkIncentive } from "./services/checkIncentives";

export default function CampusCourierLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setIsVisible(true);
    // side‑effects
    testWeatherOutput();
    checkIncentive();
  }, []);

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/register");
  const handleDashboard = () => navigate("/dashboard");
  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const featureCards = [
    {
      icon: <MapPin className="w-8 h-8 text-red-700" />,
      title: "Smart Route Optimization",
      description:
        "Our TSP algorithm finds the most efficient delivery routes, reducing wait times and maximizing carrier earnings.",
      highlight: "AI-powered routing",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      icon: <CloudRain className="w-8 h-8 text-blue-600" />,
      title: "Weather-Aware Pricing",
      description:
        "Dynamic pricing adjusts automatically based on weather conditions using real-time OpenWeatherAPI data.",
      highlight: "Smart weather fees",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Campus-Only Security",
      description:
        "University email verification and student ID confirmation ensure safe, trusted deliveries within campus bounds.",
      highlight: "Verified students only",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Place Your Order",
      description:
        "Search food categories, select items, and confirm your delivery request",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "2",
      title: "Smart Matching",
      description:
        "Our algorithm matches you with the nearest available campus carrier",
      icon: <Route className="w-6 h-6" />,
    },
    {
      step: "3",
      title: "Real-Time Tracking",
      description: "Track your delivery with live updates and weather-adjusted ETAs",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      step: "4",
      title: "Secure Payment",
      description: "Pay securely through Stripe with automatic weather fee calculations",
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  const stats = [
    { value: "< 15min", label: "Average Delivery" },
    { value: "95%", label: "On-Time Rate" },
    { value: "$2-8", label: "Delivery Range" },
  ];

  const teamMembers = [
    {
      name: "Mohammed Faraz Kabbo",
      program: "Computer Science",
      university: "York University",
      linkedin: "https://linkedin.com/in/mohammed-faraz-kabbo",
      initials: "MK",
      color: "from-red-600 to-red-700",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", // Placeholder - replace with actual photo
    },
    {
      name: "Ammar Faisal",
      program: "Software Engineering",
      university: "York University",
      linkedin: "https://linkedin.com/in/ammar-faisal",
      initials: "AF",
      color: "from-blue-600 to-blue-700",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", // Placeholder - replace with actual photo
    },
    {
      name: "Lloyd Musa",
      program: "Computer Science",
      university: "York University",
      linkedin: "https://linkedin.com/in/lloyd-musa",
      initials: "LM",
      color: "from-green-600 to-green-700",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", // Placeholder - replace with actual photo
    },
    {
      name: "Kyle Truong",
      program: "Computer Science",
      university: "York University",
      linkedin: "https://linkedin.com/in/kyle-truong",
      initials: "KT",
      color: "from-purple-600 to-purple-700",
      photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face", // Placeholder - replace with actual photo
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-red-50/30 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-900 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-red-700 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div
          className={`w-full max-w-none px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex justify-between items-center py-4 max-w-7xl mx-auto">
            <div
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                <img
                  src="Dash2Dorm.png"
                  alt="Dash2Dorm Logo"
                  className="w-12 h-12 rounded-xl shadow-lg object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">Dash2Dorm</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-full shadow-sm">
                  Fast & Smart
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDashboard}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user?.firstName?.charAt(0) ||
                          user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                      <span className="hidden sm:block">{user?.firstName || "User"}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 animate-fade-in-up">
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.fullName || "Welcome!"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.emailAddresses[0]?.emailAddress}
                          </p>
                        </div>
                        <button
                          onClick={handleDashboard}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-800 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Users className="w-4 h-4" />
                          <span>Go to Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/courier");
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-800 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Courier Mode</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/customer");
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-800 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Star className="w-4 h-4" />
                          <span>Order Food</span>
                        </button>
                        <div className="border-t border-gray-200/50 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-300 flex items-center space-x-2 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:animate-pulse" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-6 py-2 text-red-900 hover:text-red-700 font-medium transition-all duration-300 transform hover:scale-105 hover:bg-red-50 rounded-lg flex items-center space-x-2 group"
                  >
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="px-6 py-2 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-red-800 hover:to-red-600 flex items-center space-x-2 group"
                  >
                    <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Join Now</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full">
        <main className="w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Hero */}
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-red-900/80 to-red-700 bg-clip-text text-transparent">
              Dash
              <span className="bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">
                2Dorm
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Smart, fast, and reliable food delivery for university students.
              Weather-aware pricing, AI-optimized routes, and campus-verified
              carriers.
            </p>
            <div
              className={`flex justify-center space-x-8 text-sm text-gray-500 mb-8 transition-all duration-1000 delay-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              {[
                { color: "bg-red-500", text: "AI Route Optimization" },
                { color: "bg-blue-500", text: "Weather Integration" },
                { color: "bg-green-500", text: "Campus Verified" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center group transform transition-all duration-300 hover:scale-110"
                >
                  <div
                    className={`w-2 h-2 ${item.color} rounded-full mr-2 animate-pulse group-hover:animate-bounce`}
                  ></div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isSignedIn ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-red-800 hover:to-red-600 group"
                  >
                    <Star className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/customer")}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-green-700 hover:to-green-600 group"
                  >
                    <Truck className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                    Order Food Now
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignUp}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-red-800 hover:to-red-600 group"
                  >
                    <UserPlus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Get Started Free
                  </button>
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center px-8 py-4 bg-gray-100/80 backdrop-blur-sm text-gray-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg group"
                  >
                    <LogIn className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                    Sign In
                  </button>
                </>
              )}
            </div>

            {/* Welcome Banner */}
            {isSignedIn && (
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 max-w-2xl mx-auto mb-8 border border-green-200/50 animate-fade-in-up">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    Welcome back, {user?.firstName || "friend"}!
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  You're logged in and ready to order food or start delivering.
                  Choose your adventure! 🚀
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="transform transition-all duration-500 hover:scale-110 animate-fade-in-up"
                  style={{ animationDelay: `${400 + idx * 200}ms` }}
                >
                  <div className="text-2xl font-bold text-red-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div
            className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:bg-white/90 ${
                  hoveredCard === idx ? "animate-bounce-gentle" : ""
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div
                  className={`w-16 h-16 ${card.bgColor} rounded-xl flex items-center justify-center mb-6 transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 transition-colors duration-300 hover:text-red-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4 transition-colors duration-300 hover:text-gray-800">
                  {card.description}
                </p>
                <div
                  className={`text-sm ${card.textColor} font-medium transition-all duration-300 hover:scale-105`}
                >
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div
            className={`mb-16 transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From order to delivery in four smart steps, optimized for campus life
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full mb-4 mx-auto font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-lg mb-2">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
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
          <div
            className={`bg-gradient-to-r from-red-900 to-red-700 rounded-2xl p-8 text-white text-center mb-16 shadow-2xl transform transition-all duration-1000 delay-900 hover:scale-105 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            } relative overflow-hidden`}
          >
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
                  { icon: <MapPin className="w-6 h-6" />, label: "Real-time Maps" },
                ].map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center transform transition-all duration-500 hover:scale-110 animate-fade-in-up"
                    style={{ animationDelay: `${600 + idx * 100}ms` }}
                  >
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
          <div
            className={`text-center transition-all duration-1000 delay-1100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Experience Smart Delivery?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who trust Campus Courier for fast, reliable food delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <>
                  <button
                    onClick={() => navigate("/customer")}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-red-800 hover:to-red-600 group"
                  >
                    <Star className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Start Ordering
                  </button>
                  <button
                    onClick={() => navigate("/courier")}
                    className="inline-flex items-center px-8 py-4 border-2 border-red-200 text-red-800 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-red-50 hover:border-red-300 group"
                  >
                    <Truck className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                    Become a Courier
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignUp}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-red-800 hover:to-red-600 group"
                  >
                    <UserPlus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Join Dash2Dorm
                  </button>
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center px-8 py-4 border-2 border-red-200 text-red-800 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-red-50 hover:border-red-300 group"
                  >
                    <LogIn className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                    Already a Member?
                  </button>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Meet the Team */}
        <section
          className={`mb-16 transition-all duration-1000 delay-1300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent">
              Meet the Creators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by passionate Computer Science and Software Engineering students at York University
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((creator, idx) => (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:bg-white/90 animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${1400 + idx * 200}ms` }}
              >
                {/* Animated Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${creator.color} opacity-0 group-hover:opacity-5 transition-all duration-500`}></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${creator.color} rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                  >
                    <span className="text-white font-bold text-xl">{creator.initials}</span>
                    <div className={`absolute inset-0 bg-gradient-to-r ${creator.color} rounded-full opacity-0 group-hover:opacity-30 animate-ping group-hover:animate-pulse`}></div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-1 text-center transition-colors duration-300 group-hover:text-red-800">
                    {creator.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mb-1 transition-colors duration-300 group-hover:text-gray-800">
                    {creator.program}
                  </p>
                  <p className="text-xs text-gray-500 mb-4 transition-colors duration-300 group-hover:text-gray-600">
                    {creator.university}
                  </p>

                  <a
                    href={creator.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${creator.color} text-white font-medium text-sm rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                  >
                    <svg
                      className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Team Quote */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "2200ms" }}>
            <div className="bg-gradient-to-r from-gray-100 to-red-50 rounded-xl p-6 max-w-3xl mx-auto border border-gray-200/50">
              <p className="text-lg text-gray-700 italic mb-3">
                "We built Dash2Dorm to solve real problems we faced as students - long food delivery waits, high costs, and unreliable service. Our solution combines cutting-edge technology with deep understanding of campus life."
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">The Dash2Dorm Team</span>
                <div className="w-8 h-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>
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
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-shimmer { animation: shimmer 2s linear infinite; }
          .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
          .animate-fade-in-up { animation: fade-in-up 1s ease forwards; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  );
}
