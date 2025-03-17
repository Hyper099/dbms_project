import React, { useEffect, useState } from "react";
import API from "../../utils/api";

export default function Courses() {
   const [courses, setCourses] = useState([]);
   const [selectedCourse, setSelectedCourse] = useState(null);
   const [enrolledCourses, setEnrolledCourses] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterPrice, setFilterPrice] = useState(null);

   useEffect(() => {
      const fetchCourses = async () => {
         try {
            const response = await API.get("/course");
            setCourses(response.data);
         } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Failed to load courses.");
         } finally {
            setLoading(false);
         }
      };
      fetchCourses();
   }, []);

   const handlePayment = async () => {
      if (!selectedCourse) return;

      try {
         const token = localStorage.getItem("token");
         if (!token) {
            alert("Unauthorized: Please log in to enroll.");
            return;
         }

         if (!window.Razorpay) {
            alert("Payment gateway is not loaded. Please refresh the page.");
            return;
         }

         // Step 1: Create Order
         const { data } = await API.post("/payment/create-order",
            {
               courseId: selectedCourse.id,
               amount: selectedCourse.price
            },
            { headers: { token } }
         );

         // If already enrolled, stop payment
         if (data.error) {
            alert(data.error);
            return;
         }

         // Step 2: Open Razorpay Modal
         const options = {
            key: "rzp_test_pOuJ0Zs5X1BfNr", //razorpay key_id.
            amount: data.amount,
            currency: "INR",
            name: "Course Payment",
            description: selectedCourse.title,
            order_id: data.id,
            handler: async function (response) {
               try {
                  // Step 3: Verify Payment
                  const verificationResponse = await API.post("/payment/verify-payment", {
                     razorpay_payment_id: response.razorpay_payment_id,
                     razorpay_order_id: response.razorpay_order_id,
                     razorpay_signature: response.razorpay_signature,
                     amount: selectedCourse.price,
                     courseId: selectedCourse.id // Send courseId to enroll
                  });

                  alert("Payment Successful!");
                  console.log(verificationResponse.data);

                  // Step 4: Enroll Student
                  try {
                     const enrollResponse = await API.post(
                        "/course/enroll",
                        { courseId: selectedCourse.id },
                        { headers: { token } }
                     );

                     alert(enrollResponse.data.message || "Enrollment successful!");

                     // Refresh enrolled courses
                     try {
                        const enrolledResponse = await API.get("/student/course/enrolled", {
                           headers: { token }
                        });
                        setEnrolledCourses(enrolledResponse.data.map(course => course.id));
                     } catch (error) {
                        console.error("Error refreshing enrolled courses:", error);
                     }

                     setSelectedCourse(null); // Close modal
                  } catch (enrollError) {
                     console.error("Enrollment failed:", enrollError);
                     alert("Payment was successful, but enrollment failed. Please contact support.");
                  }

               } catch (error) {
                  console.error("Payment verification failed:", error);
                  alert("Payment verification failed. Please contact support.");
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
         alert(error.response?.data?.error || "Payment failed. Please try again.");
      }
   };

   //! To fetch Enrolled Courses.
   useEffect(() => {
      const fetchEnrolledCourses = async () => {
         const token = localStorage.getItem("token");
         if (token) {
            try {
               const response = await API.get("/student/course/enrolled", {
                  headers: { token }
               });
               setEnrolledCourses(response.data.map(course => course.id));
            } catch (error) {
               console.error("Error fetching enrolled courses:", error);
               // Don't set error state here to avoid disrupting the main courses display
            }
         }
      };

      fetchEnrolledCourses();
   }, []);


   // Filter courses based on search term and price filter
   const filteredCourses = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         course.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterPrice === null) return matchesSearch;
      if (filterPrice === "low") return matchesSearch && course.price < 50;
      if (filterPrice === "medium") return matchesSearch && course.price >= 50 && course.price < 100;
      if (filterPrice === "high") return matchesSearch && course.price >= 100;

      return matchesSearch;
   });

   if (loading) return (
      <div className="flex justify-center items-center h-64">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
   );

   if (error) return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-auto my-8 max-w-2xl rounded shadow-md">
         <p className="font-bold">Error</p>
         <p>{error}</p>
      </div>
   );

   return (
      <section className="text-gray-600 body-font bg-gray-50">
         <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Explore Our Courses
               </h1>
               <p className="text-xl text-gray-600 mx-auto leading-relaxed max-w-2xl">
                  Discover high-quality courses designed to help you master new skills and advance your career.
               </p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
               <div className="relative flex-grow">
                  <input
                     type="text"
                     placeholder="Search courses..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  value={filterPrice || ""}
                  onChange={(e) => setFilterPrice(e.target.value || null)}
               >
                  <option value="">All Prices</option>
                  <option value="low">Under Rs.50</option>
                  <option value="medium">Rs.50 - Rs.99</option>
                  <option value="high">Rs.100+</option>
               </select>
            </div>

            {/* Course Cards */}
            <div className="flex flex-wrap -m-4">
               {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                     <div key={course.id} className="p-4 md:w-1/3">
                        <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                           {/* Add placeholder image for visual appeal */}
                           <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                              <div className="absolute top-4 right-4 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800">
                                 {course.category || "Featured"}
                              </div>
                           </div>
                           <div className="p-6">
                              <h2 className="text-xl text-gray-900 font-bold title-font mb-2">
                                 {course.title}
                              </h2>
                              <div className="flex items-center mb-3">
                                 <div className="flex text-yellow-400">
                                    {"★".repeat(5)}
                                 </div>
                                 <span className="text-gray-500 text-sm ml-1">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                              </div>
                              <p className="leading-relaxed text-base mb-4 text-gray-600 line-clamp-3">
                                 {course.description}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                 <span className="text-indigo-600 text-xl font-bold">
                                    Rs.{course.price}
                                 </span>
                                 <button
                                    onClick={() => setSelectedCourse(course)}
                                    className="text-white bg-indigo-600 border-0 py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                 >
                                    View Details
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="w-full text-center py-12">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <p className="text-xl text-gray-500">No courses found matching your criteria.</p>
                     <button
                        onClick={() => { setSearchTerm(""); setFilterPrice(null); }}
                        className="mt-4 text-indigo-600 hover:text-indigo-800"
                     >
                        Clear filters
                     </button>
                  </div>
               )}
            </div>

            {/* Improved Modal */}
            {selectedCourse && (
               <div
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ backdropFilter: "blur(8px)" }}
                  onClick={(e) => {
                     if (e.target === e.currentTarget) setSelectedCourse(null);
                  }}
               >
                  <div className="fixed inset-0 bg-black opacity-30"></div>
                  <div className="bg-white w-[90%] md:w-[70%] lg:w-[60%] max-w-3xl p-0 rounded-xl shadow-2xl transform transition-all scale-100 z-10 overflow-hidden">
                     {/* Modal Header with Image */}
                     <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
                        <button
                           className="absolute top-4 right-4 bg-white rounded-full p-1 hover:bg-gray-200 transition-colors"
                           onClick={() => setSelectedCourse(null)}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                        <div className="absolute bottom-4 left-8">
                           <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800">
                              {selectedCourse.category || "Featured"}
                           </span>
                        </div>
                     </div>

                     {/* Modal Content */}
                     <div className="p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>

                        <div className="flex items-center mb-4">
                           <div className="flex text-yellow-400">
                              {"★".repeat(5)}
                           </div>
                           <span className="text-gray-500 text-sm ml-1">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                           <h3 className="font-semibold text-gray-800 mb-2">Course Highlights:</h3>
                           <ul className="list-disc pl-5 space-y-1 text-gray-700">
                              <li>24/7 lifetime access</li>
                              <li>Certificate of completion</li>
                              <li>Downloadable resources</li>
                              <li>Expert instruction</li>
                           </ul>
                        </div>

                        <div className="mb-6">
                           <h3 className="font-semibold text-gray-800 mb-2">Description:</h3>
                           <p className="text-gray-700">{selectedCourse.description}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50 p-4 rounded-lg">
                           <div>
                              <span className="text-indigo-600 text-3xl font-bold block">
                                 Rs.{selectedCourse.price}
                              </span>
                              <span className="text-gray-500">30-day money back guarantee</span>
                           </div>
                           <div className="mt-4 sm:mt-0 flex space-x-3">
                              <button
                                 className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                 onClick={() => alert("Added to wishlist!")}
                              >
                                 Add to Wishlist
                              </button>
                              {enrolledCourses.includes(selectedCourse.id) ? (
                                 <button
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-default"
                                    disabled
                                 >
                                    Enrolled
                                 </button>
                              ) : (
                                 <button
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    onClick={handlePayment}
                                 >
                                    Enroll Now
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </section>
   );
}