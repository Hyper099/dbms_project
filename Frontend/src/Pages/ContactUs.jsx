import React, { useState } from "react";

export default function ContactUs() {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: ""
   });
   const [formStatus, setFormStatus] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
         ...prevState,
         [name]: value
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email || !formData.message) {
         setFormStatus({ type: "error", message: "Please fill out all required fields." });
         return;
      }
      setFormStatus({ type: "loading", message: "Sending your message..." });

      setTimeout(() => {
         setFormStatus({ type: "success", message: "Thank you! Your message has been sent successfully." });
         setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
   };

   return (
      <section className="text-gray-600 body-font bg-gray-50 relative">
         <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
               <h2 className="text-3xl font-bold title-font mb-4 text-gray-900">Contact Us</h2>
               {formStatus && (
                  <div className={`text-${formStatus.type === 'error' ? 'red' : 'green'}-500 mb-4`}>
                     {formStatus.message}
                  </div>
               )}
               <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                  <input
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="Your Name"
                     className="w-full p-2 mb-4 border border-gray-300 rounded"
                     required
                  />
                  <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     placeholder="Your Email"
                     className="w-full p-2 mb-4 border border-gray-300 rounded"
                     required
                  />
                  <textarea
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     placeholder="Your Message"
                     className="w-full p-2 mb-4 border border-gray-300 rounded"
                     required
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                     Submit
                  </button>
               </form>
            </div>
         </div>
      </section>
   );
}
