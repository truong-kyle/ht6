import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  ShoppingCart,
  Clock,
  Star,
  CheckCircle,
  CreditCard,
  House,
} from "lucide-react";
import { calculatePricing } from "../services/dynamicPricing";
import { set } from "vellum-ai/core/schemas";
import {
  CheckoutProvider,
  Elements,
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { BrowserRouter, Link, Routes } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
// Define interfaces for proper typing
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  productId: string;
}

interface Restaurant {
  id: number;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;

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
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showOrderConfirmation, setShowOrderConfirmation] =
    useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  // York University coordinates (4700 Keele St)
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 43.7735, lng: -79.5019 });
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<number | null>(
    null
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [payment, setPayment] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const Spinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white " />
    </div>
  );
  // Restaurants around York University
  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Popeyes",
      category: "Fast Food",
      rating: 4.5,
      deliveryTime: "15-25 min",

      image: "🍗",
      location: { lat: 43.7742, lng: -79.5028 },
      phone: "(416) 736-5000",
      menu: [
        {
          id: 1,
          name: "Chicken Sandwich",
          price: 12.99,
          description: "Crispy chicken breast with mayo and pickles",
          productId: "prod_Si37Z3gxi5vrwk",
        },
        {
          id: 2,
          name: "3-Piece Chicken",
          price: 15.99,
          description: "Three pieces of Louisiana-style fried chicken",
          productId: "prod_Si38cEULGqiAEd",
        },
        {
          id: 3,
          name: "Cajun Fries",
          price: 4.99,
          description: "Seasoned fries with Cajun spices",
          productId: "prod_Si38BBhHP6Zkqs",
        },
      ],
    },
    {
      id: 2,
      name: "Osmows",
      category: "Middle Eastern",
      rating: 4.2,
      deliveryTime: "20-30 min",

      image: "🥙",
      location: { lat: 43.7728, lng: -79.5015 },
      phone: "(416) 736-5001",
      menu: [
        {
          id: 4,
          name: "Chicken Shawarma",
          price: 11.99,
          description: "Marinated chicken with garlic sauce and vegetables",
          productId: "prod_Si2JxAvaQhNwny",
        },
        {
          id: 5,
          name: "Beef Wrap",
          price: 13.99,
          description: "Seasoned beef with tahini and fresh vegetables",
          productId: "prod_Si2MeUnJJxhodt",
        },
        {
          id: 6,
          name: "Falafel Plate",
          price: 9.99,
          description: "Crispy falafel with hummus and pita",
          productId: "prod_Si2OGGkyAzoiIR",
        },
      ],
    },
    {
      id: 3,
      name: "Pita Land",
      category: "Mediterranean",
      rating: 4.7,
      deliveryTime: "25-35 min",

      image: "🥗",
      location: { lat: 43.7748, lng: -79.5035 },
      phone: "(416) 736-5002",
      menu: [
        {
          id: 7,
          name: "Chicken Souvlaki",
          price: 14.99,
          description: "Grilled chicken skewers with Greek salad",
          productId: "prod_Si2Rv2kKW3fYkJ",
        },
        {
          id: 8,
          name: "Gyro Wrap",
          price: 12.99,
          description: "Traditional gyro meat with tzatziki sauce",
          productId: "prod_Si33Evi5WVK1DO",
        },
        {
          id: 9,
          name: "Mediterranean Bowl",
          price: 13.99,
          description: "Rice bowl with grilled vegetables and protein",
          productId: "prod_Si34WYwEHfCBpc",
        },
      ],
    },
    {
      id: 4,
      name: "Thai Express",
      category: "Thai",
      rating: 4.3,
      deliveryTime: "18-28 min",

      image: "🍜",
      location: { lat: 43.7722, lng: -79.5008 },
      phone: "(416) 736-5003",
      menu: [
        {
          id: 10,
          name: "Pad Thai",
          price: 11.99,
          description: "Classic Thai noodles with shrimp or chicken",
          productId: "prod_Si35cZSGrFIbe6",
        },
        {
          id: 11,
          name: "Green Curry",
          price: 13.99,
          description: "Spicy coconut curry with vegetables",
          productId: "prod_Si36zClMQ7JKLo",
        },
        {
          id: 12,
          name: "Tom Yum Soup",
          price: 8.99,
          description: "Hot and sour Thai soup",
          productId: "prod_Si37RFKAvHzwDq",
        },
      ],
    },
  ];

  const carriers: Carrier[] = [
    {
      id: 1,
      name: "Alex",
      location: { lat: 43.7738, lng: -79.5025 },
      available: true,
    },
    {
      id: 2,
      name: "Sarah",
      location: { lat: 43.7745, lng: -79.5018 },
      available: true,
    },
    {
      id: 3,
      name: "Mike",
      location: { lat: 43.773, lng: -79.5032 },
      available: true,
    },
  ];

  const categories: string[] = [
    "All",
    "Fast Food",
    "Middle Eastern",
    "Mediterranean",
    "Thai",
  ];

  // Filter restaurants based on search and category - MOVED UP BEFORE USE
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Update carrier markers
  const updateCarrierMarkers = () => {
    if (!leafletMapRef.current) return;

    carriers.forEach((carrier) => {
      if (carrier.available) {
        const carrierIcon = (window as any).L.divIcon({
          className: "carrier-marker",
          html: `<div style="background: #059669; border: 2px solid white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); animation: bounce 1s infinite;">
                   🚗
                   <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">${carrier.name}</div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        (window as any).L.marker([carrier.location.lat, carrier.location.lng], {
          icon: carrierIcon,
        })
          .addTo(leafletMapRef.current)
          .bindPopup(`<b>${carrier.name}</b><br>Available Carrier`);
      }
    });
  };

  // Update restaurant markers
  const updateRestaurantMarkers = () => {
    if (!leafletMapRef.current) return;

    // Clear existing restaurant markers
    markersRef.current.forEach((marker) => {
      leafletMapRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    filteredRestaurants.forEach((restaurant) => {
      const isSelected = selectedRestaurant?.id === restaurant.id;
      const isHovered = hoveredRestaurant === restaurant.id;

      const restaurantIcon = (window as any).L.divIcon({
        className: "restaurant-marker",
        html: `<div style="
          background: ${isSelected ? "#dc2626" : "white"}; 
          border: 3px solid ${isSelected ? "#dc2626" : "#6b7280"}; 
          width: ${isSelected || isHovered ? "48px" : "40px"}; 
          height: ${isSelected || isHovered ? "48px" : "40px"}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: ${isSelected || isHovered ? "20px" : "18px"}; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
          cursor: pointer;
          transition: all 0.3s ease;
          ${isSelected ? "transform: scale(1.1);" : ""}
        ">${restaurant.image}</div>`,
        iconSize: [
          isSelected || isHovered ? 48 : 40,
          isSelected || isHovered ? 48 : 40,
        ],
        iconAnchor: [
          isSelected || isHovered ? 24 : 20,
          isSelected || isHovered ? 24 : 20,
        ],
      });

      const marker = (window as any).L.marker(
        [restaurant.location.lat, restaurant.location.lng],
        {
          icon: restaurantIcon,
        }
      )
        .addTo(leafletMapRef.current)
        .bindPopup(
          `
          <div style="text-align: center; min-width: 200px;">
            <div style="font-size: 24px; margin-bottom: 8px;">${restaurant.image}</div>
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${restaurant.name}</h3>
            <div style="background: #fef2f2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 12px; display: inline-block; margin-bottom: 8px;">${restaurant.category}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 12px;">
              <span>⭐ ${restaurant.rating}</span>
              <span>🕒 ${restaurant.deliveryTime}</span>
            </div>
           
          </div>
        `
        )
        .on("click", () => handleRestaurantSelect(restaurant))
        .on("mouseover", () => setHoveredRestaurant(restaurant.id))
        .on("mouseout", () => setHoveredRestaurant(null));

      markersRef.current.push(marker);

      // Auto-open popup for selected restaurant
      if (isSelected) {
        marker.openPopup();
      }
    });
  };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant: Restaurant): void => {
    setSelectedRestaurant(restaurant);
  };

  // Initialize Leaflet map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Load Leaflet CSS and JS
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(linkElement);

        // Wait for CSS to load
        await new Promise((resolve) => {
          linkElement.onload = resolve;
        });

        // Load Leaflet JavaScript
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        document.body.appendChild(script);

        script.onload = () => {
          if (mapRef.current && !leafletMapRef.current) {
            // Initialize the map centered on York University
            leafletMapRef.current = (window as any).L.map(
              mapRef.current
            ).setView([43.7735, -79.5019], 15);

            // Add OpenStreetMap tiles
            (window as any).L.tileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              {
                attribution: "© OpenStreetMap contributors",
                maxZoom: 19,
              }
            ).addTo(leafletMapRef.current);

            // Add user location marker
            const userIcon = (window as any).L.divIcon({
              className: "user-marker",
              html: `<div style="background: #2563eb; border: 3px solid white; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative;">
                       <div style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: #2563eb; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; white-space: nowrap; font-weight: bold;">4700 Keele St</div>
                     </div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            (window as any).L.marker([userLocation.lat, userLocation.lng], {
              icon: userIcon,
            })
              .addTo(leafletMapRef.current)
              .bindPopup(
                "<b>Your Location</b><br>4700 Keele Street<br>York University"
              );

            // Add restaurant markers
            updateRestaurantMarkers();

            // Add carrier markers
            updateCarrierMarkers();

            setMapLoading(false);
          }
        };
      } catch (error) {
        console.error("Error loading Leaflet:", error);
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

  // Update restaurant markers when filtered restaurants change
  useEffect(() => {
    if (leafletMapRef.current) {
      updateRestaurantMarkers();
    }
  }, [filteredRestaurants, selectedRestaurant, hoveredRestaurant]);

  // Calculate distance between two points
  const calculateDistance = (
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ): number => {
    const dx = loc1.lat - loc2.lat;
    const dy = loc1.lng - loc2.lng;
    return Math.sqrt(dx * dx + dy * dy) * 100;
  };

  // Find nearest carrier
  const findNearestCarrier = (restaurantLocation: {
    lat: number;
    lng: number;
  }): { carrier: Carrier | null; distance: number } => {
    let nearestCarrier: Carrier | null = null;
    let minDistance = Infinity;

    carriers.forEach((carrier) => {
      if (carrier.available) {
        const distance = calculateDistance(
          restaurantLocation,
          carrier.location
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestCarrier = carrier;
        }
      }
    });

    return { carrier: nearestCarrier, distance: minDistance };
  };

  // Calculate total order cost
  const calculateOrderTotal = async (
    restaurant: Restaurant,
    cartItems: CartItem[]
  ): Promise<OrderCosts> => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = 2;
    //TODO: Replace with actual distance calculation
    const weatherFee = await calculatePricing(
      calculateDistance(userLocation, restaurant.location)
    );
    // const weatherFee = 3; // Placeholder for weather fee calculation
    const serviceFee = Math.floor(subtotal * 0.05 * 100) / 100;
    const tax = Math.floor((subtotal + serviceFee) * 0.13 * 100) / 100;

    return {
      subtotal,
      deliveryFee,
      weatherFee,
      serviceFee,
      tax,
      total: subtotal + weatherFee + serviceFee + tax + deliveryFee,
    };
  };

  const creditCard = async () => {
    setButtonLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              name: item.name,
              price: item.price,
            })),
            fees: {
              delivery_fee: orderDetails?.costs.deliveryFee,
              service_fee: orderDetails?.costs.serviceFee,
              weather_fee: orderDetails?.costs.weatherFee,
              tax: orderDetails?.costs.tax,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Checkout session response:", data);

      // Check if we have the client secret
      if (!data.clientSecret) {
        throw new Error("Client secret not received from server");
      }

      setClientSecret(data.clientSecret);
      setPayment(true);
      console.log("Checkout session created successfully");
    } catch (error) {
      console.error("Error creating checkout session:", error);

      // More specific error messages
      if (error.message.includes("fetch")) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert(`Failed to create checkout session: ${error.message}`);
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const addToCart = async (item: MenuItem): Promise<void> => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = async (itemId: number): Promise<void> => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: number, quantity: number): void => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const confirmOrder = async (): Promise<void> => {
    setPayment(false);
    setButtonLoading(true);
    if (cart.length === 0 || !selectedRestaurant) return;

    const { carrier, distance } = findNearestCarrier(
      selectedRestaurant.location
    );
    const orderTotal = await calculateOrderTotal(selectedRestaurant, cart);

    const newOrderDetails: OrderDetails = {
      restaurant: selectedRestaurant,
      items: cart,
      carrier,
      distance: distance.toFixed(2),
      costs: orderTotal,
      estimatedTime: Math.ceil(distance * 2 + 15),
    };
    setOrderDetails(newOrderDetails);
    setShowOrderConfirmation(true);
    setButtonLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Leaflet Map */}
      <div className="flex-1 relative">
        {mapLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg mb-2">
                Loading York University Map...
              </p>
              <p className="text-gray-500 text-sm">
                4700 Keele St, North York, ON
              </p>
            </div>
          </div>
        ) : null}

        {/* Map Container */}
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Search Bar */}
        <div className="absolute top-4 left-1/12 right-1/4 z-30">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search restaurants near York University..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 border-0"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="absolute top-20 left-4 right-1/4 z-30">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                  selectedCategory === category
                    ? "bg-red-900 text-white shadow-lg transform scale-105"
                    : "bg-white text-red-900 hover:bg-red-50 shadow-md hover:shadow-lg"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 z-20">
          <h4 className="font-semibold text-sm mb-3 text-gray-800">
            York University Area
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-3 border-2 border-white"></div>
              <span>4700 Keele St (You)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full mr-3 flex items-center justify-center">
                <span className="text-xs">🍕</span>
              </div>
              <span>Restaurants</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 border border-white"></div>
              <span>Available Carriers</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-600">
            <MapPin size={12} className="inline mr-1" />
            North York, ON M3J 1P3
          </div>
        </div>
      </div>

      {/* Right Side - Restaurant List */}
      <div className="w-96 bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 bg-gradient-to-br from-red-900 to-red-800 text-white">
          <Link to="/">
            <House className="top-3 -translate-x-3 absolute" />
          </Link>
          <h2 className="text-xl font-bold mb-2">DormDash Delivery</h2>
          <p className="opacity-90 text-sm">
            {filteredRestaurants.length} restaurants near your location
          </p>
          <div className="flex items-center mt-2 text-sm opacity-75">
            <MapPin size={14} className="mr-1" />
            4700 Keele St Area
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                selectedRestaurant?.id === restaurant.id
                  ? "bg-red-50 border-l-4 border-l-red-900 shadow-md"
                  : "border-gray-200"
              }`}
              onClick={() => handleRestaurantSelect(restaurant)}
              onMouseEnter={() => setHoveredRestaurant(restaurant.id)}
              onMouseLeave={() => setHoveredRestaurant(null)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{restaurant.image}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-red-900 bg-red-100 px-2 py-1 rounded-full inline-block">
                      {restaurant.category}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center text-yellow-500 mb-1">
                    <Star size={14} className="mr-1 fill-current" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1 text-blue-500" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center"></div>
              </div>

              {selectedRestaurant?.id === restaurant.id && (
                <div className="mt-3 p-2 bg-red-100 rounded-lg">
                  <p className="text-xs text-red-800 font-medium">
                    📍 Selected for delivery to York University
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Restaurant Menu */}
        {selectedRestaurant && (
          <div className="max-h-80 border-t-2 border-red-200 overflow-y-auto bg-red-50 shadow-2xl shadow-black rounded-t-2xl">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center text-red-900">
                <ShoppingCart size={20} className="mr-2" />
                Menu - {selectedRestaurant.name}
              </h3>

              {selectedRestaurant.menu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-3 mb-3 shadow-sm border border-red-100"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <span className="font-bold text-red-900">
                      ${item.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg transform hover:scale-105"
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
            <h3 className="font-bold mb-3 text-red-900">
              Your Order ({cart.length} items)
            </h3>
            <div className="max-h-32 overflow-y-auto mb-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2 text-sm"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity - 1)
                      }
                      className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full text-xs hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                      className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full text-xs hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="ml-2 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={confirmOrder}
              className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {buttonLoading ? <Spinner /> : "Review Order"}
            </button>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderDetails && (
        <div className="fixed inset-0 bg-black/55 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {!payment ? (
              <div className="p-6">
                <div className="text-center mb-6">
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-3 text-red-900"
                  />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Confirmation
                  </h2>
                </div>

                {/* Restaurant Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div className="flex items-center text-left">
                    <span className="text-2xl mr-3">
                      {orderDetails.restaurant.image}
                    </span>
                    <div>
                      <h3 className="font-bold">
                        {orderDetails.restaurant.name}
                      </h3>
                      <p className="text-sm text-red-900">
                        {orderDetails.restaurant.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="font-bold text-red-900">
                      {orderDetails.estimatedTime} min
                    </p>
                  </div>
                </div>

                {/* Carrier Info */}
                <div className="bg-blue-50 rounded-lg flex justify-between items-center px-4 py-2 mb-4 border-l-4 border-red-900">
                  <h4 className="font-medium text-red-900">Your Carrier</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {orderDetails.carrier?.name || "No carrier available"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Distance: {orderDetails.distance} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Order Items</h4>
                  {orderDetails.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm mb-1"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
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
                      {" "}
                      {/* We have a base delivery fee of 2$ */}
                      <span>Delivery Fee</span>
                      <span>$2.00</span>
                    </div>
                    {orderDetails.costs.weatherFee > 0 && (
                      <div className="flex justify-between text-orange-600 group relative">
                        <span className="flex items-center">
                          Dynamic Conditions Fee
                          <span
                            className="ml-1 cursor-pointer text-orange-400"
                            tabIndex={0}
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <text
                                x="12"
                                y="16"
                                textAnchor="middle"
                                fontSize="12"
                                fill="currentColor"
                              >
                                ?
                              </text>
                            </svg>
                          </span>
                          <div className="absolute left-0 top-6 z-10 hidden group-hover:block group-focus:block bg-white border border-orange-300 rounded-lg shadow-lg px-3 py-2 text-xs text-gray-700 w-64">
                            This fee accounts for distance, weather, and other
                            conditions affecting delivery time.
                          </div>
                        </span>
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
                      <span className="text-red-900">
                        ${orderDetails.costs.total.toFixed(2)}
                      </span>
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
                    onClick={creditCard}
                    className="flex-1 bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {buttonLoading ? <Spinner /> : "Proceed to Payment"}
                  </button>
                </div>
              </div>
            ) : paid ? (
              <div className="p-6">
                <div className="text-center mb-6">
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-3 text-red-900"
                  />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Placed Successfully!
                  </h2>
                </div>

                <p className="text-gray-700 mb-4">
                  Your order has been placed and your carrier will be notified.
                </p>

                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6">
                {" "}
                <div className="text-center mb-6">
                  <CreditCard size={48} className="mx-auto mb-3 text-red-900" />
                  <h2 className="text-2xl text-gray-900">Payment Method</h2>
                </div>
                <div className="mb-4">
                  <div>
                    {clientSecret && (
                      <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{
                          clientSecret: clientSecret,
                          onComplete: () => {
                            setPaid(true);
                          },
                        }}
                      >
                        <EmbeddedCheckout />
                      </EmbeddedCheckoutProvider>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderConfirmation(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
