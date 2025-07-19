

import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ShoppingCart, Clock, DollarSign, Star, Phone, Navigation, CheckCircle } from 'lucide-react';

// Add Leaflet type declaration
declare global {
  interface Window {
    L: any;
  }
}

// Define interfaces for proper typing
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Restaurant {
  id: number;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  location: { lat: number; lng: number };
  phone: string;
  menu: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Carrier {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  available: boolean;
}

interface OrderCosts {
  subtotal: number;
  deliveryFee: number;
  weatherFee: number;
  serviceFee: number;
  tax: number;
  total: number;
}

interface OrderDetails {
  restaurant: Restaurant;
  items: CartItem[];
  carrier: Carrier | null;
  distance: string;
  costs: OrderCosts;
  estimatedTime: number;
}

const UserDashboard: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 43.7735, lng: -79.5019 });
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});

  // Updated restaurants with York University campus locations
  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Popeyes",
      category: "Fast Food",
      rating: 4.5,
      deliveryTime: "15-25 min",
      deliveryFee: 2.99,
      image: "🍗",
      location: { lat: 43.7736, lng: -79.5023 },
      phone: "(416) 736-5000",
      menu: [
        { id: 1, name: "Chicken Sandwich", price: 12.99, description: "Crispy chicken breast with mayo and pickles" },
        { id: 2, name: "3-Piece Chicken", price: 15.99, description: "Three pieces of Louisiana-style fried chicken" },
        { id: 3, name: "Cajun Fries", price: 4.99, description: "Seasoned fries with Cajun spices" }
      ]
    },
    {
      id: 2,
      name: "Osmows",
      category: "Middle Eastern",
      rating: 4.2,
      deliveryTime: "20-30 min",
      deliveryFee: 3.49,
      image: "🥙",
      location: { lat: 43.7742, lng: -79.5015 },
      phone: "(416) 736-5001",
      menu: [
        { id: 4, name: "Chicken Shawarma", price: 11.99, description: "Marinated chicken with garlic sauce and vegetables" },
        { id: 5, name: "Beef Wrap", price: 13.99, description: "Seasoned beef with tahini and fresh vegetables" },
        { id: 6, name: "Falafel Plate", price: 9.99, description: "Crispy falafel with hummus and pita" }
      ]
    },
    {
      id: 3,
      name: "Pita Land",
      category: "Mediterranean",
      rating: 4.7,
      deliveryTime: "25-35 min",
      deliveryFee: 4.99,
      image: "🥗",
      location: { lat: 43.7728, lng: -79.5031 },
      phone: "(416) 736-5002",
      menu: [
        { id: 7, name: "Chicken Souvlaki", price: 14.99, description: "Grilled chicken skewers with Greek salad" },
        { id: 8, name: "Gyro Wrap", price: 12.99, description: "Traditional gyro meat with tzatziki sauce" },
        { id: 9, name: "Mediterranean Bowl", price: 13.99, description: "Rice bowl with grilled vegetables and protein" }
      ]
    },
    {
      id: 4,
      name: "Thai Express",
      category: "Thai",
      rating: 4.3,
      deliveryTime: "18-28 min",
      deliveryFee: 2.49,
      image: "🍜",
      location: { lat: 43.7748, lng: -79.5008 },
      phone: "(416) 736-5003",
      menu: [
        { id: 10, name: "Pad Thai", price: 11.99, description: "Classic Thai noodles with shrimp or chicken" },
        { id: 11, name: "Green Curry", price: 13.99, description: "Spicy coconut curry with vegetables" },
        { id: 12, name: "Tom Yum Soup", price: 8.99, description: "Hot and sour Thai soup" }
      ]
    }
  ];

  const carriers: Carrier[] = [
    { id: 1, name: "Alex", location: { lat: 43.7740, lng: -79.5025 }, available: true },
    { id: 2, name: "Sarah", location: { lat: 43.7750, lng: -79.5030 }, available: true },
    { id: 3, name: "Mike", location: { lat: 43.7735, lng: -79.5020 }, available: true }
  ];

  const categories: string[] = ['All', 'Fast Food', 'Middle Eastern', 'Mediterranean', 'Thai'];

  // Load Leaflet library
  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L) {
        setLeafletLoaded(true);
        return;
      }

      try {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        
        script.onload = () => {
          setTimeout(() => {
            setLeafletLoaded(true);
          }, 100);
        };
        
        script.onerror = () => {
          console.error('Failed to load Leaflet');
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      // Create map centered on York University
      const map = window.L.map(mapRef.current).setView([43.7735, -79.5019], 16);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add user location marker
      window.L.marker([43.7735, -79.5019])
        .addTo(map)
        .bindPopup('<b>Your Location</b><br>York University Campus')
        .openPopup();

      // Add restaurant markers
      restaurants.forEach(restaurant => {
        const marker = window.L.marker([restaurant.location.lat, restaurant.location.lng])
          .addTo(map)
          .bindPopup(`
            <div class="text-center">
              <div style="font-size: 24px; margin-bottom: 8px;">${restaurant.image}</div>
              <b>${restaurant.name}</b><br>
              <span style="color: #6f1d1b;">${restaurant.category}</span><br>
              <small>⭐ ${restaurant.rating} • ${restaurant.deliveryTime}</small>
            </div>
          `);
        
        markersRef.current[restaurant.id] = marker;
      });

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [leafletLoaded, restaurants]);

  // Handle restaurant selection and map highlighting
  const handleRestaurantSelect = (restaurant: Restaurant): void => {
    setSelectedRestaurant(restaurant);
    
    if (mapInstanceRef.current && markersRef.current[restaurant.id]) {
      try {
        mapInstanceRef.current.setView([restaurant.location.lat, restaurant.location.lng], 17);
        markersRef.current[restaurant.id].openPopup();
      } catch (error) {
        console.error('Error updating map view:', error);
      }
    }
  };

  // Filter restaurants based on search and category
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate distance between two points
  const calculateDistance = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number => {
    const dx = loc1.lat - loc2.lat;
    const dy = loc1.lng - loc2.lng;
    return Math.sqrt(dx * dx + dy * dy) * 100;
  };

  // Find nearest carrier
  const findNearestCarrier = (restaurantLocation: { lat: number; lng: number }): { carrier: Carrier | null; distance: number } => {
    let nearestCarrier: Carrier | null = null;
    let minDistance = Infinity;
    
    carriers.forEach(carrier => {
      if (carrier.available) {
        const distance = calculateDistance(restaurantLocation, carrier.location);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCarrier = carrier;
        }
      }
    });
    
    return { carrier: nearestCarrier, distance: minDistance };
  };

  // Calculate total order cost
  const calculateOrderTotal = (restaurant: Restaurant, cartItems: CartItem[]): OrderCosts => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant.deliveryFee;
    const weatherFee = Math.random() > 0.7 ? 1.99 : 0;
    const serviceFee = subtotal * 0.05;
    const tax = (subtotal + serviceFee) * 0.13;
    
    return {
      subtotal,
      deliveryFee,
      weatherFee,
      serviceFee,
      tax,
      total: subtotal + deliveryFee + weatherFee + serviceFee + tax
    };
  };

  const addToCart = (item: MenuItem): void => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number): void => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: number, quantity: number): void => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const confirmOrder = (): void => {
    if (cart.length === 0 || !selectedRestaurant) return;
    
    const { carrier, distance } = findNearestCarrier(selectedRestaurant.location);
    const orderTotal = calculateOrderTotal(selectedRestaurant, cart);
    
    const newOrderDetails: OrderDetails = {
      restaurant: selectedRestaurant,
      items: cart,
      carrier,
      distance: distance.toFixed(2),
      costs: orderTotal,
      estimatedTime: Math.ceil(distance * 2 + 15)
    };
    
    setOrderDetails(newOrderDetails);
    setShowOrderConfirmation(true);
  };

  const placeOrder = (): void => {
    alert('Order placed successfully! Your carrier will be notified.');
    setCart([]);
    setSelectedRestaurant(null);
    setShowOrderConfirmation(false);
    setOrderDetails(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Map */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="absolute inset-0 w-full h-full bg-gray-200"
          style={{ zIndex: 1 }}
        >
          {!leafletLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-900 border-0"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="absolute top-20 left-4 right-4 z-10">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-red-900 text-white shadow-lg'
                    : 'bg-white text-red-900 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Restaurant List */}
      <div className="w-96 bg-white shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 bg-gradient-to-br from-red-900 to-red-800 text-white">
          <h2 className="text-xl font-bold mb-1">York University Restaurants</h2>
          <p className="opacity-90 text-sm">{filteredRestaurants.length} restaurants available</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredRestaurants.map(restaurant => (
            <div
              key={restaurant.id}
              className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                selectedRestaurant?.id === restaurant.id 
                  ? 'bg-blue-50 border-l-4 border-l-red-900' 
                  : 'border-gray-200'
              }`}
              onClick={() => handleRestaurantSelect(restaurant)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{restaurant.image}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-red-900">{restaurant.category}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center text-yellow-500">
                    <Star size={14} className="mr-1 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={14} className="mr-1" />
                  <span>${restaurant.deliveryFee} delivery</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Restaurant Menu */}
        {selectedRestaurant && (
          <div className="border-t border-gray-200 max-h-96 overflow-y-auto bg-blue-50">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center text-red-900">
                <ShoppingCart size={20} className="mr-2" />
                Menu - {selectedRestaurant.name}
              </h3>
              
              {selectedRestaurant.menu.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="font-bold text-red-900">${item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart */}
        {cart.length > 0 && (
          <div className="border-t border-gray-300 bg-white p-4">
            <h3 className="font-bold mb-3 text-red-900">Your Order ({cart.length} items)</h3>
            <div className="max-h-32 overflow-y-auto mb-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2 text-sm">
                  <span>{item.name}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full text-xs hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full text-xs hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="ml-2 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={confirmOrder}
              className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Review Order
            </button>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <CheckCircle size={48} className="mx-auto mb-3 text-red-900" />
                <h2 className="text-2xl font-bold text-gray-900">Order Confirmation</h2>
              </div>

              {/* Restaurant Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{orderDetails.restaurant.image}</span>
                  <div>
                    <h3 className="font-bold">{orderDetails.restaurant.name}</h3>
                    <p className="text-sm text-red-900">{orderDetails.restaurant.category}</p>
                  </div>
                </div>
              </div>

              {/* Carrier Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-red-900">
                <h4 className="font-medium mb-2 text-red-900">Your Carrier</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{orderDetails.carrier?.name || 'No carrier available'}</p>
                    <p className="text-sm text-gray-600">Distance: {orderDetails.distance} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="font-bold text-red-900">{orderDetails.estimatedTime} min</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Order Items</h4>
                {orderDetails.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderDetails.costs.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${orderDetails.costs.deliveryFee.toFixed(2)}</span>
                  </div>
                  {orderDetails.costs.weatherFee > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Weather Fee</span>
                      <span>${orderDetails.costs.weatherFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>${orderDetails.costs.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${orderDetails.costs.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-red-900">${orderDetails.costs.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={placeOrder}
                  className="flex-1 bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;