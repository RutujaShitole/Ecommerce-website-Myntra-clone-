import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
  orders: JSON.parse(localStorage.getItem("orders")) || [],
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  searchQuery: "",
  selectedCategory: "All",
};

function appReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find(
        (item) => item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
      );
      if (exists) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (item) => !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize)
        ),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "PLACE_ORDER": {
      const orderId = "OD" + Math.floor(1000000000 + Math.random() * 9000000000);
      const today = new Date();
      const expectedDelivery = new Date();
      expectedDelivery.setDate(today.getDate() + 3);

      const formatOptions = { day: "numeric", month: "short", year: "numeric" };
      const newOrder = {
        id: orderId,
        date: today.toLocaleDateString("en-IN", formatOptions),
        items: [...state.cart],
        total: action.payload.total,
        discount: action.payload.discount,
        delivery: action.payload.delivery,
        finalTotal: action.payload.finalTotal,
        paymentMethod: action.payload.paymentMethod || "Credit Card",
        status: "Confirmed",
        deliveryDate: expectedDelivery.toLocaleDateString("en-IN", formatOptions),
        address: action.payload.address || {
          name: state.user?.name || "Jane Doe",
          street: "7, Business Square, Shivajinagar",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411005",
          phone: "+91 98765 43210"
        }
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        cart: [],
      };
    }
    case "TOGGLE_WISHLIST": {
      const inWishlist = state.wishlist.find((item) => item.id === action.payload.id);
      return {
        ...state,
        wishlist: inWishlist
          ? state.wishlist.filter((item) => item.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    if (state.darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [state.darkMode]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  const isInWishlist = (id) => state.wishlist.some((item) => item.id === id);
  const isInCart = (id) => state.cart.some((item) => item.id === id);

  return (
    <AppContext.Provider
      value={{ state, dispatch, cartCount, cartTotal, wishlistCount, isInWishlist, isInCart }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
