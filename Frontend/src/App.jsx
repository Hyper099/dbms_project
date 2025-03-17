import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Navbar from './Common/Navbar';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import Courses from './Pages/Courses/Course';
import InstructorDashboard from './Pages/Dashboards/InstructorDashboard';
import StudentDashboard from './Pages/Dashboards/StudentDashboard';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Login';
import PageNotFound from './Pages/PageNotFound';
import InstructorRegistration from './Pages/SignUp/InstructorRegistration';
import StudentRegistration from './Pages/SignUp/StudentRegistration';

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/register/student', '/register/instructor', '/login'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/student" element={<StudentRegistration />} />
        <Route path="/register/instructor" element={<InstructorRegistration />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
