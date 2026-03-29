import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Routes, Route } from 'react-router-dom'; // On a retiré BrowserRouter d'ici

// Import de vos pages
import Home from './pages/Home';
import InscriptionPage from './pages/Inscription';
import DonationPage from './pages/Don';
import Navigation from './components/nav/Navigation';
import Footer from './components/sections/Footer';



export default function App() {
  return (
    <div className="min-h-screen  ">
      
      <Navigation />
      {/* On utilise directement Routes ici ! */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/don" element={<DonationPage />} />

      </Routes>
      <Footer />
    </div>
  );
}