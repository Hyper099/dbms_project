import React, { useState } from 'react';
import API from '../utils/api';

const StudentProfile = ({ user }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      interests: user.interests || []
   });
   const [successMessage, setSuccessMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [coursesEnrolled, setCoursesEnrolled] = useState(user.coursesEnrolled || []);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleInterestChange = (e) => {
      const value = e.target.value;
      let interestsArray = value.split(',').map(item => item.trim());
      setFormData({ ...formData, interests: interestsArray });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setSuccessMessage('');
      setErrorMessage('');

      try {
         const token = localStorage.getItem('token');
         await API.put('/student/update-profile', formData, {
            headers: { token }
         });

         setSuccessMessage('Profile updated successfully!');
         setIsEditing(false);
         // Clear success message after 3 seconds
         setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
         setErrorMessage(err.response?.data?.error || 'Failed to update profile');
         console.error('Error updating profile:', err);
         // Clear error message after 3 seconds
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

         {/* Profile Header */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-indigo-600 px-6 py-4">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Student Profile</h2>
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
                        <label className="block text-gray-700 font-medium mb-2">Interests (comma separated)</label>
                        <input
                           type="text"
                           name="interests"
                           value={formData.interests.join(', ')}
                           onChange={handleInterestChange}
                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
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
                              <h4 className="text-lg font-semibold mb-2 border-b pb-2">Interests</h4>
                              {user.interests && user.interests.length > 0 ? (
                                 <div className="flex flex-wrap gap-2">
                                    {user.interests.map((interest, index) => (
                                       <span
                                          key={index}
                                          className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                                       >
                                          {interest}
                                       </span>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="text-gray-700">No interests added yet.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Enrolled Courses Section */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-indigo-600 px-6 py-4">
               <h2 className="text-2xl font-bold text-white">Enrolled Courses</h2>
            </div>

            <div className="p-6">
               {coursesEnrolled && coursesEnrolled.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {coursesEnrolled.map((course) => (
                        <div key={course.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                           {course.thumbnail && (
                              <img
                                 src={course.thumbnail}
                                 alt={course.title}
                                 className="w-full h-40 object-cover"
                              />
                           )}
                           <div className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                              <div className="flex justify-between items-center">
                                 <div className="text-sm text-gray-500">
                                    {course.progress ? `${course.progress}% Complete` : 'Not started'}
                                 </div>
                                 <a
                                    href={`/course/${course.id}`}
                                    className="text-indigo-600 hover:text-indigo-800"
                                 >
                                    Continue Learning
                                 </a>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8">
                     <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                     <a
                        href="/courses"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                     >
                        Browse Courses
                     </a>
                  </div>
               )}
            </div>
         </div>

         {/* Purchase History Section */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
               <h2 className="text-2xl font-bold text-white">Purchase History</h2>
            </div>

            <div className="p-6">
               {user.purchases && user.purchases.length > 0 ? (
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                           <tr>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Date
                              </th>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Order ID
                              </th>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Courses
                              </th>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Amount
                              </th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {user.purchases.map((purchase) => (
                              <tr key={purchase.id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(purchase.date).toLocaleDateString()}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {purchase.orderId}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-500">
                                    {purchase.courses.join(', ')}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${purchase.amount}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <p className="text-center py-4 text-gray-500">No purchase history available.</p>
               )}
            </div>
         </div>
      </div>
   );
};

export default StudentProfile;