import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Facilities from './components/Facilities';
import Gallery from './components/Gallery';
import Packages from './components/Packages';
import Testimonials from './components/Testimonials'; // Naya section
import Contact from './components/Contact';
import Footer from './components/Footer'; // Naya footer

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Facilities />
      <Gallery />
      <Packages />
      <Testimonials /> {/* Packages ke neechay reviews */}
      <Contact />
      <Footer /> {/* Sab se aakhir mein footer */}
    </div>
  );
}

export default App;