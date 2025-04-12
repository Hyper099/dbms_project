import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import InstructorProfile from './InstructorProfile';
import StudentProfile from './StudentProfile';

const ProfilePage = () => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchUserProfile = async () => {
         const token = localStorage.getItem('token');
         const role = localStorage.getItem('role');

         if (!token || !role) {
            navigate('/login');
            return;
         }

         try {
            setLoading(true);
            const response = await API.get(`/${role}/details`, {
               headers: { token }
            });
            setUser(response.data);
         } catch (err) {
            setError('Failed to load profile. Please try again later.');
            console.error('Error fetching user details:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchUserProfile();
   }, [navigate]);

   if (loading) {
      return (
         <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="text-xl font-semibold text-gray-700">Loading profile...</div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
               {error}
            </div>
            <button
               onClick={() => window.location.reload()}
               className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
               Try Again
            </button>
         </div>
      );
   }

   if (!user) return null;

   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

         {localStorage.getItem('role') === 'student' ? (
            <StudentProfile user={user} />
         ) : (
            <InstructorProfile user={user} />
         )}
      </div>
   );
};

export default ProfilePage;