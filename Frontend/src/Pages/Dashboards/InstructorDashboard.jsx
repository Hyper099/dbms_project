import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function InstructorDashboard() {
   const [courses, setCourses] = useState([]);
   // const [stats, setStats] = useState({
   //    totalStudents: 0,
   //    totalCourses: 0,
   //    averageRating: 0,
   // });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [showNewCourseForm, setShowNewCourseForm] = useState(false);
   const [newCourse, setNewCourse] = useState({
      title: "",
      description: "",
      duration: "",
      price: "",
      category: "",
   });

   useEffect(() => {
      const fetchData = async () => {
         const token = localStorage.getItem("token");
         try {
            // Fetch instructor's courses
            const coursesResponse = await API.get("/instructor/course", {
               headers: { token },
            });
            console.log(coursesResponse.data);
            // // Fetch instructor stats
            // const statsResponse = await API.get("/instructor/stats", {
            //    headers: { token },
            // });

            setCourses(coursesResponse.data);
            // setStats(statsResponse.data);
            setLoading(false);
         } catch (err) {
            setError("Failed to load dashboard data");
            console.log(err);
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const handleNewCourseChange = (e) => {
      setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
   };

   const handleCreateCourse = async (e) => {
      e.preventDefault();
      const formattedCourse = {
         ...newCourse,
         price: Number(newCourse.price), // Convert to number
         duration: Number(newCourse.duration) // Convert to number
      };

      console.log("Sending data:", formattedCourse);
      try {
         const token = localStorage.getItem("token");
         await API.post("/course/add", formattedCourse, {
            headers: { token },
         });

         // Refresh courses list
         const response = await API.get("/instructor/course", {
            headers: { token },
         });
         console.log(response.data);
         setCourses(response.data);
         setShowNewCourseForm(false);
         setNewCourse({
            title: "",
            description: "",
            duration: "",
            price: "",
            category: "",
         });
      } catch (err) {
         console.error("Failed to create course:", err.response?.data || err);
         setError("Failed to create course");
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Instructor Dashboard</h1>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

            {/* Stats Overview
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Students</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
               </div>
               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Courses</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
               </div>
               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Rating</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}/5.0</p>
               </div>
            </div> */}

            {/* Course Management */}
            <div className="bg-white rounded-lg shadow mb-8">
               <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
                  <button
                     onClick={() => setShowNewCourseForm(!showNewCourseForm)}
                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                  >
                     {showNewCourseForm ? "Cancel" : "Create New Course"}
                  </button>
               </div>

               {/* New Course Form */}
               {showNewCourseForm && (
                  <div className="p-6 border-b border-gray-200">
                     <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                           <input
                              type="text"
                              name="title"
                              value={newCourse.title}
                              onChange={handleNewCourseChange}
                              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                              required
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                           <textarea
                              name="description"
                              value={newCourse.description}
                              onChange={handleNewCourseChange}
                              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                              rows="3"
                              required
                           ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                              <input
                                 type="number"
                                 name="duration"
                                 value={newCourse.duration}
                                 onChange={handleNewCourseChange}
                                 className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                              <input
                                 type="number"
                                 name="price"
                                 value={newCourse.price}
                                 onChange={handleNewCourseChange}
                                 className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <input
                                 type="text"
                                 name="category"
                                 value={newCourse.category}
                                 onChange={handleNewCourseChange}
                                 className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                 required
                              />
                           </div>
                        </div>
                        <div className="flex justify-end">
                           <button
                              type="submit"
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                           >
                              Create Course
                           </button>
                        </div>
                     </form>
                  </div>
               )}

               {/* Courses List */}
               <div className="p-6">
                  {courses.length === 0 ? (
                     <p className="text-gray-500 text-center py-4">You haven't created any courses yet.</p>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                              {courses.map((course) => (
                                 <tr key={course.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="font-medium text-gray-900">{course.title}</div>
                                       <div className="text-sm text-gray-500">{course.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                       {course.enrolledStudents}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="flex items-center">
                                          <span className="text-yellow-500 mr-1">★</span>
                                          <span>{course.rating ? course.rating.toFixed(1) : "N/A"}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                       Rs. {course.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                       <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                       <button className="text-green-600 hover:text-green-900 mr-3">Content</button>
                                       <button className="text-purple-600 hover:text-purple-900">Students</button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}