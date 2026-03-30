import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrement du plugin pour les animations au scroll
gsap.registerPlugin(ScrollTrigger);

export default function TeamSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  // Les données de l'équipe
  const teamMembers = [
    {
      role: "Présidente",
      name: "Mme Ikhouane Nouzha",
      icon: "👑",
      color: "from-[#0D47A1] to-[#1565C0]" // Bleu foncé
    },
    {
      role: "Vice-présidente",
      name: "Mme Toumatik Khadija",
      icon: "✨",
      color: "from-[#00ACC1] to-[#26C6DA]" // Cyan
    },
    {
      role: "Secrétaire & Trésorier",
      name: "M. Ikhouane Ahmed",
      icon: "💼",
      color: "from-[#1E88E5] to-[#42A5F5]" // Bleu clair
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animation du Titre
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // 2. Animation de l'image (Effet de masque / Révélation)
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.8, clipPath: "inset(10% 10% 10% 10% round 20px)" },
        {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // 3. Animation en cascade (Stagger) des membres du bureau
      gsap.fromTo(cardsRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2, // Délai entre chaque carte
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert(); // Nettoyage propre pour React
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 bg-white overflow-hidden">
      
      {/* ── DÉCORATIONS D'ARRIÈRE-PLAN (Orbes fluides) ── */}
      <div className="absolute top-0 left-[-10%] w-[40vw] h-[40vw] bg-[#E3F2FD] rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-[#E0F7FA] rounded-full blur-[80px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* TITRE DE LA SECTION */}
        <div ref={titleRef} className="text-center md:text-left mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-[#F4F9FF] text-[#00ACC1] text-sm font-bold tracking-widest uppercase mb-3 border border-[#E0F7FA]">
            Notre Bureau
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D47A1] tracking-tight">
            L'équipe dirigeante
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl text-lg">
            Des passionnés engagés au quotidien pour la réussite de nos apprenants et le développement de l'association Fil du Savoir.
          </p>
        </div>

        {/* GRILLE PRINCIPALE (Image à gauche, Membres à droite) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* 📸 COLONNE GAUCHE : LA PHOTO DE GROUPE */}
          <div className="relative group perspective-1000">
            {/* Cadre décoratif derrière l'image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D47A1] to-[#00ACC1] rounded-3xl transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
            
            {/* L'image elle-même */}
            <div 
              ref={imageRef} 
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3]"
            >
              <img 
                src="/teams.jpeg" 
                alt="L'équipe dirigeante du Fil du Savoir" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Petit badge superposé sur l'image */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold text-[#0D47A1]">Bureau 2026</span>
              </div>
            </div>
          </div>

            {/* Liste Éditoriale */}
            <div className="flex flex-col">
              {/* Ligne du dessus (initiale) */}
              <div ref={(el) => (cardsRef.current[0] = el)} className="h-px bg-slate-300 w-full" />

              {teamMembers.map((member, index) => (
                <React.Fragment key={index}>
                  
                  {/* Ligne d'un membre */}
                  <div 
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 transition-colors hover:bg-white/50 px-4 -mx-4 rounded-lg"
                  >
                    {/* Numéro et Rôle */}
                    <div className="flex items-center gap-6 mb-2 sm:mb-0">
                      <span className="text-lg font-light text-slate-400 font-mono">
                        {member.number}
                      </span>
                      <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">
                        {member.role}
                      </span>
                    </div>

                    {/* Nom (Poussé à droite sur grand écran) */}
                    <div className="sm:text-right pl-11 sm:pl-0">
                      <span className="text-xl md:text-2xl font-bold text-[#0D47A1] group-hover:text-[#00ACC1] transition-colors duration-300">
                        {member.name}
                      </span>
                    </div>
                  </div>

                  {/* Ligne de séparation en dessous */}
                  <div ref={(el) => (cardsRef.current[index + 1] = el)} className="h-px bg-slate-300 w-full" />
                </React.Fragment>
              ))}
            </div>

        </div>
      </div>
    </section>
  );
}