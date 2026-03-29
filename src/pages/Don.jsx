import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Heart, Copy, Check, CreditCard, Landmark } from 'lucide-react';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/sections/Footer';

export default function DonationPage() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [copied, setCopied] = useState(false);

  // Fonction pour copier l'IBAN
  const copyToClipboard = () => {
    navigator.clipboard.writeText("FR76 1234 5678 9012 3456 7890 123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Animation d'apparition GSAP
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      }
    );

    // Animation de l'orbe d'arrière-plan
    gsap.to('.donation-orb', {
      y: -20,
      x: 20,
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] py-24 px-4 md:px-8 font-sans overflow-hidden flex items-center justify-center">
      
        <Navigation />
      {/* ── ARRIÈRE-PLAN ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(#1565C0 1px, transparent 1px)', 
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }} 
      />
      <div className="donation-orb absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#E3F2FD] rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply" />
      <div className="donation-orb absolute bottom-[10%] left-[-5%] w-[30vw] h-[30vw] bg-[#E0F7FA] rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply" />

      <div className= " mt-20 max-w-6xl mx-auto w-full relative z-10">
        
        {/* ── EN-TÊTE ── */}
        <div ref={(el) => (cardsRef.current[0] = el)} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white text-[#00ACC1] text-xs font-bold tracking-widest uppercase mb-4 border border-[#E0F7FA] shadow-sm">
            <Heart size={14} className="fill-[#00ACC1]" /> Soutenir l'association
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0D47A1] mb-4">
            Faites un geste, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#00ACC1]">
              changez un avenir.
            </span>
          </h1>
          <p className="text-[#1565C0]/70 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Vos dons permettent à Fil du Savoir de financer du matériel scolaire, d'organiser des ateliers éducatifs et de maintenir nos actions solidaires.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── COLONNE GAUCHE : L'IMPACT (4 colonnes sur 12) ── */}
          <div ref={(el) => (cardsRef.current[1] = el)} className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-gradient-to-br from-[#0D47A1] to-[#1565C0] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-white/20">
                🌱
              </div>
              <h3 className="text-2xl font-bold mb-3">À quoi sert votre don ?</h3>
              <ul className="space-y-3 text-white/90 font-medium text-sm">
                <li className="flex items-start gap-2">
                  <Check size={18} className="text-[#00ACC1] shrink-0 mt-0.5" />
                  Achat de fournitures pour le soutien scolaire.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="text-[#00ACC1] shrink-0 mt-0.5" />
                  Financement des repas pour les actions solidaires.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="text-[#00ACC1] shrink-0 mt-0.5" />
                  Organisation de sorties et d'ateliers culturels.
                </li>
              </ul>
            </div>

            {/* Note Reçu Fiscal */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#BBDEFB] shadow-sm flex items-start gap-4">
              <div className="p-3 bg-[#F4F9FF] rounded-xl text-[#00ACC1]">
                🧾
              </div>
              <div>
                <h4 className="font-bold text-[#0D47A1] mb-1">Déduction Fiscale</h4>
                <p className="text-sm text-[#1565C0]/70 font-medium">
                  En tant qu'association Loi 1901, votre don est déductible de vos impôts à hauteur de 66%. Un reçu fiscal vous sera envoyé.
                </p>
              </div>
            </div>

          </div>

          {/* ── COLONNE DROITE : MOYENS DE PAIEMENT (8 colonnes sur 12) ── */}
          <div ref={(el) => (cardsRef.current[2] = el)} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARTE PAYPAL */}
            <div className="bg-white rounded-3xl p-8 border border-[#E3F2FD] shadow-[0_15px_40px_-15px_rgba(21,101,192,0.1)] flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#F4F9FF] rounded-2xl flex items-center justify-center text-[#1565C0] mb-6 shadow-sm border border-[#E3F2FD]">
                <CreditCard size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-[#0D47A1] mb-2">Don en ligne</h3>
              <p className="text-[#1565C0]/70 text-sm font-medium mb-8 flex-1">
                Rapide et 100% sécurisé. Utilisez votre carte bancaire ou votre compte PayPal pour faire un don immédiat.
              </p>
              <a 
                href="https://paypal.me/votrelienasso" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#FFC439] hover:bg-[#FFB300] text-[#003087] px-6 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
              >
                {/* Logo PayPal simplifié en SVG */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                </svg>
                Faire un don PayPal
              </a>
            </div>

            {/* CARTE VIREMENT BANCAIRE */}
            <div className="bg-white rounded-3xl p-8 border border-[#E3F2FD] shadow-[0_15px_40px_-15px_rgba(21,101,192,0.1)] flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#E0F7FA] rounded-2xl flex items-center justify-center text-[#00ACC1] mb-6 shadow-sm border border-[#B2EBF2]">
                <Landmark size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-[#0D47A1] mb-2">Virement Bancaire</h3>
              <p className="text-[#1565C0]/70 text-sm font-medium mb-6 flex-1">
                Programmez un virement ponctuel ou mensuel directement depuis votre application bancaire vers notre compte.
              </p>
              
              {/* Encadré IBAN avec bouton Copier */}
              <div className="bg-[#F8FAFC] border border-[#E3F2FD] rounded-xl p-4 relative group">
                <span className="block text-xs font-bold text-[#1565C0]/50 uppercase tracking-wider mb-1">IBAN de l'Association</span>
                <span className="block font-mono font-bold text-[#0D47A1] text-sm break-all">
                  FR76 1234 5678 9012 3456 7890 123
                </span>
                
                {/* Bouton de copie interactif */}
                <button 
                  onClick={copyToClipboard}
                  className={`absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg transition-all ${copied ? 'bg-[#00ACC1] text-white' : 'bg-white text-[#1565C0] border border-[#E3F2FD] hover:bg-[#E3F2FD] shadow-sm'}`}
                  title="Copier l'IBAN"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Message de confirmation de copie */}
              <p className={`text-xs font-bold text-[#00ACC1] mt-2 transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                IBAN copié dans le presse-papier !
              </p>

            </div>

          </div>
        </div>

      </div>
      
    </section>
    
  );
}