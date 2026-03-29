import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: 1,
    date: "Fête de l'Aïd",
    title: "Cadeaux de l'Aïd",
    desc: "Distribution de cadeaux devant un Hôtel Social par les membres du bureau pour apporter de la joie aux familles.",
    image: "aid.jpeg",
    icon: "🎁",
    color: "text-[#00ACC1]",
    bg: "bg-cyan-50"
  },
  {
    id: 2,
    date: "Lundi 16 Fév 2026",
    title: "Iftar Solidaire 2026",
    desc: "Préparation et distribution de repas pour 34 familles des hôtels sociaux (Lieusaint, Moissy, Tigery). Merci à nos équipes de jeunes bénévoles ! Qu'Allah vous récompense.",
    image: "iftar.jpeg",
    icon: "🍲",
    color: "text-[#1565C0]",
    bg: "bg-blue-50"
  },
  {
    id: 3,
    date: "15 Mars 2026",
    title: "Atelier pour Enfants",
    desc: "Organisation d'un superbe atelier éducatif et ludique dédié à l'épanouissement des plus jeunes.",
    image: "kids.jpeg",
    icon: "🎨",
    color: "text-[#3949AB]",
    bg: "bg-indigo-50"
  },
  {
    id: 4,
    date: "Fin du Ramadan",
    title: "Zakat & Douceurs",
    desc: "Distribution de Zakat et de cadeaux (Tassabih, Musk, bonbons en sachets tissu) offerts par de généreuses sœurs de Lyon et Montereau.",
    image: "fin.jpeg",
    icon: "🌙",
    color: "text-[#0288D1]",
    bg: "bg-sky-50"
  }
];

export default function TreasureMapEvents() {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Nettoyage au cas où (React Strict Mode)
    let ctx = gsap.context(() => {
      
      const container = containerRef.current;
      const totalWidth = container.scrollWidth - window.innerWidth;

      // Animation principale : Scroll Horizontal
      gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true, // Bloque la section pendant le scroll
          scrub: 1,  // L'animation suit la molette (1 = douceur)
          end: () => "+=" + totalWidth, // Durée du scroll proportionnelle à la largeur
        }
      });

      // Effet "Pop" des marqueurs sur la carte
      gsap.utils.toArray('.map-marker').forEach((marker, i) => {
        gsap.from(marker, {
          scale: 0,
          opacity: 0,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: marker,
            containerAnimation: gsap.getById("horizontalScroll"), // Lie au scroll horizontal
            start: "left center+=200", 
            toggleActions: "play none none reverse"
          }
        });
      });

      // Flottement chill des icônes
      gsap.to('.chill-icon', {
        y: -5,
        rotation: 'random(-5, 5)',
        duration: "random(2, 4)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    // Wrapper avec h-screen pour prendre tout l'écran pendant le "pin"
    <section id='evenements' ref={wrapperRef} className="relative h-screen bg-[#F4F9FF] font-sans overflow-hidden">
      
      {/* Arrière-plan style Carte aux Trésors chill */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(#1565C0 2px, transparent 2px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Titre fixe en haut à gauche */}
      <div className="absolute top-10 left-10 z-50">
        <span className="inline-block py-1.5 px-4 rounded-full bg-white text-[#00ACC1] text-xs font-extrabold tracking-widest uppercase mb-2 border border-[#E0F7FA] shadow-sm">
          Notre Parcours
        </span>
        <h2 className="text-4xl font-extrabold text-[#0D47A1]">
          Événements & Actions
        </h2>
      </div>

      {/* ── LE CONTENEUR HORIZONTAL ── */}
      <div 
        ref={containerRef} 
        id="horizontalScroll"
        className="relative flex items-center h-full w-max px-[10vw] sm:px-[20vw]"
      >
        
        {/* Le Chemin en pointillés (La ligne de la carte) */}
        <div className="absolute left-0 right-0 h-1 top-1/2 -translate-y-1/2 border-t-[4px] border-dashed border-[#42A5F5] opacity-50 z-0" />

        {/* ── LES ÉVÉNEMENTS ── */}
        {events.map((event, index) => {
          // Alternance : une carte en haut, une carte en bas
          const isTop = index % 2 === 0;

          return (
            <div key={event.id} className="relative flex flex-col justify-center h-full w-[350px] md:w-[450px] shrink-0 mx-8 md:mx-16 z-10">
              
              {/* Le Marqueur sur la ligne */}
              <div className="map-marker absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-[#0D47A1] rounded-full shadow-[0_0_15px_rgba(13,71,161,0.5)] z-20 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#00ACC1] rounded-full" />
              </div>

              {/* La Carte d'événement */}
              <div className={`
                relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-xl hover:shadow-2xl transition-shadow duration-300
                ${isTop ? 'mb-auto mt-32' : 'mt-auto mb-32'}
              `}>
                
                {/* Icône Flottante */}
                <div className={`chill-icon absolute ${isTop ? '-bottom-6' : '-top-6'} right-6 w-12 h-12 rounded-full ${event.bg} border border-white shadow-md flex items-center justify-center text-2xl z-20`}>
                  {event.icon}
                </div>

                {/* Date */}
                <div className="inline-block px-3 py-1 bg-[#F4F9FF] text-[#0D47A1] text-xs font-bold rounded-lg mb-4 border border-[#E3F2FD]">
                  {event.date}
                </div>

                {/* Titre */}
                <h3 className={`text-2xl font-extrabold mb-3 ${event.color}`}>
                  {event.title}
                </h3>

                {/* Photo de l'événement */}
                <div className="w-full h-40 rounded-xl overflow-hidden mb-4 shadow-inner">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Description */}
                <p className="text-[#1565C0]/80 text-sm font-medium leading-relaxed">
                  {event.desc}
                </p>

              </div>

              {/* Petite ligne qui relie la carte au marqueur central */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-[#42A5F5]/30 -z-10
                ${isTop ? 'top-[50%] bottom-[50%] h-[15vh]' : 'bottom-[50%] top-[50%] h-[15vh]'}
              `} style={{
                [isTop ? 'bottom' : 'top']: '50%',
                height: 'calc(50vh - 12rem)' // Ajuste la ligne de connexion
              }}/>
              
            </div>
          );
        })}

        {/* ── LE TRÉSOR FINAL ── */}
        <div className="relative flex flex-col items-center justify-center h-full w-[300px] shrink-0 mx-16 z-10">
          <div className="chill-icon text-6xl drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] mb-4">
            🏆
          </div>
          <h3 className="text-2xl font-extrabold text-[#0D47A1] text-center">
            Notre plus beau trésor : <br/>
            <span className="text-[#00ACC1]">Leurs sourires</span>
          </h3>
        </div>

      </div>
    </section>
  );
}