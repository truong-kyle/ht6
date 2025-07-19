import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Clock, Star, Navigation, CheckCircle, AlertCircle, User, Zap, Car } from 'lucide-react';

// Define interfaces
interface MenuItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Restaurant {
  id: number;
  name: string;
  category: string;
  image: string;
  location: { lat: number; lng: number };
  address: string;
}

interface Customer {
  id: number;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  phone: string;
}

interface AvailableOrder {
  id: number;
  restaurant: Restaurant;
  customer: Customer;
  items: MenuItem[];
  subtotal: number;
  deliveryFee: number;
  courierEarnings: number;
  distance: string;
  estimatedTime: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  timestamp: string;
}

interface CourierProfile {
  id: number;
  name: string;
  rating: number;
  totalDeliveries: number;
  todayEarnings: number;
  weeklyEarnings: number;
  isOnline: boolean;
  location: { lat: number; lng: number };
}

const CourierDashboard: React.FC = () => {
  const [courierProfile, setCourierProfile] = useState<CourierProfile>({
    id: 1,
    name: "Alex Johnson",
    rating: 4.8,
    totalDeliveries: 247,
    todayEarnings: 89.50,
    weeklyEarnings: 425.75,
    isOnline: true,
    location: { lat: 43.7738, lng: -79.5025 }
  });

  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<AvailableOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AvailableOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [searchingForOrders, setSearchingForOrders] = useState<boolean>(true);
  const [mapLoading, setMapLoading] = useState<boolean>(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  // Sample restaurants around York University
  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Popeyes",
      category: "Fast Food",
      image: "🍗",
      location: { lat: 43.7742, lng: -79.5028 },
      address: "4841 Yonge St, North York"
    },
    {
      id: 2,
      name: "Osmows",
      category: "Middle Eastern",
      image: "🥙",
      location: { lat: 43.7728, lng: -79.5015 },
      address: "4700 Keele St, North York"
    },
    {
      id: 3,
      name: "Pita Land",
      category: "Mediterranean",
      image: "🥗",
      location: { lat: 43.7748, lng: -79.5035 },
      address: "5000 Yonge St, North York"
    },
    {
      id: 4,
      name: "Thai Express",
      category: "Thai",
      image: "🍜",
      location: { lat: 43.7722, lng: -79.5008 },
      address: "4800 Keele St, North York"
    }
  ];

  // Generate sample orders
  const generateSampleOrders = (): AvailableOrder[] => {
    const customers: Customer[] = [
      {
        id: 1,
        name: "Sarah Chen",
        address: "4700 Keele St, Vanier Residence",
        location: { lat: 43.7735, lng: -79.5019 },
        phone: "(416) 736-2100"
      },
      {
        id: 2,
        name: "Mike Rodriguez",
        address: "70 The Pond Rd, York University",
        location: { lat: 43.7740, lng: -79.5015 },
        phone: "(416) 736-2101"
      },
      {
        id: 3,
        name: "Emma Watson",
        address: "4700 Keele St, Founders College",
        location: { lat: 43.7730, lng: -79.5025 },
        phone: "(416) 736-2102"
      }
    ];

    const sampleItems = [
      [
        { id: 1, name: "Chicken Sandwich", price: 12.99, quantity: 1 },
        { id: 2, name: "Cajun Fries", price: 4.99, quantity: 1 }
      ],
      [
        { id: 3, name: "Chicken Shawarma", price: 11.99, quantity: 2 }
      ],
      [
        { id: 4, name: "Pad Thai", price: 11.99, quantity: 1 },
        { id: 5, name: "Tom Yum Soup", price: 8.99, quantity: 1 }
      ]
    ];

    return [
      {
        id: 1,
        restaurant: restaurants[0],
        customer: customers[0],
        items: sampleItems[0],
        subtotal: 17.98,
        deliveryFee: 2.99,
        courierEarnings: 6.50,
        distance: "0.8",
        estimatedTime: 12,
        status: 'pending',
        timestamp: '2 min ago'
      },
      {
        id: 2,
        restaurant: restaurants[1],
        customer: customers[1],
        items: sampleItems[1],
        subtotal: 23.98,
        deliveryFee: 3.49,
        courierEarnings: 8.20,
        distance: "1.2",
        estimatedTime: 15,
        status: 'pending',
        timestamp: '5 min ago'
      },
      {
        id: 3,
        restaurant: restaurants[3],
        customer: customers[2],
        items: sampleItems[2],
        subtotal: 20.98,
        deliveryFee: 2.49,
        courierEarnings: 7.10,
        distance: "0.6",
        estimatedTime: 10,
        status: 'pending',
        timestamp: '1 min ago'
      }
    ];
  };

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(linkElement);

        await new Promise(resolve => {
          linkElement.onload = resolve;
        });

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        document.body.appendChild(script);

        script.onload = () => {
          if (mapRef.current && !leafletMapRef.current) {
            leafletMapRef.current = (window as any).L.map(mapRef.current).setView([43.7735, -79.5019], 15);

            (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(leafletMapRef.current);

            // Add courier location
            const courierIcon = (window as any).L.divIcon({
              className: 'courier-marker',
              html: `<div style="background: #059669; border: 3px solid white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                       🚗
                       <div style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: #059669; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; white-space: nowrap; font-weight: bold;">You (${courierProfile.name})</div>
                     </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            (window as any).L.marker([courierProfile.location.lat, courierProfile.location.lng], { icon: courierIcon })
              .addTo(leafletMapRef.current)
              .bindPopup(`<b>Your Location</b><br>${courierProfile.name}<br>Available Courier`);

            // Add restaurant markers
            restaurants.forEach(restaurant => {
              const restaurantIcon = (window as any).L.divIcon({
                className: 'restaurant-marker',
                html: `<div style="background: white; border: 2px solid #6b7280; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${restaurant.image}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              });

              (window as any).L.marker([restaurant.location.lat, restaurant.location.lng], { icon: restaurantIcon })
                .addTo(leafletMapRef.current)
                .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.category}<br>${restaurant.address}`);
            });

            setMapLoading(false);
          }
        };
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setMapLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Simulate finding orders
  useEffect(() => {
    if (searchingForOrders) {
      const timer = setTimeout(() => {
        setAvailableOrders(generateSampleOrders());
        setSearchingForOrders(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [searchingForOrders]);

  // Toggle online status
  const toggleOnlineStatus = (): void => {
    setCourierProfile(prev => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
    
    if (!courierProfile.isOnline) {
      setSearchingForOrders(true);
      setAvailableOrders([]);
    }
  };

  // Accept order
  const acceptOrder = (order: AvailableOrder): void => {
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setAcceptedOrders(prev => [...prev, { ...order, status: 'accepted' }]);
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Update order status
  const updateOrderStatus = (orderId: number, newStatus: AvailableOrder['status']): void => {
    setAcceptedOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    if (newStatus === 'delivered') {
      const order = acceptedOrders.find(o => o.id === orderId);
      if (order) {
        setCourierProfile(prev => ({
          ...prev,
          todayEarnings: prev.todayEarnings + order.courierEarnings,
          weeklyEarnings: prev.weeklyEarnings + order.courierEarnings,
          totalDeliveries: prev.totalDeliveries + 1
        }));
        
        setTimeout(() => {
          setAcceptedOrders(prev => prev.filter(o => o.id !== orderId));
        }, 2000);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Map */}
      <div className="flex-1 relative">
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg mb-2">Loading Delivery Map...</p>
              <p className="text-gray-500 text-sm">York University Area</p>
            </div>
          </div>
        )}
        
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />
        
        {/* Courier Status Toggle */}
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center px-4 py-3 rounded-xl shadow-lg font-medium transition-all ${
              courierProfile.isOnline 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <div className={`w-3 h-3 rounded-full mr-3 ${courierProfile.isOnline ? 'bg-green-300' : 'bg-gray-300'} animate-pulse`}></div>
            {courierProfile.isOnline ? 'Online - Available' : 'Offline'}
          </button>
        </div>

        {/* Earnings Display */}
        <div className="absolute top-4 right-4 z-30 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${courierProfile.todayEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Today's Earnings</div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 z-20">
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Delivery Area</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 border-2 border-white"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full mr-3 flex items-center justify-center">
                <span className="text-xs">🍕</span>
              </div>
              <span>Restaurants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Orders Panel */}
      <div className="w-96 bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-green-600 to-green-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User size={24} className="mr-3" />
              <div>
                <h2 className="text-xl font-bold">{courierProfile.name}</h2>
                <p className="opacity-90 text-sm">Courier Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-yellow-300 mb-1">
                <Star size={16} className="mr-1 fill-current" />
                <span className="font-bold">{courierProfile.rating}</span>
              </div>
              <p className="text-xs opacity-75">{courierProfile.totalDeliveries} deliveries</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-700 rounded-lg p-3">
              <div className="font-bold text-lg">${courierProfile.weeklyEarnings.toFixed(2)}</div>
              <div className="opacity-75">This Week</div>
            </div>
            <div className="bg-green-700 rounded-lg p-3">
              <div className="font-bold text-lg">{acceptedOrders.length}</div>
              <div className="opacity-75">Active Orders</div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Accepted Orders */}
          {acceptedOrders.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Active Deliveries
              </h3>
              {acceptedOrders.map(order => (
                <div key={order.id} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{order.restaurant.image}</span>
                      <div>
                        <h4 className="font-medium">{order.restaurant.name}</h4>
                        <p className="text-sm text-gray-600">{order.customer.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${order.courierEarnings}</div>
                      <div className="text-xs text-gray-500">{order.distance} km</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'picked_up')}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {order.status === 'picked_up' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <div className="flex-1 bg-green-100 text-green-800 py-2 px-3 rounded-lg text-sm font-medium text-center">
                        ✓ Delivered!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available Orders */}
          <div className="p-4">
            {!courierProfile.isOnline ? (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">You're Offline</h3>
                <p className="text-gray-500 mb-4">Go online to start receiving delivery requests</p>
                <button
                  onClick={toggleOnlineStatus}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                >
                  Go Online
                </button>
              </div>
            ) : searchingForOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Searching for Orders</h3>
                <p className="text-gray-500">Looking for deliveries around York University...</p>
              </div>
            ) : availableOrders.length === 0 ? (
              <div className="text-center py-12">
                <Zap size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Orders Available</h3>
                <p className="text-gray-500 mb-4">New delivery requests will appear here</p>
                <button
                  onClick={() => {
                    setSearchingForOrders(true);
                    setAvailableOrders([]);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <DollarSign size={20} className="mr-2 text-green-600" />
                  Available Orders ({availableOrders.length})
                </h3>
                {availableOrders.map(order => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md cursor-pointer transition-all hover:border-green-300"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{order.restaurant.image}</span>
                        <div>
                          <h4 className="font-medium">{order.restaurant.name}</h4>
                          <p className="text-sm text-gray-600">{order.restaurant.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">${order.courierEarnings}</div>
                        <p className="text-xs text-gray-500">{order.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Navigation size={14} className="mr-1" />
                        <span>{order.distance} km away</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>~{order.estimatedTime} min</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        📍 Deliver to: {order.customer.address}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>

              {/* Restaurant */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{selectedOrder.restaurant.image}</span>
                  <div>
                    <h3 className="font-bold">{selectedOrder.restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.restaurant.address}</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Deliver to:</h4>
                <div>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.address}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Order Items:</h4>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Earnings Breakdown */}
              <div className="bg-green-50 rounded-lg p-4 mb-6 border-l-4 border-green-500">
                <h4 className="font-medium mb-3 text-green-800">Your Earnings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Fee</span>
                    <span>${(selectedOrder.courierEarnings - 1.50).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Bonus</span>
                    <span>$1.50</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-green-200 pt-2 text-green-800">
                    <span>Total Earnings</span>
                    <span>${selectedOrder.courierEarnings}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-green-700">
                  <Clock size={14} className="mr-1" />
                  <span>Estimated time: {selectedOrder.estimatedTime} minutes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => acceptOrder(selectedOrder)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Accept Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourierDashboard;