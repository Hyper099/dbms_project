import React from 'react';

export default function Hero() {
   return (
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
         <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70"></div>
            <svg className="absolute bottom-0 text-white" viewBox="0 0 1440 320">
               <path fill="currentColor" fillOpacity="1" d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,90.7C672,85,768,107,864,133.3C960,160,1056,192,1152,176C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
         </div>
         <div className="container mx-auto px-6 py-32 relative z-10">
            <div className="flex flex-wrap items-center">
               <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                     Unlock Your Potential with Expert-Led Courses
                  </h1>
                  <p className="text-xl mb-8 opacity-90">
                     Join thousands of learners mastering new skills and advancing their careers through our premium online courses.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                     <a href="#browse-courses" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg text-center transform transition duration-300 hover:scale-105">
                        Browse Courses
                     </a>
                     <a href="#how-it-works" className="bg-transparent hover:bg-white hover:bg-opacity-20 border-2 border-white px-8 py-3 rounded-lg font-medium text-lg text-center transform transition duration-300 hover:scale-105">
                        How It Works
                     </a>
                  </div>
                  <div className="mt-50 flex items-center text-sm">
                     <span className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>4.9/5 from 2,500+ reviews</span>
                     </span>
                  </div>
               </div>
               <div className="w-full lg:w-1/2">
                  <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                     <h3 className="text-gray-800 font-semibold text-lg mb-4">Explore Top Categories</h3>
                     <div className="grid grid-cols-2 gap-3">
                        <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-100 transition">
                           <div className="bg-indigo-100 p-2 rounded-md mr-3">
                              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                           </div>
                           <span className="text-gray-700">Web Development</span>
                        </a>
                        <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-100 transition">
                           <div className="bg-purple-100 p-2 rounded-md mr-3">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                              </svg>
                           </div>
                           <span className="text-gray-700">Data Science</span>
                        </a>
                        <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-100 transition">
                           <div className="bg-blue-100 p-2 rounded-md mr-3">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                           </div>
                           <span className="text-gray-700">UX/UI Design</span>
                        </a>
                        <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-100 transition">
                           <div className="bg-green-100 p-2 rounded-md mr-3">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                           </div>
                           <span className="text-gray-700">Finance</span>
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
