import React, { useEffect, useState } from "react";
import { FaBars, FaSearch, FaShoppingCart, FaSignOutAlt, FaTimes, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../Context/CartContext";

export default function Navbar() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   const { cartCount } = useCart();

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
            setIsDropdownOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isDropdownOpen]);

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
      <header className="text-gray-600 body-font border-b shadow-md sticky top-0 bg-white z-50">
         <div className="container mx-auto flex flex-wrap p-3 md:p-5 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex title-font font-medium items-center text-gray-900">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
               </svg>
               <span className="ml-3 text-xl font-bold">EduConnect</span>
            </Link>

            {/* Mobile menu button */}
            <button
               className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
               {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex md:flex-row md:ml-auto md:mr-auto items-center text-base">
               <Link to="/" className="mr-5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition">Home</Link>
               <Link to="/courses" className="mr-5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition">Courses</Link>
               <Link to="/about" className="mr-5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition">About</Link>
               <Link to="/contact" className="mr-5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition">Contact</Link>

               {/* Search bar */}
               <div className="relative mx-4">
                  <input
                     type="text"
                     placeholder="Search courses..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-64 bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
               </div>
            </nav>

            {/* User actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
               {user ? (
                  <>
                     {/* Only show cart for students, not for instructors */}
                     {localStorage.getItem("role") !== "instructor" && (
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition">
                           <FaShoppingCart size={20} />
                           {cartCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                 {cartCount}
                              </span>
                           )}
                        </Link>
                     )}
                     <div className="relative user-dropdown-container">
                        <button
                           className="flex items-center space-x-2 text-gray-800 font-medium hover:text-indigo-600 transition"
                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                           onMouseEnter={() => setIsDropdownOpen(true)}
                        >
                           <FaUserCircle size={20} />
                           <span>{user.firstName}</span>
                        </button>
                        {isDropdownOpen && (
                           <div
                              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                              onMouseLeave={() => setIsDropdownOpen(false)}
                           >
                              <Link
                                 to={`/dashboard/${localStorage.getItem("role")}`}
                                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                 onClick={() => setIsDropdownOpen(false)}
                              >
                                 Dashboard
                              </Link>
                              <Link
                                 to="/profile"
                                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                 onClick={() => setIsDropdownOpen(false)}
                              >
                                 Profile
                              </Link>
                              <hr className="my-1" />
                              <button
                                 onClick={() => {
                                    handleLogout();
                                    setIsDropdownOpen(false);
                                 }}
                                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              >
                                 <FaSignOutAlt className="mr-2" /> Logout
                              </button>
                           </div>
                        )}
                     </div>
                  </>
               ) : (
                  <div className="space-x-2">
                     <Link to="/login" className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800 transition">
                        Log In
                     </Link>
                     <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium">
                        Sign Up
                     </Link>
                  </div>
               )}
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
               <div className="px-4 py-2">
                  <div className="relative mb-4 mt-2">
                     <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                     />
                     <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>

                  <nav className="flex flex-col space-y-2">
                     <Link to="/" className="py-2 hover:text-indigo-600 transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
                     <Link to="/courses" className="py-2 hover:text-indigo-600 transition" onClick={() => setIsMenuOpen(false)}>Courses</Link>
                     <Link to="/about" className="py-2 hover:text-indigo-600 transition" onClick={() => setIsMenuOpen(false)}>About</Link>
                     <Link to="/contact" className="py-2 hover:text-indigo-600 transition" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  </nav>

                  <div className="mt-4 border-t pt-4">
                     {user ? (
                        <>
                           <div className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                 <FaUserCircle size={20} className="mr-2 text-indigo-600" />
                                 <span className="font-medium">{user.firstName}</span>
                              </div>
                              <Link to="/cart" className="relative p-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                                 <FaShoppingCart size={20} />
                                 {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                       {cartCount}
                                    </span>
                                 )}
                              </Link>
                           </div>
                           <Link
                              to={`/dashboard/${localStorage.getItem("role")}`}
                              className="block py-2 hover:text-indigo-600 transition"
                              onClick={() => setIsMenuOpen(false)}
                           >
                              Dashboard
                           </Link>
                           <Link
                              to="/profile"
                              className="block py-2 hover:text-indigo-600 transition"
                              onClick={() => setIsMenuOpen(false)}
                           >
                              Profile
                           </Link>
                           <button
                              onClick={() => {
                                 handleLogout();
                                 setIsMenuOpen(false);
                              }}
                              className="flex items-center w-full py-2 text-red-600"
                           >
                              <FaSignOutAlt className="mr-2" /> Logout
                           </button>
                        </>
                     ) : (
                        <div className="flex flex-col space-y-2">
                           <Link
                              to="/login"
                              className="bg-white border border-indigo-600 text-indigo-600 text-center py-2 rounded-md hover:bg-indigo-50 transition"
                              onClick={() => setIsMenuOpen(false)}
                           >
                              Log In
                           </Link>
                           <Link
                              to="/signup"
                              className="bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition"
                              onClick={() => setIsMenuOpen(false)}
                           >
                              Sign Up
                           </Link>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
}
