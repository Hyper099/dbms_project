import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function StudentDashboard() {
   const [enrolledCourses, setEnrolledCourses] = useState([]);
   const [stats, setStats] = useState({
      completedCourses: 0,
      inProgressCourses: 0,
      totalHoursLearned: 0,
      certificatesEarned: 0,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   useEffect(() => {
      const fetchData = async () => {
         try {
            const token = localStorage.getItem("token");

            const [enrolledResponse, statsResponse] =
               await Promise.all([
                  API.get("/student/course/enrolled", {
                     headers: { token },
                  }),
                  API.get("/student/stats", {
                     headers: { token },
                  }),
               ]);
            console.log(enrolledResponse.data);
            setEnrolledCourses(enrolledResponse.data);
            setStats(statsResponse.data);
         } catch (err) {
            setError("Failed to load dashboard data", err);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const calculateProgress = (completedLessons, totalLessons) =>
      totalLessons > 0
         ? Math.round((completedLessons / totalLessons) * 100)
         : 0;

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   // Stats Data (for mapping)
   const statsData = [
      { label: "Completed Courses", value: stats.completedCourses, color: "text-green-600" },
      { label: "In Progress", value: stats.inProgressCourses, color: "text-blue-600" },
      { label: "Certificates", value: stats.certificatesEarned, color: "text-yellow-600" },
   ];

   // Error Message UI
   const errorMessage = error && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
         {error}
      </div>
   );

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>

            {errorMessage}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               {statsData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {stat.label}
                     </h3>
                     <p className={`text-3xl font-bold ${stat.color}`}>
                        {stat.value}
                     </p>
                  </div>
               ))}
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Your Enrolled Courses</h2>
               {enrolledCourses.length === 0 ? (
                  <p className="text-gray-600">You are not enrolled in any courses yet.</p>
               ) : (
                  <ul className="divide-y divide-gray-200">
                     {enrolledCourses.map((course, index) => (
                        <li key={index} className="py-4">
                           <h3 className="text-lg font-semibold text-gray-700">{course.title}</h3>
                           <p className="text-sm text-gray-500">{course.instructor}</p>
                           <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div
                                 className="bg-blue-600 h-2.5 rounded-full"
                                 style={{ width: `${calculateProgress(course.completed_lessons, course.total_lessons)}%` }}
                              ></div>
                           </div>
                           <p className="text-xs text-gray-500 mt-1">
                              {calculateProgress(course.completed_lessons, course.total_lessons)}% completed
                           </p>
                        </li>
                     ))}
                  </ul>
               )}
            </div>

            {/* Footer */}
            <footer className="text-center py-4 text-gray-500 text-sm">
               © 2025 Your E-Learning Platform. All rights reserved.
            </footer>
         </div>
      </div>
   );
}
