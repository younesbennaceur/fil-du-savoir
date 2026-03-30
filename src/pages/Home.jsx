import React from 'react';

// Import de la Navigation et du Hero
import Navigation from '../components/nav/Navigation';
import AboutMissionSection from '../components/sections/AboutUs';
import ActivitiesSection from '../components/sections/Projects';
import TreasureMapEvents from '../components/sections/Events';
import Footer from '../components/sections/Footer';
import GallerySection from '../components/sections/Photos';
import TeamSection from '../components/sections/TeamSection';
import PolesSection from '../components/sections/PoleSection';

import Hero from '../components/hero/Hero';
export default function Home() {
  return (
    <div className="">
     
      <Navigation />
      <main>
        <Hero />
        <AboutMissionSection />
        <PolesSection />
        <ActivitiesSection />
        <TreasureMapEvents />
        <GallerySection />
        <TeamSection />
        
        
      
      </main>
      <Footer />

      
    </div>
  );
}