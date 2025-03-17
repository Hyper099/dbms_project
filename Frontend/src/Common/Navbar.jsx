import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Navbar() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchUser = async () => {
         const token = localStorage.getItem("token");
         const role = localStorage.getItem("role");

         if (token && role) {
            try {
               const response = await API.get(`/${role}/details`, {
                  headers: { token }
               });

               setUser(response.data);
            } catch (error) {
               console.error("Error fetching user details:", error);
            }
         }
      };

      fetchUser();
   }, []);

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      navigate("/");
   };

   return (
      <header className="text-gray-600 body-font border-b shadow-md">
         <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
               </svg>
               <span className="ml-3 text-xl">EduConnect</span>
            </Link>

            <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
               <Link to="/" className="mr-5 hover:text-gray-900">Home</Link>
               <Link to="/courses" className="mr-5 hover:text-gray-900">Courses</Link>
               <Link to="/about" className="mr-5 hover:text-gray-900">About</Link>
               <Link to="/contact" className="mr-5 hover:text-gray-900">Contact</Link>
            </nav>

            {user ? (
               <div className="flex items-center space-x-4">
                  <Link to={`/dashboard/${localStorage.getItem("role")}`} className="text-gray-800 font-semibold">
                     Welcome, {user.firstName}
                  </Link>
                  <button
                     onClick={handleLogout}
                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                     Logout
                  </button>
               </div>
            ) : (
               <Link to="/login" className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition">
                  Get Started
               </Link>
            )}

         </div>
      </header>
   );
}
