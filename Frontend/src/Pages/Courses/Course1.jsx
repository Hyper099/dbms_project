import { Book, Clock, Search, Sliders, Star, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const CoursesPage = () => {
   const [courses, setCourses] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCourse, setSelectedCourse] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [enrolledCourses, setEnrolledCourses] = useState([1, 3]); // Example enrolled course IDs
   const [cart, setCart] = useState([]);
   const [sidebarOpen, setSidebarOpen] = useState(false);

   // Filter states
   const [categoryFilters, setCategoryFilters] = useState([]);
   const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
   const [ratingFilter, setRatingFilter] = useState(0);
   const [levelFilters, setLevelFilters] = useState([]);
   const [sortOption, setSortOption] = useState('popular');

   // Demo categories and levels
   const categories = ['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Business'];
   const levels = ['Beginner', 'Intermediate', 'Advanced'];

   // Fetch courses (mock data for demo)
   useEffect(() => {
      // Simulate API call
      setTimeout(() => {
         const mockCourses = [
            {
               id: 1,
               title: 'Advanced React Development',
               description: 'Master React with hooks, context API, and Redux. Build complex single-page applications with best practices and optimal performance.',
               price: 199,
               category: 'Web Development',
               level: 'Advanced',
               rating: 4.8,
               reviews: 235,
               students: 12430,
               hours: 42,
               lessons: 85,
            },
            {
               id: 2,
               title: 'Data Science Fundamentals',
               description: 'Learn data science from scratch. Master Python, data visualization, machine learning, and statistical analysis to solve real-world problems.',
               price: 149,
               category: 'Data Science',
               level: 'Beginner',
               rating: 4.7,
               reviews: 187,
               students: 8745,
               hours: 38,
               lessons: 72,
               instructor: {
                  name: 'Priya Patel',
                  title: 'Data Scientist',
                  image: '/api/placeholder/100/100'
               },
               skills: ['Python', 'Pandas', 'NumPy', 'Visualization', 'Machine Learning Basics']
            },
            {
               id: 3,
               title: 'Flutter App Development',
               description: 'Build beautiful native mobile applications for iOS and Android from a single codebase using Flutter and Dart.',
               price: 179,
               category: 'Mobile Development',
               level: 'Intermediate',
               rating: 4.9,
               reviews: 312,
               students: 15670,
               hours: 45,
               lessons: 92,
               instructor: {
                  name: 'Rahul Verma',
                  title: 'Mobile App Developer',
                  image: '/api/placeholder/100/100'
               },
               skills: ['Dart', 'Flutter Widgets', 'State Management', 'API Integration', 'UI Design']
            },
            {
               id: 4,
               title: 'UX Design Principles',
               description: 'Learn user experience design from the ground up. Master user research, wireframing, prototyping, and user testing.',
               price: 129,
               category: 'UI/UX Design',
               level: 'Beginner',
               rating: 4.6,
               reviews: 145,
               students: 6890,
               hours: 32,
               lessons: 64,
               instructor: {
                  name: 'Neha Gupta',
                  title: 'UX Design Lead',
                  image: '/api/placeholder/100/100'
               },
               skills: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Figma']
            },
            {
               id: 5,
               title: 'NodeJS Backend Development',
               description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn authentication, authorization, and API development.',
               price: 159,
               category: 'Web Development',
               level: 'Intermediate',
               rating: 4.7,
               reviews: 203,
               students: 9870,
               hours: 36,
               lessons: 78,
               instructor: {
                  name: 'Vikram Singh',
                  title: 'Backend Developer',
                  image: '/api/placeholder/100/100'
               },
               skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication']
            },
            {
               id: 6,
               title: 'Digital Marketing Strategy',
               description: 'Learn to create and implement effective digital marketing strategies. Master SEO, social media marketing, email campaigns, and analytics.',
               price: 99,
               category: 'Business',
               level: 'Beginner',
               rating: 4.5,
               reviews: 178,
               students: 11450,
               hours: 28,
               lessons: 56,
               instructor: {
                  name: 'Anjali Kumar',
                  title: 'Digital Marketing Consultant',
                  image: '/api/placeholder/100/100'
               },
               skills: ['SEO', 'Social Media Marketing', 'Email Marketing', 'Analytics', 'Content Strategy']
            }
         ];

         setCourses(mockCourses);
         setIsLoading(false);
      }, 1000);
   }, []);

   // Add to cart function
   const addToCart = (course) => {
      setCart([...cart, course.id]);
   };

   // Check if course is in cart
   const isInCart = (courseId) => {
      return cart.includes(courseId);
   };

   // Filter handling
   const toggleCategoryFilter = (category) => {
      if (categoryFilters.includes(category)) {
         setCategoryFilters(categoryFilters.filter(c => c !== category));
      } else {
         setCategoryFilters([...categoryFilters, category]);
      }
   };

   const toggleLevelFilter = (level) => {
      if (levelFilters.includes(level)) {
         setLevelFilters(levelFilters.filter(l => l !== level));
      } else {
         setLevelFilters([...levelFilters, level]);
      }
   };

   // Apply filters
   const filteredCourses = courses.filter(course => {
      // Search term filter
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         course.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilters.length === 0 || categoryFilters.includes(course.category);

      // Price filter
      const matchesPrice = course.price >= priceRange.min && course.price <= priceRange.max;

      // Rating filter
      const matchesRating = course.rating >= ratingFilter;

      // Level filter
      const matchesLevel = levelFilters.length === 0 || levelFilters.includes(course.level);

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesLevel;
   });

   // Sort courses
   const sortedCourses = [...filteredCourses].sort((a, b) => {
      switch (sortOption) {
         case 'price-low':
            return a.price - b.price;
         case 'price-high':
            return b.price - a.price;
         case 'rating':
            return b.rating - a.rating;
         default: // popular
            return b.students - a.students;
      }
   });

   // Clear all filters
   const clearFilters = () => {
      setSearchTerm('');
      setCategoryFilters([]);
      setPriceRange({ min: 0, max: 500 });
      setRatingFilter(0);
      setLevelFilters([]);
      setSortOption('popular');
   };

   return (
      <section className="text-gray-600 body-font bg-gray-50 min-h-screen">
         <div className="relative flex">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden md:block w-64 bg-white shadow-md p-6 h-screen sticky top-0 overflow-y-auto">
               <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                     <button
                        onClick={clearFilters}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                     >
                        Clear All
                     </button>
                  </div>

                  {/* Sort */}
                  <div className="mb-6">
                     <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
                     <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                     >
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                     </select>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                     <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
                     <div className="space-y-2">
                        {categories.map((category) => (
                           <label key={category} className="flex items-center">
                              <input
                                 type="checkbox"
                                 checked={categoryFilters.includes(category)}
                                 onChange={() => toggleCategoryFilter(category)}
                                 className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-gray-700">{category}</span>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                     <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Rs.{priceRange.min}</span>
                        <span className="text-gray-600 text-sm">Rs.{priceRange.max}</span>
                     </div>
                     <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                        className="w-full"
                     />
                  </div>

                  {/* Rating */}
                  <div className="mb-6">
                     <h3 className="font-semibold text-gray-700 mb-3">Rating</h3>
                     <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                           <label key={rating} className="flex items-center">
                              <input
                                 type="radio"
                                 name="rating"
                                 checked={ratingFilter === rating}
                                 onChange={() => setRatingFilter(rating)}
                                 className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                              />
                              <div className="ml-2 flex items-center">
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       size={16}
                                       className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                    />
                                 ))}
                                 <span className="ml-1 text-gray-700">{rating}+ stars</span>
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Level */}
                  <div className="mb-6">
                     <h3 className="font-semibold text-gray-700 mb-3">Level</h3>
                     <div className="space-y-2">
                        {levels.map((level) => (
                           <label key={level} className="flex items-center">
                              <input
                                 type="checkbox"
                                 checked={levelFilters.includes(level)}
                                 onChange={() => toggleLevelFilter(level)}
                                 className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-gray-700">{level}</span>
                           </label>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Mobile Filter Sidebar */}
            {sidebarOpen && (
               <div className="fixed inset-0 z-40 md:hidden">
                  <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
                  <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-800">
                           <X size={24} />
                        </button>
                     </div>

                     {/* Sort */}
                     <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
                        <select
                           value={sortOption}
                           onChange={(e) => setSortOption(e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                        >
                           <option value="popular">Most Popular</option>
                           <option value="rating">Highest Rated</option>
                           <option value="price-low">Price: Low to High</option>
                           <option value="price-high">Price: High to Low</option>
                        </select>
                     </div>

                     {/* Categories */}
                     <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
                        <div className="space-y-2">
                           {categories.map((category) => (
                              <label key={category} className="flex items-center">
                                 <input
                                    type="checkbox"
                                    checked={categoryFilters.includes(category)}
                                    onChange={() => toggleCategoryFilter(category)}
                                    className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                 />
                                 <span className="ml-2 text-gray-700">{category}</span>
                              </label>
                           ))}
                        </div>
                     </div>

                     {/* Price Range */}
                     <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-gray-600 text-sm">Rs.{priceRange.min}</span>
                           <span className="text-gray-600 text-sm">Rs.{priceRange.max}</span>
                        </div>
                        <input
                           type="range"
                           min="0"
                           max="500"
                           value={priceRange.max}
                           onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                           className="w-full"
                        />
                     </div>

                     {/* Rating */}
                     <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Rating</h3>
                        <div className="space-y-2">
                           {[4, 3, 2, 1].map((rating) => (
                              <label key={rating} className="flex items-center">
                                 <input
                                    type="radio"
                                    name="rating"
                                    checked={ratingFilter === rating}
                                    onChange={() => setRatingFilter(rating)}
                                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                 />
                                 <div className="ml-2 flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                       <Star
                                          key={i}
                                          size={16}
                                          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                       />
                                    ))}
                                    <span className="ml-1 text-gray-700">{rating}+ stars</span>
                                 </div>
                              </label>
                           ))}
                        </div>
                     </div>

                     {/* Level */}
                     <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Level</h3>
                        <div className="space-y-2">
                           {levels.map((level) => (
                              <label key={level} className="flex items-center">
                                 <input
                                    type="checkbox"
                                    checked={levelFilters.includes(level)}
                                    onChange={() => toggleLevelFilter(level)}
                                    className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                 />
                                 <span className="ml-2 text-gray-700">{level}</span>
                              </label>
                           ))}
                        </div>
                     </div>

                     <div className="pt-4 border-t border-gray-200">
                        <button
                           onClick={clearFilters}
                           className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors mb-3"
                        >
                           Clear All Filters
                        </button>
                        <button
                           onClick={() => setSidebarOpen(false)}
                           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                           Apply Filters
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-4 mt-2">
               <div className="container mx-auto">
                  <div className="text-center mb-8">
                     <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
                     <p className="text-xl text-gray-600 mx-auto leading-relaxed max-w-2xl">
                        Discover high-quality courses designed to help you master new skills and advance your career.
                     </p>
                  </div>

                  {/* Search Bar and Filter Button (Mobile) */}
                  <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
                     <div className="relative flex-grow">
                        <input
                           type="text"
                           placeholder="Search courses..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                        />
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                     </div>
                     <button
                        className="md:hidden flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                     >
                        <Sliders size={18} className="mr-2" />
                        Filters
                     </button>
                  </div>

                  {/* Results Summary */}
                  <div className="flex justify-between items-center mb-6">
                     <p className="text-gray-600">
                        Showing {sortedCourses.length} of {courses.length} courses
                     </p>
                     <div className="hidden md:flex items-center">
                        <span className="mr-2 text-gray-700">Sort by:</span>
                        <select
                           value={sortOption}
                           onChange={(e) => setSortOption(e.target.value)}
                           className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                        >
                           <option value="popular">Most Popular</option>
                           <option value="rating">Highest Rated</option>
                           <option value="price-low">Price: Low to High</option>
                           <option value="price-high">Price: High to Low</option>
                        </select>
                     </div>
                  </div>

                  {/* Filter Tags */}
                  {(categoryFilters.length > 0 || levelFilters.length > 0 || ratingFilter > 0 || priceRange.max < 500) && (
                     <div className="flex flex-wrap gap-2 mb-6">
                        {categoryFilters.map(category => (
                           <div key={category} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                              {category}
                              <button
                                 onClick={() => toggleCategoryFilter(category)}
                                 className="ml-2 text-indigo-600 hover:text-indigo-800"
                              >
                                 <X size={14} />
                              </button>
                           </div>
                        ))}
                        {levelFilters.map(level => (
                           <div key={level} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              {level}
                              <button
                                 onClick={() => toggleLevelFilter(level)}
                                 className="ml-2 text-green-600 hover:text-green-800"
                              >
                                 <X size={14} />
                              </button>
                           </div>
                        ))}
                        {ratingFilter > 0 && (
                           <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                              {ratingFilter}+ Stars
                              <button
                                 onClick={() => setRatingFilter(0)}
                                 className="ml-2 text-yellow-600 hover:text-yellow-800"
                              >
                                 <X size={14} />
                              </button>
                           </div>
                        )}
                        {priceRange.max < 500 && (
                           <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              Under Rs.{priceRange.max}
                              <button
                                 onClick={() => setPriceRange({ ...priceRange, max: 500 })}
                                 className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                 <X size={14} />
                              </button>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Loading State */}
                  {isLoading ? (
                     <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
                     </div>
                  ) : (
                     <>
                        {/* Course Cards */}
                        {sortedCourses.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {sortedCourses.map((course) => (
                                 <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                                    {/* Course Header */}
                                    <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                                       <div className="absolute top-4 right-4 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800">
                                          {course.category}
                                       </div>
                                       <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded">
                                          {course.level}
                                       </div>
                                    </div>

                                    <div className="p-6">
                                       <h2 className="text-xl text-gray-900 font-bold title-font mb-2">
                                          {course.title}
                                       </h2>

                                       <div className="flex items-center mb-3">
                                          <div className="flex text-yellow-400">
                                             {[...Array(5)].map((_, i) => (
                                                <Star
                                                   key={i}
                                                   size={16}
                                                   className={i < Math.floor(course.rating) ? "fill-yellow-400" : "text-gray-300"}
                                                />
                                             ))}
                                          </div>
                                          <span className="text-gray-500 text-sm ml-1">({course.reviews} reviews)</span>
                                       </div>

                                       <p className="leading-relaxed text-base mb-4 text-gray-600 line-clamp-3">
                                          {course.description}
                                       </p>

                                       <div className="flex items-center text-gray-500 text-sm mb-4">
                                          <div className="flex items-center mr-4">
                                             <Clock size={14} className="mr-1" />
                                             {course.hours} hours
                                          </div>
                                          <div className="flex items-center mr-4">
                                             <Book size={14} className="mr-1" />
                                             {course.lessons} lessons
                                          </div>
                                          <div className="flex items-center">
                                             <Users size={14} className="mr-1" />
                                             {course.students.toLocaleString()}
                                          </div>
                                       </div>

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
                              ))}
                           </div>
                        ) : (
                           <div className="w-full text-center py-12">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-xl text-gray-500">No courses found matching your criteria.</p>
                              <button
                                 onClick={clearFilters}
                                 className="mt-4 text-indigo-600 hover:text-indigo-800"
                              >
                                 Clear filters
                              </button>
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
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
                           ) : isInCart(selectedCourse.id) ? (
                              <button
                                 className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-default"
                                 disabled
                              >
                                 Added to Cart
                              </button>
                           ) : (
                              <button
                                 className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                 onClick={() => addToCart(selectedCourse)}
                              >
                                 Add to Cart
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </section>
   );
}
