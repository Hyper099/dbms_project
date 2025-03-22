import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function InstructorDashboard() {
   const [courses, setCourses] = useState([]);
   const [studentData, setStudentData] = useState([]);
   const [showStudentsModal, setShowStudentsModal] = useState(false);
   // const [selectedCourseId, setSelectedCourseId] = useState(null);

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [showNewCourseForm, setShowNewCourseForm] = useState(false);
   const [showEditCourseForm, setShowEditCourseForm] = useState(false);
   const [editingCourseId, setEditingCourseId] = useState(null);
   const [newCourse, setNewCourse] = useState({
      title: "",
      description: "",
      duration: "",
      price: "",
      category: "",
   });
   const [editCourse, setEditCourse] = useState({
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

   const handleEditCourseChange = (e) => {
      setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
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

   const handleEditClick = (course) => {
      setEditingCourseId(course.id);
      setEditCourse({
         title: course.title,
         description: course.description,
         duration: course.duration,
         price: course.price,
         category: course.category,
      });
      setShowEditCourseForm(true);
   };

   const handleDeleteClick = async (course) => {
      const token = localStorage.getItem('token');
      try {
         await API.delete(`/course/delete/${course.id}`, {
            headers: { token }
         });
         //  TODO: update database to delete row with foreign key constriants.
         const updatedCourses = courses.filter((c) => c.id !== course.id);
         setCourses(updatedCourses);
         alert("Course deleted successfully!");
      }
      catch (err) {
         console.error("Failed to delete course:", err.response?.data || err);
         setError("Failed to delete course");
      }

   }

   const handleUpdateCourse = async (e) => {
      e.preventDefault();
      const formattedCourse = {
         ...editCourse,
         price: Number(editCourse.price),
         duration: Number(editCourse.duration)
      };

      console.log("Updating course:", formattedCourse);
      try {
         const token = localStorage.getItem("token");
         await API.put(`/course/update/${editingCourseId}`, formattedCourse, {
            headers: { token },
         });

         // Refresh courses list
         const response = await API.get("/instructor/course", {
            headers: { token },
         });
         setCourses(response.data);
         setShowEditCourseForm(false);
         setEditingCourseId(null);
         setEditCourse({
            title: "",
            description: "",
            duration: "",
            price: "",
            category: "",
         });
      } catch (err) {
         console.error("Failed to update course:", err.response?.data || err);
         setError("Failed to update course");
      }
   };

   const handleCancelEdit = () => {
      setShowEditCourseForm(false);
      setEditingCourseId(null);
      setEditCourse({
         title: "",
         description: "",
         duration: "",
         price: "",
         category: "",
      });
   };


   const handleViewStudents = async (course) => {
      try {
         const token = localStorage.getItem("token");
         console.log("insidde the fucntion");
         const response = await API.get(`/course/enrolled-students/${course.id}`, {
            headers: { token },
         });
         setStudentData(response.data);
         // setSelectedCourseId(course.id);
         setShowStudentsModal(true);
      } catch (err) {
         console.error("Failed to fetch enrolled students:", err.response?.data || err);
         setError("Failed to load student data");
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

               {/* Edit Course Form */}
               {showEditCourseForm && (
                  <div className="p-6 border-b border-gray-200">
                     <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Course</h3>
                     <form onSubmit={handleUpdateCourse} className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                           <input
                              type="text"
                              name="title"
                              value={editCourse.title}
                              onChange={handleEditCourseChange}
                              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                              required
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                           <textarea
                              name="description"
                              value={editCourse.description}
                              onChange={handleEditCourseChange}
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
                                 value={editCourse.duration}
                                 onChange={handleEditCourseChange}
                                 className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                              <input
                                 type="number"
                                 name="price"
                                 value={editCourse.price}
                                 onChange={handleEditCourseChange}
                                 className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <input
                                 type="text"
                                 name="category"
                                 value={editCourse.category}
                                 onChange={handleEditCourseChange}
                                 className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                 required
                              />
                           </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                           <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
                           >
                              Cancel
                           </button>
                           <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                           >
                              Update Course
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
                                    {/* Course area */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="font-medium text-gray-900">{course.title}</div>
                                       <div className="text-sm text-gray-500">{course.category}</div>
                                    </td>
                                    {/* Student area */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="flex items-center">
                                          <span className="text-gray-900 font-medium mr-2 ">{course.enrolledStudents || 0}</span>
                                          <button
                                             onClick={() => handleViewStudents(course)}
                                             className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                                          // disabled={!course.enrolledStudents}
                                          >
                                             View
                                          </button>
                                       </div>
                                       {/* Students Modal */}
                                       {/* Students Modal */}
                                       {showStudentsModal && (
                                          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
                                             <div className="bg-white rounded-xl shadow-2xl p-0 m-4 max-w-4xl w-full animate-fadeIn">
                                                {/* Modal Header */}
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center">
                                                   <h3 className="text-xl font-semibold text-gray-800">Enrolled Students</h3>
                                                   <button
                                                      onClick={() => setShowStudentsModal(false)}
                                                      className="text-gray-500 hover:text-gray-700 bg-white rounded-full h-8 w-8 flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
                                                   >
                                                      ×
                                                   </button>
                                                </div>

                                                {/* Modal Body */}
                                                <div className="p-6">
                                                   {studentData.length === 0 ? (
                                                      <div className="text-gray-500 text-center py-10 bg-gray-50 rounded-lg">
                                                         <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                         </svg>
                                                         <p className="text-lg">No students enrolled in this course.</p>
                                                      </div>
                                                   ) : (
                                                      <div className="overflow-y-auto max-h-[60vh]">
                                                         <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                                                            <thead className="bg-gray-50">
                                                               <tr>
                                                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                                                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Enrollment Date</th>
                                                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Expiry Date</th>
                                                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                                                               </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                               {studentData.map((student, index) => (
                                                                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                                                                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                                           </div>
                                                                           <div className="ml-4">
                                                                              <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                                                                           </div>
                                                                        </div>
                                                                     </td>
                                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {new Date(student.enrollment_date).toLocaleDateString('en-US', {
                                                                           year: 'numeric',
                                                                           month: 'short',
                                                                           day: 'numeric'
                                                                        })}
                                                                     </td>
                                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {new Date(student.expiry_date).toLocaleDateString('en-US', {
                                                                           year: 'numeric',
                                                                           month: 'short',
                                                                           day: 'numeric'
                                                                        })}
                                                                     </td>
                                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                           student.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                                              'bg-yellow-100 text-yellow-800'
                                                                           }`}>
                                                                           {student.status === 'active' && (
                                                                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                                                                           )}
                                                                           {student.status === 'expired' && (
                                                                              <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                                                                           )}
                                                                           {student.status !== 'active' && student.status !== 'expired' && (
                                                                              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></span>
                                                                           )}
                                                                           {student.status}
                                                                        </span>
                                                                     </td>
                                                                  </tr>
                                                               ))}
                                                            </tbody>
                                                         </table>
                                                      </div>
                                                   )}
                                                </div>

                                                {/* Modal Footer */}
                                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
                                                   <div className="flex justify-end">
                                                      <button
                                                         onClick={() => setShowStudentsModal(false)}
                                                         className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                                                      >
                                                         Close
                                                      </button>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       )}


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
                                       <button
                                          onClick={() => handleEditClick(course)}
                                          className="text-blue-600 hover:text-blue-900 mr-3"
                                       >
                                          Edit
                                       </button>
                                       <button
                                          onClick={() => handleDeleteClick(course)}
                                          className="text-red-500 hover:text-blue-900 mr-3"
                                       >
                                          Delete
                                       </button>

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

// const [stats, setStats] = useState({
//    totalStudents: 0,
//    totalCourses: 0,
//    averageRating: 0,
// });

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