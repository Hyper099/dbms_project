import React from 'react';

export default function Testimonials() {
   const testimonials = [
      {
         id: 1,
         name: "Alice Johnson",
         role: "Student",
         feedback: "This platform transformed my learning experience. The courses are well-structured and easy to follow!",
         image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
         id: 2,
         name: "Mark Robinson",
         role: "Instructor",
         feedback: "Teaching on this platform has been amazing. The interface is smooth, and the students are very engaged!",
         image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
         id: 3,
         name: "Sophie Turner",
         role: "Student",
         feedback: "I loved the interactive content. The instructors are incredibly supportive and helpful.",
         image: "https://randomuser.me/api/portraits/women/68.jpg"
      }
   ];

   return (
      <section className="text-gray-700 body-font bg-gray-100">
         <div className="container px-5 py-24 mx-auto">
            <h2 className="text-3xl font-bold text-center text-indigo-500 mb-12">What Our Users Say</h2>
            <div className="flex flex-wrap -m-4">
               {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="lg:w-1/3 md:w-1/2 p-4 w-full">
                     <div className="h-full bg-white border border-gray-200 p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                           <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                           />
                           <div>
                              <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                              <p className="text-sm text-indigo-500">{testimonial.role}</p>
                           </div>
                        </div>
                        <p className="leading-relaxed">{testimonial.feedback}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
