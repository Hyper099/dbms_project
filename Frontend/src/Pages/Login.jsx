import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      if (!formData.email || !formData.password) {
         setError("All fields are required");
         return;
      }

      try {
         const response = await API.post("/auth/login", formData);

         // Extract role and token
         const { token, role } = response.data;

         // Store token & role in localStorage
         localStorage.setItem("token", token);
         localStorage.setItem("role", role);

         // Redirect user based on role
         if (role === "student") {
            navigate("/dashboard/student");
         } else if (role === "instructor") {
            navigate("/dashboard/instructor");
         }
      } catch (error) {
         setError(error.response?.data?.message || "Invalid email or password");
      }
   };

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Access your account</p>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
               <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
               />
               <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
               />
               <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
               >
                  Login
               </button>
            </form>

            <p className="text-sm text-gray-600 text-center mt-4">
               Don't have an account?{" "}
               <a href="/register/student" className="text-blue-500 hover:underline">Register as Student</a> {" | "}
               <a href="/register/instructor" className="text-green-500 hover:underline">Register as Instructor</a>
            </p>
         </div>
      </div>
   );
}
