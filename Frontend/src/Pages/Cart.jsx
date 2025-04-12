import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaLock, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Cart = () => {
   const [cartItems, setCartItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [totalPrice, setTotalPrice] = useState(0);
   const navigate = useNavigate();

   // Fetch cart items when component mounts
   useEffect(() => {
      fetchCartItems();
   }, []);

   // Calculate total price whenever cart items change
   useEffect(() => {
      const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
      setTotalPrice(total);
   }, [cartItems]);

   // Function to fetch cart items
   const fetchCartItems = async () => {
      try {
         const token = localStorage.getItem('token');
         setLoading(true);
         const response = await API.get('/cart', {
            headers: { token }
         });

         console.log(response.data);
         setCartItems(response.data.cartItems);
         setTotalPrice(response.data.totalPrice);
         setError(null);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to load cart items');
         console.error('Error fetching cart:', err);
         // Hide error after 3 seconds
         setTimeout(() => setError(null), 3000);
      } finally {
         setLoading(false);
      }
   };

   // Function to remove course from cart
   const removeCourseFromCart = async (courseId) => {
      try {
         await axios.delete('/api/cart', {
            data: { courseId },
            withCredentials: true
         });

         setCartItems(prevItems => prevItems.filter(item => item.courseId !== courseId));
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to remove course from cart');
         console.error('Error removing course from cart:', err);
         setTimeout(() => setError(null), 3000);
      }
   };


   // Function to handle checkout (placeholder for future implementation)
   const handlePayment = async () => {
      if (cartItems.length === 0) {
         setError("Your cart is empty");
         return;
      }

      try {
         const token = localStorage.getItem("token");
         if (!token) {
            setError("Unauthorized: Please log in to complete your purchase.");
            return;
         }

         if (!window.Razorpay) {
            setError("Payment gateway is not loaded. Please refresh the page.");
            return;
         }

         // Step 1: Create Order
         const { data } = await API.post(
            "/payment/create-order",
            {},  // Empty body since backend fetches cart items based on student ID
            { headers: { token } }
         );

         // Step 2: Open Razorpay Modal
         const options = {
            key: "rzp_test_pOuJ0Zs5X1BfNr", // Razorpay key_id
            amount: data.amount,
            currency: "INR",
            name: "Course Purchase",
            description: `${cartItems.length} course${cartItems.length > 1 ? 's' : ''}`,
            order_id: data.id,
            handler: async function (response) {
               try {
                  // Step 3: Verify Payment
                  const verificationResponse = await API.post(
                     "/payment/verify-payment",
                     {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: totalPrice,
                     },
                     { headers: { token } }
                  );

                  // Show success message
                  alert("Payment Successful! You are now enrolled in the courses.");
                  console.log(verificationResponse.data);

                  // Redirect to dashboard after successful payment
                  navigate("/dashboard/student");
               } catch (error) {
                  console.error("Payment verification failed:", error);
                  setError("Payment verification failed. Please contact support.");
               }
            },
            prefill: {
               name: "User Name",
               email: "user@example.com",
               contact: "9999999999"
            },
            theme: {
               color: "#6366F1"
            }
         };

         const razorpay = new window.Razorpay(options);
         razorpay.open();
      } catch (error) {
         console.error("Payment Error:", error);
         setError(error.response?.data?.error || "Payment failed. Please try again.");
      }
   };

   // Function to continue shopping
   const continueShopping = () => {
      navigate('/courses');
   };

   // Render loading state
   if (loading) {
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="text-xl font-semibold">Loading your cart...</div>
      <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}


   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-6">Checkout</h1>

         {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 transition duration-300">
               {error}
            </div>
         )}


         {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
               <FaShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
               <p className="text-2xl font-semibold mb-4">Your cart is empty</p>
               <p className="text-gray-500 mb-8">Looks like you haven't added any courses yet.</p>
               <button
                  onClick={continueShopping}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all flex items-center mx-auto"
               >
                  <FaArrowLeft className="mr-2" /> Browse Courses
               </button>
            </div>

         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Cart Items - Left Side (2/3 width on large screens) */}
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                     <h2 className="text-xl font-semibold p-4 border-b">Cart Items</h2>
                     <div className="divide-y divide-gray-200">
                           {cartItems.map((item) => (
                              <div key={item.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center">
                                    {item.imageUrl && (
                                       <img
                                          src={item.imageUrl || "/placeholder-course.jpg"}
                                          alt={item.title}
                                          className="w-16 h-16 object-cover rounded mr-4 hidden sm:block"
                                       />
                                    )}
                                    <div>
                                       <div className="font-medium text-gray-900 text-lg">{item.title}</div>
                                       {item.instructor && <div className="text-gray-500 text-sm">By {item.instructor}</div>}
                                    </div>
                                 </div>
                                 <div className="flex items-center">
                                    <div className="text-gray-900 mr-4 font-semibold text-lg">
                                       ${item.price}
                                    </div>
                                    <button
                                       onClick={() => removeCourseFromCart(item.id)}
                                       className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
                                       aria-label="Remove item"
                                    >
                                       <FaTrash />
                                    </button>
                                 </div>
                              </div>
                           ))}
                     </div>
                  </div>
               </div>

               {/* Billing Summary - Right Side (1/3 width on large screens) */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                     <h2 className="text-xl font-semibold p-4 border-b bg-gray-50">Order Summary</h2>
                     <div className="p-4">
                        <div className="divide-y divide-gray-200">
                           {cartItems.map((item) => (
                              <div key={item.id} className="py-3 flex justify-between">
                                 <div className="text-gray-700">{item.title}</div>
                                 <div className="font-medium">${item.price}</div>
                              </div>
                           ))}

                           {/* Add coupon code field */}
                           <div className="py-4">
                              <div className="flex space-x-2">
                                 <input
                                    type="text"
                                    placeholder="Coupon code"
                                    className="flex-1 border rounded p-2 text-sm"
                                 />
                                 <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-300">
                                    Apply
                                 </button>
                              </div>
                           </div>

                           <div className="py-3 flex justify-between">
                              <div className="text-gray-700">Subtotal</div>
                              <div className="font-medium">${totalPrice}</div>
                           </div>
                           <div className="py-3 flex justify-between">
                              <div className="text-gray-700">Discount</div>
                              <div className="font-medium text-green-600">$0.00</div>
                           </div>
                           <div className="py-3 flex justify-between font-bold text-lg">
                              <div>Total</div>
                              <div>${totalPrice}</div>
                           </div>
                        </div>

                        {/* Enhanced payment button */}
                        <button
                           onClick={handlePayment}
                           className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 mt-6 flex items-center justify-center transition-colors"
                        >
                           <FaLock className="mr-2" /> Pay Securely Now
                        </button>

                        <button
                           onClick={continueShopping}
                           className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 mt-4 transition-colors"
                        >
                           Continue Shopping
                        </button>

                        {/* Add payment methods info */}
                        <div className="mt-4 text-center">
                           <p className="text-xs text-gray-500">Secure payment powered by Razorpay</p>
                           
                        </div>
                     </div>
                  </div>
            </div>
         )}
      </div>
   );
};

export default Cart;