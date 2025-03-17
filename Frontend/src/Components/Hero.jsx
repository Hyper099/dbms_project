import React from 'react';

export default function Hero() {
   return (
      <section className="text-gray-700 body-font">
         <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
               <h1 className="title-font sm:text-5xl text-4xl mb-4 font-bold text-indigo-500">
                  Empower Your Learning Journey
               </h1>
               <p className="mb-8 leading-relaxed text-gray-600">
                  Join our platform to gain access to quality courses from experienced instructors. Whether you're learning or teaching, we've got you covered.
               </p>
               <div className="flex justify-center gap-4">
                  <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                     Sign Up as Student
                  </button>
                  <button className="text-indigo-500 bg-white border border-indigo-500 py-2 px-6 focus:outline-none hover:bg-indigo-500 hover:text-white rounded text-lg">
                     Sign Up as Instructor
                  </button>
               </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
               <img
                  className="object-cover object-center rounded"
                  alt="hero"
                  src="https://source.unsplash.com/720x600/?education,learning"
               />
            </div>
         </div>
      </section>
   );
}
