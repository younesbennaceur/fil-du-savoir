import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

// Enregistrement du plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    icon: "📖",
    title: "Cours d’arabe",
    desc: "Lecture, écriture, compréhension et expression orale pour tous les âges.",
    gradient: "from-[#1565C0] to-[#0D47A1]",
    lightBg: "bg-blue-50",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(13,71,161,0.4)]",
    delay: 0
  },
  {
    id: 2,
    icon: "✏️",
    title: "Aide aux devoirs",
    desc: "Un accompagnement personnalisé pour les élèves en primaire, collège et lycée.",
    gradient: "from-[#00ACC1] to-[#00838F]",
    lightBg: "bg-cyan-50",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(0,172,193,0.4)]",
    delay: 0.15
  },
  {
    id: 3,
    icon: "🎨",
    title: "Ateliers culturels",
    desc: "Des événements éducatifs, artistiques et ludiques pour éveiller la curiosité.",
    gradient: "from-[#5E35B1] to-[#4527A0]",
    lightBg: "bg-indigo-50",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(94,53,177,0.4)]",
    delay: 0.3
  },
  {
    id: 4,
    icon: "🤝",
    title: "Actions solidaires",
    desc: "Organisation de projets d'entraide, de partage et de citoyenneté.",
    gradient: "from-[#42A5F5] to-[#1E88E5]",
    lightBg: "bg-sky-50",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(66,165,245,0.4)]",
    delay: 0.45
  }
];

export default function ActivitiesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // 1. Animation de l'en-tête (Titres)
    gsap.fromTo(headerRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", 
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Animation des cartes (Apparition en cascade)
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: services[index].delay,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 3. Animation d'ambiance en arrière-plan
    gsap.to('.activity-orb', {
      y: "-=30",
      x: "+=20",
      duration: "random(4, 8)",
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.5
    });

  }, []);

  return (
    <section id='ateliers' ref={sectionRef} className="relative py-24 bg-white font-sans overflow-hidden">
      
      {/* ── ARRIÈRE-PLAN ANIMÉ ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0" 
        style={{ backgroundImage: 'radial-gradient(#E3F2FD 2px, transparent 2px)', backgroundSize: '40px 40px' }} 
      />
      <div className="activity-orb absolute top-[10%] left-[-5%] w-96 h-96 bg-[#42A5F5]/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="activity-orb absolute bottom-[10%] right-[-5%] w-96 h-96 bg-[#00ACC1]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── EN-TÊTE ── */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block py-1.5 px-5 rounded-full bg-[#F4F9FF] text-[#00ACC1] text-xs font-extrabold tracking-widest uppercase mb-4 border border-[#E0F7FA] shadow-sm">
            Nos Services & Projets
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D47A1] tracking-tight mb-6">
            Apprendre, Grandir <br/> et <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#00ACC1]">Partager</span>
          </h2>
          <p className="text-[#1565C0]/80 text-lg md:text-xl font-medium leading-relaxed">
            Nous accompagnons enfants, jeunes et adultes dans leur apprentissage et leur réussite à travers des activités enrichissantes et bienveillantes.
          </p>
        </div>

        {/* ── GRILLE DES CARTES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              ref={(el) => (cardsRef.current[index] = el)}
              className={`relative bg-white rounded-[2rem] p-8 border border-gray-100 flex flex-col transition-all duration-500 group ${service.shadow} hover:-translate-y-2`}
            >
              {/* Icône */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${service.lightBg}`}>
                {service.icon}
              </div>

              {/* Contenu */}
              <h3 className="text-xl font-bold text-[#0D47A1] mb-3 leading-tight">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                {service.desc}
              </p>

              {/* Bouton S'inscrire (Maintenant avec Link) */}
              <Link 
                to="/inscription" 
                className={`relative w-full overflow-hidden rounded-xl p-[2px] transition-all duration-300 active:scale-95 group/btn`}
              >
                <span className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                <span className="relative flex items-center justify-center gap-2 w-full bg-white px-4 py-3 rounded-[10px] text-[#0D47A1] font-bold text-sm transition-colors duration-300 group-hover/btn:bg-transparent group-hover/btn:text-white">
                  S'inscrire
                  <svg className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* ── APPEL AU DON (Nouveau) ── */}
        <div className="mt-24 text-center flex flex-col items-center">
          <p className="text-[#1565C0]/80 font-medium mb-6 text-lg">
            Envie de soutenir nos actions et de participer à nos projets solidaires ?
          </p>
          <Link 
            to="/don" 
            className="flex items-center justify-center gap-3 bg-[#0D47A1] text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_20px_rgba(13,71,161,0.2)] hover:shadow-[0_15px_30px_rgba(13,71,161,0.3)] hover:-translate-y-1 transition-all duration-300 group"
          >
            <Heart className="w-5 h-5 text-[#00ACC1] transition-colors group-hover:fill-[#00ACC1]" />
            Faire un don à l'association
          </Link>
        </div>

      </div>
    </section>
  );
}