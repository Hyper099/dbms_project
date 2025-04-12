import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const InstructorProfile = ({ user }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      expertise: user.expertise || [],
      qualification: user.qualification || '',
      experience: user.experience || ''
   });
   const [successMessage, setSuccessMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [courses, setCourses] = useState([]);
   const [stats, setStats] = useState({
      totalStudents: 0,
      totalCourses: 0,
      totalRevenue: 0
   });
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchInstructorData = async () => {
         try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch courses created by instructor
            const coursesResponse = await API.get('/instructor/courses', {
               headers: { token }
            });

            // Fetch instructor stats
            const statsResponse = await API.get('/instructor/stats', {
               headers: { token }
            });

            setCourses(coursesResponse.data || []);
            setStats(statsResponse.data || {
               totalStudents: 0,
               totalCourses: 0,
               totalRevenue: 0
            });
         } catch (err) {
            console.error('Error fetching instructor data:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchInstructorData();
   }, []);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleExpertiseChange = (e) => {
      const value = e.target.value;
      let expertiseArray = value.split(',').map(item => item.trim());
      setFormData({ ...formData, expertise: expertiseArray });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setSuccessMessage('');
      setErrorMessage('');

      try {
         const token = localStorage.getItem('token');
         await API.put('/instructor/update-profile', formData, {
            headers: { token }
         });

         setSuccessMessage('Profile updated successfully!');
         setIsEditing(false);
         setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
         setErrorMessage(err.response?.data?.error || 'Failed to update profile');
         console.error('Error updating profile:', err);
         setTimeout(() => setErrorMessage(''), 3000);
      }
   };

   return (
      <div className="max-w-4xl mx-auto">
         {/* Success and Error Messages */}
         {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
               {successMessage}
            </div>
         )}

         {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
               {errorMessage}
            </div>
         )}

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
               <div className="text-indigo-600 text-4xl font-bold mb-2">{stats.totalCourses}</div>
               <div className="text-gray-600">Total Courses</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
               <div className="text-indigo-600 text-4xl font-bold mb-2">{stats.totalStudents}</div>
               <div className="text-gray-600">Total Students</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
               <div className="text-indigo-600 text-4xl font-bold mb-2">${stats.totalRevenue}</div>
               <div className="text-gray-600">Total Revenue</div>
            </div>
         </div>

         {/* Profile Header */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-indigo-600 px-6 py-4">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Instructor Profile</h2>
                  <button
                     onClick={() => setIsEditing(!isEditing)}
                     className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50"
                  >
                     {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
               </div>
            </div>

            <div className="p-6">
               {isEditing ? (
                  <form onSubmit={handleSubmit}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                           <label className="block text-gray-700 font-medium mb-2">First Name</label>
                           <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                           <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-gray-700 font-medium mb-2">Email</label>
                           <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                              disabled
                           />
                        </div>

                        <div>
                           <label className="block text-gray-700 font-medium mb-2">Phone</label>
                           <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Bio</label>
                        <textarea
                           name="bio"
                           value={formData.bio}
                           onChange={handleChange}
                           rows="4"
                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                     </div>

                     <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Expertise (comma separated)</label>
                        <input
                           type="text"
                           name="expertise"
                           value={formData.expertise.join(', ')}
                           onChange={handleExpertiseChange}
                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                     </div>

                     <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Qualifications</label>
                        <input
                           type="text"
                           name="qualification"
                           value={formData.qualification}
                           onChange={handleChange}
                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                     </div>

                     <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Experience</label>
                        <textarea
                           name="experience"
                           value={formData.experience}
                           onChange={handleChange}
                           rows="3"
                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                     </div>

                     <div className="flex justify-end">
                        <button
                           type="submit"
                           className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                           Save Changes
                        </button>
                     </div>
                  </form>
               ) : (
                  <div>
                     <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                           <div className="flex justify-center">
                              <div className="w-40 h-40 bg-indigo-100 rounded-full flex items-center justify-center">
                                 <span className="text-5xl text-indigo-600 font-bold">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                 </span>
                              </div>
                           </div>

                           <div className="mt-4 text-center">
                              <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                              <p className="text-gray-500">{user.email}</p>
                              {user.phone && <p className="text-gray-500">{user.phone}</p>}
                           </div>
                        </div>

                        <div className="w-full md:w-2/3 md:pl-8">
                           <div className="mb-6">
                              <h4 className="text-lg font-semibold mb-2 border-b pb-2">Bio</h4>
                              <p className="text-gray-700">{user.bio || "No bio added yet."}</p>
                           </div>

                           <div className="mb-6">
                              <h4 className="text-lg font-semibold mb-2 border-b pb-2">Expertise</h4>
                              {user.expertise && user.expertise.length > 0 ? (
                                 <div className="flex flex-wrap gap-2">
                                    {user.expertise.map((skill, index) => (
                                       <span
                                          key={index}
                                          className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                                       >
                                          {skill}
                                       </span>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="text-gray-700">No expertise added yet.</p>
                              )}
                           </div>

                           <div className="mb-6">
                              <h4 className="text-lg font-semibold mb-2 border-b pb-2">Qualifications</h4>
                              <p className="text-gray-700">{user.qualification || "No qualifications added yet."}</p>
                           </div>

                           <div className="mb-6">
                              <h4 className="text-lg font-semibold mb-2 border-b pb-2">Experience</h4>
                              <p className="text-gray-700">{user.experience || "No experience details added yet."}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* My Courses Section */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
               <h2 className="text-2xl font-bold text-white">My Courses</h2>
               <a
                  href="/instructor/create-course"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50"
               >
                  Create New Course
               </a>
            </div>

            <div className="p-6">
               {loading ? (
                  <div className="flex justify-center py-4">
                     <div className="w-8 h-8 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
               ) : courses && courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {courses.map((course) => (
                        <div key={course.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                           {course.thumbnail && (
                              <img
                                 src={course.thumbnail}
                                 alt={course.title}
                                 className="w-full h-40 object-cover"
                              />
                           )}
                           <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                 <h3 className="font-semibold text-lg">{course.title}</h3>
                                 <span className={`text-xs px-2 py-1 rounded ${course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {course.status || 'Draft'}
                                 </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                 {course.category}
                              </div>
                              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                 {course.description}
                              </p>
                              <div className="flex justify-between items-center">
                                 <span className="text-indigo-600 font-semibold">${course.price}</span>
                                 <a
                                    href={`/instructor/course/${course.id}`}
                                    className="text-indigo-500 text-sm hover:underline"
                                 >
                                    View Details
                                 </a>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="text-gray-700">You haven't created any courses yet.</p>
               )}
            </div>
         </div>
      </div>
   );
};

export default InstructorProfile;
