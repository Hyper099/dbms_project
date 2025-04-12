// src/context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
   const [cartCount, setCartCount] = useState(0);

   const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      if (token && localStorage.getItem("role") === "student") {
         try {
            const response = await API.get("/cart/count", {
               headers: { token },
            });
            setCartCount(response.data.count);
         } catch (error) {
            console.error("Error fetching cart count:", error);
         }
      }
   };

   useEffect(() => {
      fetchCartCount(); 
   }, []);

   return (
      <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
         {children}
      </CartContext.Provider>
   );
};

export const useCart = () => useContext(CartContext);
