import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CTA() {
   const navigate = useNavigate();

   return (
      <section className="bg-indigo-500 text-white text-center py-20">
         <div className="container mx-auto px-5">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey with Us!</h2>
            <p className="mb-8 text-lg">
               Whether you're eager to learn or passionate about teaching, our platform is the perfect place to grow.
            </p>
            <div className="flex justify-center space-x-4">
               <button
                  className="bg-white text-indigo-500 px-6 py-3 rounded-md font-medium hover:bg-indigo-100"
                  onClick={() => navigate('/register/student')}
               >
                  Register as Student
               </button>
               <button
                  className="bg-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-indigo-600"
                  onClick={() => navigate('/register/instructor')}
               >
                  Register as Instructor
               </button>
            </div>
         </div>
      </section>
   );
}
