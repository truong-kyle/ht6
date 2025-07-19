import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Clock, Star, Navigation, CheckCircle, AlertCircle, User, Zap, Car, Route, TrendingUp } from 'lucide-react';

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

interface RouteStep {
  id: string;
  location: { lat: number; lng: number };
  type: 'pickup' | 'delivery' | 'current';
  address: string;
  estimatedTime: number;
  earnings?: number;
  restaurant?: string;
  customer?: string;
}

interface OptimizedRoute {
  steps: RouteStep[];
  totalDistance: number;
  totalTime: number;
  totalEarnings: number;
  path: Array<{ lat: number; lng: number }>;
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
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [showRouteOptimization, setShowRouteOptimization] = useState<boolean>(false);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

  // Advanced Route Optimization Algorithm - Haversine Distance Calculation
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Hybrid Route Optimization Algorithm combining multiple strategies
  const generateRouteOptimization = (orders: AvailableOrder[]): OptimizedRoute => {
    if (orders.length === 0) return { steps: [], totalDistance: 0, totalTime: 0, totalEarnings: 0, path: [] };

    // Create route steps for all orders
    const allSteps: RouteStep[] = [];
    
    // Add current location as starting point
    allSteps.push({
      id: 'current',
      location: courierProfile.location,
      type: 'current',
      address: 'Your Current Location',
      estimatedTime: 0
    });

    // Add pickup and delivery points for each order
    orders.forEach(order => {
      allSteps.push({
        id: `pickup-${order.id}`,
        location: order.restaurant.location,
        type: 'pickup',
        address: order.restaurant.address,
        estimatedTime: 5, // Average pickup time
        restaurant: order.restaurant.name
      });
      
      allSteps.push({
        id: `delivery-${order.id}`,
        location: order.customer.location,
        type: 'delivery',
        address: order.customer.address,
        estimatedTime: 3, // Average delivery time
        earnings: order.courierEarnings,
        customer: order.customer.name
      });
    });

    // Multi-Strategy Route Optimization
    const optimizeRoute = (steps: RouteStep[]): RouteStep[] => {
      if (steps.length <= 2) return steps;

      let bestRoute = [...steps];
      let bestScore = calculateRouteScore(bestRoute);

      // Try different optimization strategies
      for (let attempt = 0; attempt < 50; attempt++) {
        let currentRoute = [...steps];
        
        // Strategy 1: Nearest Neighbor with Earnings Weight (20 attempts)
        if (attempt < 20) {
          currentRoute = nearestNeighborOptimization(currentRoute);
        }
        // Strategy 2: 2-Opt Local Search Improvement (15 attempts)
        else if (attempt < 35) {
          currentRoute = twoOptOptimization(currentRoute);
        }
        // Strategy 3: Earnings-First Clustering (15 attempts)
        else {
          currentRoute = earningsClusterOptimization(currentRoute);
        }

        const currentScore = calculateRouteScore(currentRoute);
        if (currentScore > bestScore) {
          bestScore = currentScore;
          bestRoute = currentRoute;
        }
      }

      return bestRoute;
    };

    // Multi-objective fitness function
    const calculateRouteScore = (route: RouteStep[]): number => {
      let totalDistance = 0;
      let totalTime = 0;
      let totalEarnings = 0;
      
      for (let i = 0; i < route.length - 1; i++) {
        const distance = calculateDistance(route[i].location, route[i + 1].location);
        totalDistance += distance;
        totalTime += distance * 3 + route[i + 1].estimatedTime; // 3 minutes per km + stop time
        if (route[i + 1].earnings) totalEarnings += route[i + 1].earnings;
      }

      // Multi-objective score: Earnings per minute with distance penalty
      const timeInMinutes = Math.max(totalTime, 1);
      const earningsPerMinute = totalEarnings / timeInMinutes;
      const distancePenalty = totalDistance * 0.1;
      
      return earningsPerMinute - distancePenalty;
    };

    // Algorithm 1: Greedy Nearest Neighbor with Earnings Weight
    const nearestNeighborOptimization = (steps: RouteStep[]): RouteStep[] => {
      const optimized = [steps[0]]; // Start with current location
      const remaining = [...steps.slice(1)];
      
      while (remaining.length > 0) {
        const current = optimized[optimized.length - 1];
        let bestIndex = 0;
        let bestScore = -Infinity;
        
        remaining.forEach((step, index) => {
          const distance = calculateDistance(current.location, step.location);
          const earnings = step.earnings || 0;
          const score = (earnings * 10) - distance; // Weight earnings heavily
          
          if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
          }
        });
        
        optimized.push(remaining.splice(bestIndex, 1)[0]);
      }
      
      return optimized;
    };

    // Algorithm 2: 2-Opt Local Search Heuristic
    const twoOptOptimization = (route: RouteStep[]): RouteStep[] => {
      let improved = true;
      let currentRoute = [...route];
      let iterations = 0;
      const maxIterations = 100;
      
      while (improved && iterations < maxIterations) {
        improved = false;
        for (let i = 1; i < currentRoute.length - 2; i++) {
          for (let j = i + 1; j < currentRoute.length; j++) {
            if (j - i === 1) continue;
            
            const newRoute = [...currentRoute];
            // Reverse the segment between i and j
            const segment = newRoute.slice(i, j).reverse();
            newRoute.splice(i, j - i, ...segment);
            
            if (calculateRouteScore(newRoute) > calculateRouteScore(currentRoute)) {
              currentRoute = newRoute;
              improved = true;
              break;
            }
          }
          if (improved) break;
        }
        iterations++;
      }
      
      return currentRoute;
    };

    // Algorithm 3: Earnings-First Clustering with Geographic Optimization
    const earningsClusterOptimization = (steps: RouteStep[]): RouteStep[] => {
      const pickups = steps.filter(s => s.type === 'pickup');
      const deliveries = steps.filter(s => s.type === 'delivery');
      const current = steps.find(s => s.type === 'current');
      
      // Fix: Add null check for current location
      if (!current) return steps;
      
      // Sort pickups by proximity to current location
      const sortedPickups = pickups.sort((a, b) => {
        const aDistance = calculateDistance(current.location, a.location);
        const bDistance = calculateDistance(current.location, b.location);
        return aDistance - bDistance;
      });
      
      const result = [current];
      
      // Optimal pickup-delivery pairing
      sortedPickups.forEach(pickup => {
        result.push(pickup);
        const correspondingDelivery = deliveries.find(d => 
          d.id.includes(pickup.id.split('-')[1])
        );
        if (correspondingDelivery) {
          result.push(correspondingDelivery);
        }
      });
      
      return result;
    };

    const optimizedSteps = optimizeRoute(allSteps);
    
    // Calculate final route metrics
    let totalDistance = 0;
    let totalTime = 0;
    let totalEarnings = 0;
    const path: Array<{ lat: number; lng: number }> = [];
    
    for (let i = 0; i < optimizedSteps.length; i++) {
      path.push(optimizedSteps[i].location);
      
      if (i > 0) {
        const distance = calculateDistance(optimizedSteps[i-1].location, optimizedSteps[i].location);
        totalDistance += distance;
        totalTime += distance * 3 + optimizedSteps[i].estimatedTime;
      }
      
      if (optimizedSteps[i].earnings) {
        totalEarnings += optimizedSteps[i].earnings;
      }
    }

    return {
      steps: optimizedSteps,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime),
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      path
    };
  };

  // Generate sample orders with realistic data
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

  // Enhanced map route drawing with animations
  const drawRouteOnMap = (route: OptimizedRoute) => {
    if (!leafletMapRef.current || !route.path.length || !leafletLoaded) return;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => {
      if (leafletMapRef.current && marker) {
        leafletMapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    if (routeLayerRef.current) {
      leafletMapRef.current.removeLayer(routeLayerRef.current);
    }

    try {
      // Create animated route polyline
      const routeLine = (window as any).L.polyline(
        route.path.map(p => [p.lat, p.lng]), 
        { 
          color: '#059669', 
          weight: 4, 
          opacity: 0.8,
          dashArray: '10, 5'
        }
      ).addTo(leafletMapRef.current);

      routeLayerRef.current = routeLine;

      // Add enhanced markers for each step
      route.steps.forEach((step, index) => {
        if (step.type === 'current') return;

        const icon = (window as any).L.divIcon({
          className: 'route-marker',
          html: `<div style="background: ${step.type === 'pickup' ? '#3B82F6' : '#059669'}; border: 2px solid white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 2s infinite;">${index}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = (window as any).L.marker([step.location.lat, step.location.lng], { icon })
          .addTo(leafletMapRef.current)
          .bindPopup(`
            <div style="min-width: 200px;">
              <b>Step ${index}: ${step.type === 'pickup' ? '📦 Pickup' : '🏠 Delivery'}</b><br>
              <strong>${step.restaurant || step.customer || 'Current Location'}</strong><br>
              <em>${step.address}</em><br>
              ${step.earnings ? `<div style="color: #059669; font-weight: bold; margin-top: 8px;">💰 Earnings: $${step.earnings}</div>` : ''}
              <div style="color: #6B7280; font-size: 12px; margin-top: 4px;">⏱️ Stop time: ${step.estimatedTime} min</div>
            </div>
          `);

        markersRef.current.push(marker);
      });

      // Fit map to show entire route with padding
      const bounds = (window as any).L.latLngBounds(route.path.map(p => [p.lat, p.lng]));
      leafletMapRef.current.fitBounds(bounds, { padding: [30, 30] });
    } catch (error) {
      console.error('Error drawing route on map:', error);
    }
  };

  // Initialize Leaflet map with error handling
  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Load Leaflet CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(linkElement);

        await new Promise((resolve, reject) => {
          linkElement.onload = resolve;
          linkElement.onerror = reject;
          setTimeout(reject, 5000); // 5 second timeout
        });

        // Load Leaflet JavaScript
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        document.body.appendChild(script);

        script.onload = () => {
          setLeafletLoaded(true);
          
          if (mapRef.current && !leafletMapRef.current) {
            try {
              leafletMapRef.current = (window as any).L.map(mapRef.current, {
                zoomControl: true,
                scrollWheelZoom: true
              }).setView([43.7735, -79.5019], 15);

              (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
              }).addTo(leafletMapRef.current);

              // Add courier location marker
              const courierIcon = (window as any).L.divIcon({
                className: 'courier-marker',
                html: `<div style="position: relative;">
                         <div style="background: #059669; border: 3px solid white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 3s infinite;">
                           🚗
                         </div>
                         <div style="position: absolute; top: -40px; left: 50%; transform: translateX(-50%); background: #059669; color: white; padding: 6px 10px; border-radius: 8px; font-size: 11px; white-space: nowrap; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${courierProfile.name}</div>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              });

              const courierMarker = (window as any).L.marker([courierProfile.location.lat, courierProfile.location.lng], { icon: courierIcon })
                .addTo(leafletMapRef.current)
                .bindPopup(`
                  <div style="text-align: center; min-width: 150px;">
                    <b>📍 Your Location</b><br>
                    <strong>${courierProfile.name}</strong><br>
                    <span style="color: #059669;">✅ Available Courier</span><br>
                    <div style="margin-top: 8px; font-size: 12px; color: #6B7280;">
                      ⭐ ${courierProfile.rating} • ${courierProfile.totalDeliveries} deliveries
                    </div>
                  </div>
                `);

              markersRef.current.push(courierMarker);

              // Add restaurant markers with enhanced styling
              restaurants.forEach(restaurant => {
                const restaurantIcon = (window as any).L.divIcon({
                  className: 'restaurant-marker',
                  html: `<div style="background: white; border: 3px solid #059669; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer;" title="${restaurant.name}">${restaurant.image}</div>`,
                  iconSize: [36, 36],
                  iconAnchor: [18, 18]
                });

                const restaurantMarker = (window as any).L.marker([restaurant.location.lat, restaurant.location.lng], { icon: restaurantIcon })
                  .addTo(leafletMapRef.current)
                  .bindPopup(`
                    <div style="min-width: 180px;">
                      <div style="text-align: center; margin-bottom: 8px;">
                        <span style="font-size: 24px;">${restaurant.image}</span>
                      </div>
                      <b>${restaurant.name}</b><br>
                      <span style="color: #6B7280;">${restaurant.category}</span><br>
                      <em style="font-size: 12px;">${restaurant.address}</em>
                    </div>
                  `);

                markersRef.current.push(restaurantMarker);
              });

              setMapLoading(false);
            } catch (mapError) {
              console.error('Error initializing map:', mapError);
              setMapLoading(false);
            }
          }
        };

        script.onerror = () => {
          console.error('Failed to load Leaflet script');
          setMapLoading(false);
        };

      } catch (error) {
        console.error('Error loading Leaflet resources:', error);
        setMapLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      markersRef.current = [];
    };
  }, [courierProfile.name, courierProfile.location, courierProfile.rating, courierProfile.totalDeliveries]);

  // Update route optimization when accepted orders change
  useEffect(() => {
    if (acceptedOrders.length > 0) {
      const route = generateRouteOptimization(acceptedOrders);
      setOptimizedRoute(route);
      if (leafletLoaded) {
        setTimeout(() => drawRouteOnMap(route), 100);
      }
    } else {
      setOptimizedRoute(null);
      // Clear existing routes and extra markers
      if (routeLayerRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
      // Keep only courier and restaurant markers
      const keepMarkers = markersRef.current.slice(0, restaurants.length + 1);
      markersRef.current.slice(restaurants.length + 1).forEach(marker => {
        if (leafletMapRef.current && marker) {
          leafletMapRef.current.removeLayer(marker);
        }
      });
      markersRef.current = keepMarkers;
    }
  }, [acceptedOrders, leafletLoaded]);

  // Simulate order discovery
  useEffect(() => {
    if (searchingForOrders && courierProfile.isOnline) {
      const timer = setTimeout(() => {
        setAvailableOrders(generateSampleOrders());
        setSearchingForOrders(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [searchingForOrders, courierProfile.isOnline]);

  // Toggle online status
  const toggleOnlineStatus = (): void => {
    setCourierProfile(prev => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
    
    if (!courierProfile.isOnline) {
      setSearchingForOrders(true);
      setAvailableOrders([]);
    } else {
      setAvailableOrders([]);
      setAcceptedOrders([]);
    }
  };

  // Accept order with validation
  const acceptOrder = (order: AvailableOrder): void => {
    if (!order) return;
    
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setAcceptedOrders(prev => [...prev, { ...order, status: 'accepted' }]);
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Update order status with earnings tracking
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
        
        // Remove completed order after delay
        setTimeout(() => {
          setAcceptedOrders(prev => prev.filter(o => o.id !== orderId));
        }, 2000);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Interactive Map */}
      <div className="flex-1 relative">
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
              <p className="text-gray-700 text-xl font-semibold mb-2">Loading Delivery Map...</p>
              <p className="text-gray-500 text-sm">York University Area • Toronto, ON</p>
            </div>
          </div>
        )}
        
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />
        
        {/* Enhanced Status Controls */}
        <div className="absolute top-4 left-4 z-30 space-y-3">
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center px-6 py-3 rounded-xl shadow-lg font-medium transition-all transform hover:scale-105 backdrop-blur-sm ${
              courierProfile.isOnline 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
            }`}
          >
            <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${courierProfile.isOnline ? 'bg-green-200' : 'bg-red-300'}`}></div>
            {courierProfile.isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        {/* Enhanced Route Stats */}
        {optimizedRoute && (
          <div className="absolute bottom-4 left-4 z-30 p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 space-y-3 text-sm text-gray-800 w-72">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="flex items-center font-medium text-gray-700">
                <Route className="w-4 h-4 mr-2 text-emerald-500" /> 
                Route Overview
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Navigation className="w-4 h-4 mr-2 text-blue-500" /> 
                Distance
              </span>
              <strong className="text-gray-800">{optimizedRoute.totalDistance} km</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-orange-500" /> 
                Est. Time
              </span>
              <strong className="text-gray-800">{optimizedRoute.totalTime} min</strong>
            </div>
            <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
              <span className="flex items-center text-green-700 font-medium">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" /> 
                Total Earnings
              </span>
              <strong className="text-green-800 text-lg">${optimizedRoute.totalEarnings}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Enhanced Order List and Profile */}
      <div className="w-[380px] bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-y-auto shadow-lg">
        {/* Profile Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 z-10">
          <div className="text-xl font-bold text-gray-800 mb-2">Welcome, {courierProfile.name}</div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-medium text-gray-700">{courierProfile.rating}</span>
            </div>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />
              <span className="font-medium text-gray-700">{courierProfile.totalDeliveries} deliveries</span>
            </div>
          </div>
          
          {/* Earnings Dashboard */}
          <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-2" />
              <span className="font-semibold text-gray-700">Earnings</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Today</div>
                <div className="font-bold text-emerald-700">${courierProfile.todayEarnings.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">This Week</div>
                <div className="font-bold text-emerald-700">${courierProfile.weeklyEarnings.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Available Orders Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 flex items-center">
                <Zap className="w-5 h-5 text-orange-500 mr-2" />
                Available Orders
              </h3>
              {availableOrders.length > 0 && (
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                  {availableOrders.length} new
                </span>
              )}
            </div>
            
            {availableOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                <div className="text-gray-500 text-sm text-center">
                  {searchingForOrders ? 'Searching for orders...' : 'No orders available'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {availableOrders.map(order => (
                  <div key={order.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-orange-300">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{order.restaurant.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {order.customer.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${order.courierEarnings}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Navigation className="w-3 h-3 mr-1" />
                        {order.distance} km
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {order.estimatedTime} min
                      </span>
                    </div>
                    
                    <button
                      onClick={() => acceptOrder(order)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02]"
                    >
                      Accept Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Orders Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 flex items-center">
                <Car className="w-5 h-5 text-blue-500 mr-2" />
                Active Orders
              </h3>
              {acceptedOrders.length > 0 && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {acceptedOrders.length} active
                </span>
              )}
            </div>
            
            {acceptedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-gray-400 mb-2" />
                <div className="text-gray-500 text-sm text-center">No active orders</div>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedOrders.map(order => (
                  <div key={order.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{order.restaurant.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {order.customer.name}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'picked_up' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'picked_up')}
                        className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] mt-3"
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {order.status === 'picked_up' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] mt-3"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierDashboard;