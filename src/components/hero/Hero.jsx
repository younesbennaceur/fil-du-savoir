import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Link } from 'react-router-dom'; // CORRECTION : Import du vrai composant de routing

gsap.registerPlugin(Draggable);

// ── Icônes & Logos SVG ──
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

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
);

const ZigzagWave = ({ className }) => (
  <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" className={className}>
    <path d="M0 20 L20 10 L40 30 L60 10 L80 30 L100 10 L120 30 L140 10 L160 30 L180 10 L200 20" stroke="#00ACC1" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 30 L20 20 L40 40 L60 20 L80 40 L100 20 L120 40 L140 20 L160 40 L180 20 L200 30" stroke="#42A5F5" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FilDuSavoirPremiumHero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  // ── Cartes d'Activités (Draggables) ──
  const activitiesCards = [
    { 
      icon: "📖", 
      title: "Cours d’arabe", 
      desc: "Lecture, écriture, compréhension et expression orale.", 
      top: "12%", left: "4%", 
      bg: "bg-blue-50/80 text-blue-600 border-blue-100"
    },
    { 
      icon: "✏️", 
      title: "Aide aux devoirs", 
      desc: "Accompagnement primaire, collège et lycée.", 
      top: "62%", left: "2%", 
      bg: "bg-cyan-50/80 text-cyan-600 border-cyan-100"
    },
    { 
      icon: "🎨", 
      title: "Ateliers culturels", 
      desc: "Activités éducatives, ludiques et artistiques.", 
      top: "15%", left: "76%", 
      bg: "bg-indigo-50/80 text-indigo-600 border-indigo-100"
    },
    { 
      icon: "🤝", 
      title: "Actions solidaires", 
      desc: "Organisation de projets d'entraide et de partage.", 
      top: "65%", left: "74%", 
      bg: "bg-sky-50/80 text-sky-600 border-sky-100"
    },
  ];

  useEffect(() => {
    // 1. Initialisation des Draggables premium
    Draggable.create('.fds-drag', {
      bounds: containerRef.current,
      inertia: true,
      onPress: function() { 
        gsap.to(this.target, { 
          scale: 1.05, 
          rotation: "random(-3, 3)",
          zIndex: 60, 
          boxShadow: "0 20px 40px -10px rgba(21, 101, 192, 0.2)",
          duration: 0.3, 
          ease: "power2.out",
          cursor: "grabbing"
        }); 
      },
      onRelease: function() { 
        gsap.to(this.target, { 
          scale: 1, 
          rotation: 0, 
          zIndex: 40, 
          boxShadow: "0 8px 30px rgb(21, 101, 192, 0.08)",
          duration: 0.5, 
          ease: "bounce.out",
          cursor: "grab"
        }); 
      }
    });

    // Lévitation douce
    gsap.to('.fds-drag-inner', { 
      y: "-=10", 
      duration: "random(3, 5)", 
      yoyo: true, 
      repeat: -1, 
      ease: 'sine.inOut', 
      stagger: 0.2 
    });

    // 2. Arrière-plan : Orbes & Lignes SVG
    gsap.to('.orb-1', { y: -60, x: 50, scale: 1.1, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-2', { y: 50, x: -40, scale: 1.2, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
    gsap.to('.bg-thread-1', { y: 30, x: -20, rotation: 2, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.bg-thread-2', { y: -25, x: 20, rotation: -2, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });

    // 3. Apparition au chargement
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(textRef.current.children, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.fds-drag', 
        { opacity: 0, scale: 0.8, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' }, 
        "-=0.6"
      )
      .fromTo('.hero-card', 
        { opacity: 0, y: 60, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out' }, 
        "-=0.5"
      );

  }, []);

  return (
    <section id='accueil' ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] font-sans overflow-hidden flex flex-col pb-20 pt-20">
      
      {/* ========================================= */}
      {/* 🎨 ARRIÈRE-PLAN CRÉATIF 🎨 */}
      {/* ========================================= */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] z-0" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(21, 101, 192, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(21, 101, 192, 0.1) 1px, transparent 1px)`, 
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)'
        }} 
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" preserveAspectRatio="none">
        <path className="bg-thread-1" d="M -100 200 C 400 400, 800 -100, 1500 300 C 2000 500, 2200 100, 2500 200" fill="none" stroke="#42A5F5" strokeWidth="2" strokeOpacity="0.4" />
        <path className="bg-thread-2" d="M -200 600 C 300 400, 700 800, 1400 500 C 1900 300, 2300 600, 2600 400" fill="none" stroke="#00ACC1" strokeWidth="3" strokeOpacity="0.2" />
      </svg>

      <div className="orb-1 absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] bg-[#42A5F5]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="orb-2 absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-[#00ACC1]/15 rounded-full blur-[160px] pointer-events-none z-0" />
      
      {/* ========================================= */}

      {/* ── CARTES D'ACTIVITÉS (Nouveau design épuré) ── */}
      {activitiesCards.map((item, idx) => (
        <div key={idx} className="fds-drag absolute z-40 hidden xl:block group cursor-grab p-2" style={{ top: item.top, left: item.left }}>
          <div className="fds-drag-inner relative w-[270px] bg-white/80 backdrop-blur-xl border border-white/80 p-4 rounded-2xl shadow-[0_8px_30px_rgb(21,101,192,0.08)] transition-all duration-300 group-hover:bg-white group-hover:border-[#42A5F5]/30 group-hover:shadow-[0_15px_40px_rgb(21,101,192,0.15)] flex items-center gap-4">
            
            {/* Icône */}
            <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl shadow-sm shrink-0 border ${item.bg}`}>
              {item.icon}
            </div>

            {/* Texte de l'activité */}
            <div className="flex flex-col text-left">
              <h4 className="text-[#0D47A1] font-bold text-sm leading-tight mb-1">{item.title}</h4>
              <p className="text-[#1565C0]/75 text-[11px] font-medium leading-snug">
                {item.desc}
              </p>
            </div>

          </div>
        </div>
      ))}

      {/* ── CONTENU PRINCIPAL (Hero Text) ── */}
      <div className="relative z-30 flex flex-col items-center text-center mt-36 px-4 flex-1">
        
        <div ref={textRef} className="max-w-4xl mx-auto z-40 relative pointer-events-none flex flex-col items-center">
          
          <div className="relative inline-flex mb-8">
            <span className="relative px-5 py-2 rounded-full bg-white/90 backdrop-blur-md text-[#1565C0] text-xs font-extrabold tracking-widest uppercase border border-[#BBDEFB] shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ACC1] animate-ping" />
              Cohésion Sociale & Diversité
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[4.5rem] font-extrabold text-[#0D47A1] leading-[1.1] tracking-tight mb-8 drop-shadow-sm">
            Tisser le savoir, <br/>
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] via-[#00ACC1] to-[#42A5F5]">
                relier les cultures.
              </span>
              <svg className="absolute w-full h-4 -bottom-1 left-0 -z-10 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" stroke="#C4F970" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-[#1565C0]/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Rejoignez <strong className="text-[#0D47A1]">Fil du Savoir</strong>. Une association dédiée à l'apprentissage, l'entraide et l'épanouissement pour tous à Lieusaint.
          </p>

          <div className="flex flex-wrap justify-center gap-5 items-center pointer-events-auto">
            {/* BOUTON DON (Lien Routeur) */}
            <Link to="/don" className="relative group overflow-hidden bg-[#0D47A1] text-white px-9 py-4 rounded-full font-bold shadow-[0_10px_20px_rgba(13,71,161,0.3)] hover:shadow-[0_15px_30px_rgba(13,71,161,0.4)] hover:-translate-y-1 transition-all duration-300">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1565C0] to-[#00ACC1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Faire un don maintenant <span className="text-[#C4F970] text-lg leading-none">→</span>
              </span>
            </Link>
            
            {/* BOUTON DÉCOUVRIR (Lien Ancre) */}
            <a href="#evenements" className="text-[#0D47A1] flex gap-3 items-center font-bold px-7 py-4 rounded-full bg-white border border-[#E3F2FD] shadow-sm hover:border-[#42A5F5]/50 hover:bg-[#F4F9FF] transition-all group hover:-translate-y-1">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E3F2FD] text-[#00ACC1] group-hover:bg-[#00ACC1] group-hover:text-white transition-colors duration-300 shadow-inner">
                <PlayIcon />
              </span>
              Découvrir nos actions
            </a>
          </div>
        </div>

        {/* ── Section des 3 Cartes Images ── */}
        <div className="mt-20 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-6 px-4 relative z-40 pointer-events-auto">
          
          <div className="hero-card relative w-full lg:w-72 bg-[#0D47A1] rounded-[2.5rem] p-3 flex flex-col shadow-[0_20px_40px_-15px_rgba(13,71,161,0.4)] group overflow-hidden">
            <div className="relative h-56 w-full rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-[#0D47A1]/20 z-10 transition-opacity group-hover:opacity-0" />
              <img src="/team.jpeg" alt="Enfants apprenant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="absolute top-[13.5rem] left-1/2 -translate-x-1/2 w-max z-20">
              <button className="bg-[#C4F970] text-[#0D47A1] px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-white hover:scale-105 transition-all">
                Notre Communauté
              </button>
            </div>
            <div className="mt-auto pb-6 text-center z-10 pt-8">
              <p className="text-white text-2xl font-extrabold leading-tight">1200+ <span className="text-[#42A5F5] text-lg font-bold block">Familles Aidées</span></p>
            </div>
          </div>

          <div className="hero-card relative w-full lg:flex-1 h-[24rem] lg:h-auto rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(13,71,161,0.2)] border-[6px] border-white group">
            <img src="/kids.jpeg" alt="Groupe solidaire" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
          </div>

          <div className="hero-card relative w-full lg:w-72 bg-[#1565C0] rounded-[2.5rem] p-3 flex flex-col shadow-[0_20px_40px_-15px_rgba(21,101,192,0.3)] group overflow-hidden">
            <div className="relative h-40 w-full rounded-[2rem] overflow-hidden">
               <div className="absolute inset-0 bg-[#1565C0]/20 z-10 transition-opacity group-hover:opacity-0" />
              <img src="/gift.jpeg" alt="Matériel créatif" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <ZigzagWave className="absolute top-44 left-0 w-full opacity-60" />
            <div className="mt-8 px-4 z-10 flex-1 flex flex-col pt-2">
              <h3 className="text-white text-xl font-bold leading-tight mb-4">Soutenez<br/>l'apprentissage</h3>
              {/* BOUTON COMMENT AIDER (Lien Routeur) */}
              <Link 
                to="/don" 
                className="mt-auto mb-2 w-full text-center flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3.5 rounded-full text-sm font-bold backdrop-blur-md transition-all hover:shadow-lg"
              >
                Comment aider ?
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}