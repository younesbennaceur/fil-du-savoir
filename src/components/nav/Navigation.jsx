import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Remplace par "import Link from 'next/link';" si tu es sur Next.js

const Navigation = () => {
  // État pour gérer l'ouverture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Configuration des liens d'ancrage (scroll sur la même page)
  const navLinks = [
    { name: 'Accueil', href: '/#accueil' },
    { name: 'Notre Mission', href: '/#notre-mission' },
    { name: 'Ateliers', href: '/#ateliers' },
    { name: 'Événements', href: '/#evenements' },
      { name: 'Galerie', href: '/#galerie' },
  ];

  const FilDuSavoirLogo = ({ className }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="38" fill="white" stroke="#1565C0" strokeWidth="2.5" />
      <path d="M14 52 Q40 44 40 44 L40 20 Q40 20 14 28 Z" fill="#1565C0" opacity="0.15"/>
      <path d="M66 52 Q40 44 40 44 L40 20 Q40 20 66 28 Z" fill="#1976D2" opacity="0.15"/>
      <path d="M14 28 Q27 23 40 20 Q53 23 66 28" stroke="#1565C0" strokeWidth="1.5" fill="none"/>
      <path d="M14 52 Q27 47 40 44 Q53 47 66 52" stroke="#1565C0" strokeWidth="1.5" fill="none"/>
      <line x1="18" y1="35" x2="36" y2="31" stroke="#42A5F5" strokeWidth="1.5"/>
      <line x1="18" y1="40" x2="36" y2="37" stroke="#42A5F5" strokeWidth="1.5"/>
      <line x1="44" y1="31" x2="62" y2="35" stroke="#42A5F5" strokeWidth="1.5"/>
      <line x1="44" y1="37" x2="62" y2="40" stroke="#42A5F5" strokeWidth="1.5"/>
      <path d="M38 14 C38 14 44 16 44 22 C44 27 40 29 38 28 C36 27 35 25 36 23 C37 21 40 21 41 23 C42 25 40 27 38 26" stroke="#00ACC1" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="38" y1="26" x2="38" y2="33" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="35.5" cy="33.5" rx="2.5" ry="1.5" fill="#00ACC1"/>
    </svg>
  );

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col top-6 w-[95%] max-w-6xl">
      
      {/* ── BARRE DE NAVIGATION PRINCIPALE (Pilule) ── */}
      <div className="flex items-center justify-between w-full bg-white/70 shadow-lg backdrop-blur-xl border border-white/60 rounded-full py-3 px-6 md:px-8 transition-all duration-500">
        
        {/* Zone Logo */}
        <a href="#accueil" className="flex items-center gap-3 cursor-pointer group outline-none">
         <img className='h-16 w-24' src="logo.png" alt="" />
        </a>
        
        {/* Liens Desktop (Scroll sur la même page) */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="relative px-4 py-2 text-[#1565C0] font-semibold text-sm transition-colors group hover:text-[#0D47A1] outline-none"
            >
              <span className="absolute inset-0 bg-[#E3F2FD] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10 origin-center"></span>
              {link.name}
            </a>
          ))}
        </div>

        {/* Boutons d'action Desktop avec <Link> */}
        <div className="hidden lg:flex items-center gap-3"> 
          <Link 
            to="/don" 
            className="flex items-center gap-2 bg-[#0D47A1] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1565C0] hover:shadow-lg hover:shadow-[#1565C0]/30 transition-all transform hover:-translate-y-0.5 active:scale-95 group outline-none"
          >
            <Heart size={16} className="text-[#00ACC1] transition-all duration-300 group-hover:fill-[#00ACC1] group-hover:scale-110" />
            Faire un don
          </Link>
          <Link 
            to="/inscription" 
            className="flex items-center gap-2 bg-transparent border-2 border-[#0D47A1] text-[#0D47A1] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#0D47A1] hover:text-white hover:shadow-lg hover:shadow-[#0D47A1]/30 transition-all transform hover:-translate-y-0.5 active:scale-95 outline-none"
          >
            S'inscrire
          </Link>
        </div>

        {/* Bouton Menu Mobile (Hamburger) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#0D47A1] hover:bg-[#E3F2FD] rounded-full transition-colors outline-none"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── MENU DROPDOWN MOBILE ── */}
      <div className={`
        absolute top-full left-0 w-full mt-3 rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl overflow-hidden
        transition-all duration-300 origin-top lg:hidden
        ${isMobileMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}
      `}>
        <div className="flex flex-col p-6 gap-2">
          {/* Liens Mobile */}
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-[#1565C0] font-bold text-lg p-3 rounded-xl hover:bg-[#E3F2FD] transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <hr className="my-4 border-[#E3F2FD]" />
          
          {/* Boutons d'action Mobile avec <Link> */}
          <div className="flex flex-col gap-3">
            <Link 
              to="/don"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#0D47A1] text-white px-6 py-4 rounded-xl text-base font-bold active:scale-95 transition-transform"
            >
              <Heart size={18} className="text-[#00ACC1] fill-[#00ACC1]" />
              Faire un don
            </Link>
            <Link 
              to="/inscription"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-transparent border-2 border-[#0D47A1] text-[#0D47A1] px-6 py-4 rounded-xl text-base font-bold active:scale-95 transition-transform"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navigation;