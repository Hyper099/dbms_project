import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

export default function InstructorRegister() {
   const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
   });

   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
         setError('All fields are required');
         return;
      }

      try {
         const response = await API.post('/instructor/signup', formData);
         setSuccess(response.data.message);
         setFormData({ email: '', password: '', firstName: '', lastName: '' }); // Reset form
      } catch (error) {
         setError(error.response?.data?.error || 'Error registering instructor');
      }
   };

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800">Instructor Registration</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Sign up and start teaching today!</p>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
               <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
               />
               <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
               />
               <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
               />
               <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
               />
               <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
               >
                  Register
               </button>
            </form>

            <p className="text-sm text-gray-600 text-center mt-4">
               Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
            </p>
            <p className="text-sm text-gray-600 text-center mt-4">
               Want to Register as Student? <Link to="/register/student" className="text-blue-500 hover:underline">Student Register</Link>
            </p>
         </div>
      </div>
   );
}
