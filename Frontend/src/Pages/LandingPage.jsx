import React from 'react';
import Footer from '../Common/Footer';
import CTA from '../Components/CTA';
import Hero from '../Components/Hero';
import Testimonials from '../Components/Testimonials';

export default function LandingPage() {
   return (
      <div className="min-h-screen flex flex-col">
         <Hero />
         <Testimonials />
         <CTA />
         <Footer />
      </div>
   );
}
