import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PolesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const pole1Ref = useRef(null);
  const pole2Ref = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Apparition du titre principal
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // 2. La ligne centrale qui se dessine de haut en bas
      gsap.fromTo(dividerRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power3.inOut",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );

      // 3. Apparition du Pôle 1 (glisse depuis la gauche)
      gsap.fromTo(pole1Ref.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );

      // 4. Apparition du Pôle 2 (glisse depuis la droite)
      gsap.fromTo(pole2Ref.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden font-sans border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* EN-TÊTE DE LA SECTION */}
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-[0.2em] text-[#00ACC1] uppercase mb-4">
            Nos Domaines d'Action
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#0D47A1] tracking-tight">
            Deux pôles, une seule mission.
          </h3>
        </div>

        {/* CONTENEUR DES PÔLES (Split Screen) */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
          
          {/* Ligne séparatrice centrale (Visible uniquement sur Desktop) */}
          <div 
            ref={dividerRef}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E3F2FD] to-transparent -translate-x-1/2"
          />

          {/* 🎓 PÔLE 1 : ENSEIGNEMENT */}
          <div ref={pole1Ref} className="md:pr-16 lg:pr-24 flex flex-col justify-center text-center md:text-right group">
            <span className="text-6xl md:text-8xl font-black text-[#F4F9FF] group-hover:text-[#E3F2FD] transition-colors duration-500 mb-[-30px] md:mb-[-40px] z-0 select-none">
              01
            </span>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-[#0D47A1] mb-4">
                Pôle Principal
              </h4>
              <h5 className="text-lg font-semibold text-[#00ACC1] mb-4">
                Enseignement & Ouverture Culturelle
              </h5>
              <p className="text-slate-500 leading-relaxed">
                Le cœur historique de notre association. Nous dispensons un enseignement linguistique de qualité et accompagnons nos élèves vers la réussite à travers le soutien scolaire. C'est un espace dédié au partage des savoirs et à l'enrichissement culturel mutuel.
              </p>
            </div>
          </div>

          {/* Ligne séparatrice horizontale (Visible uniquement sur Mobile) */}
          <div className="md:hidden h-px w-full bg-gradient-to-r from-transparent via-[#E3F2FD] to-transparent my-4" />

          {/* 🤝 PÔLE 2 : SOCIAL */}
          <div ref={pole2Ref} className="md:pl-16 lg:pl-24 flex flex-col justify-center text-center md:text-left group">
            <span className="text-6xl md:text-8xl font-black text-[#F4F9FF] group-hover:text-[#E3F2FD] transition-colors duration-500 mb-[-30px] md:mb-[-40px] z-0 select-none">
              02
            </span>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-[#0D47A1] mb-4">
                Pôle Solidarité
              </h4>
              <h5 className="text-lg font-semibold text-[#00ACC1] mb-4">
                Accompagnement Social
              </h5>
              <p className="text-slate-500 leading-relaxed">
                Parce que le savoir ne va pas sans l'humain, notre pôle social s'engage auprès des familles et des habitants. Nous œuvrons pour renforcer le lien social, la solidarité de proximité et accompagner ceux qui en ont besoin dans leurs démarches quotidiennes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}