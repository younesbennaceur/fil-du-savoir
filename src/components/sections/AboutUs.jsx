import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrement du plugin de scroll
gsap.registerPlugin(ScrollTrigger);

export default function AboutMissionSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    // 1. Animation du "Fil" qui se dessine au scroll
    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1, 
        }
      });
    }

    // 2. Apparition des cartes "Bento" au scroll
    const cards = gsap.utils.toArray('.bento-card');
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 50, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.15, 
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 3. Animation flottante continue des icônes
    gsap.to('.bento-icon', {
      y: -6,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.2
    });

  }, []);

  return (
    <section id="notre-mission" ref={sectionRef} className="relative py-24 bg-white overflow-hidden font-sans">
      
      {/* ── ARRIÈRE-PLAN : Grille subtile & Fil animé ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" 
        style={{ backgroundImage: 'radial-gradient(#1565C0 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" preserveAspectRatio="xMidYMax slice">
        <path 
          ref={pathRef}
          d="M -100 100 Q 300 300 500 100 T 1000 400 T 1500 200" 
          fill="none" 
          stroke="#00ACC1" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── EN-TÊTE DE SECTION (Qui sommes-nous) ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 bento-card">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#E3F2FD] text-[#1565C0] text-xs font-bold tracking-widest uppercase mb-4 border border-[#BBDEFB]">
            Présentation
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D47A1] tracking-tight mb-6">
            Qui sommes-nous ?
          </h2>
          <p className="text-[#1565C0]/90 text-lg md:text-xl font-medium leading-relaxed bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-[#E3F2FD] shadow-sm">
            C’est une association régie par la loi du 1er juillet 1901 et le décret du 16 août 1901, dénommée : <strong className="text-[#0D47A1] font-extrabold">Association Fil du Savoir.</strong>
          </p>
        </div>

        {/* ── GRILLE BENTO (Le contenu exact réparti) ── */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Carte 1 : Notre mission (Arabe & Patrimoine) */}
          <div className="bento-card md:col-span-2 bg-gradient-to-br from-[#0D47A1] to-[#1565C0] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(13,71,161,0.5)] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#42A5F5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="bento-icon w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6 border border-white/20">
                📖
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#C4F970]">Notre mission</h3>
              <p className="text-white/90 font-medium leading-relaxed text-lg">
                L’association a pour but d’enseigner la langue arabe pour les élèves de niveaux variés : primaires, secondaires et aussi les adultes. Elle s’engage également à offrir des instructions sur l’étude du patrimoine culturel et des textes fondateurs.
              </p>
            </div>
          </div>

          {/* Carte 2 : Soutien scolaire */}
          <div className="bento-card md:col-span-1 bg-[#F4F9FF] rounded-[2rem] p-8 border border-[#E3F2FD] shadow-lg hover:shadow-xl hover:border-[#42A5F5]/30 transition-all group">
            <div className="bento-icon w-14 h-14 bg-[#E0F7FA] text-[#00ACC1] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
              ✏️
            </div>
            <p className="text-[#1565C0]/80 text-base font-medium leading-relaxed">
              De même, l’association offre un soutien scolaire et éducatif aux élèves de tous niveaux et aux personnes en difficulté.
            </p>
          </div>

          {/* Carte 3 : Enseignants */}
          <div className="bento-card md:col-span-1 bg-[#F4F9FF] rounded-[2rem] p-8 border border-[#E3F2FD] shadow-lg hover:shadow-xl hover:border-[#42A5F5]/30 transition-all group">
            <div className="bento-icon w-14 h-14 bg-[#E8EAF6] text-[#3949AB] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
              🎓
            </div>
            <p className="text-[#1565C0]/80 text-base font-medium leading-relaxed">
              L’association fait appel à des enseignants et formateurs compétents et expérimentés afin de garantir une qualité pédagogique optimale.
            </p>
          </div>

          {/* Carte 4 : Activités */}
          <div className="bento-card md:col-span-2 bg-[#F4F9FF] rounded-[2rem] p-8 border border-[#E3F2FD] shadow-lg hover:shadow-xl hover:border-[#42A5F5]/30 transition-all group">
            <div className="bento-icon w-14 h-14 bg-[#E3F2FD] text-[#00ACC1] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
              ⚽
            </div>
            <p className="text-[#1565C0]/80 text-lg font-medium leading-relaxed">
              Elle organise des activités socio-culturelles, sportives et sociales pour promouvoir l'intégration et la cohésion sociale à travers l’apprentissage et la diversité culturelle.
            </p>
          </div>

          {/* Carte 5 : Valeurs (Prend toute la largeur en bas) */}
          <div className="bento-card md:col-span-3 bg-[#00ACC1] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,172,193,0.5)] text-white flex flex-col sm:flex-row items-start sm:items-center gap-6 group overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="bento-icon shrink-0 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border border-white/30">
              🤝
            </div>
            <div className="relative z-10">
              <p className="text-white font-medium text-lg leading-relaxed">
                Elle agit dans un cadre non lucratif, indépendant et ouvert à tous, dans le respect des valeurs d’éducation, de solidarité et de partage des connaissances.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}