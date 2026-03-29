import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 10 items (Photos & Vidéos)
const galleryItems = [
  {
    id: 1,
    title: "Atelier Créatif",
    category: "Enfants",
    media: "kids.jpeg",
    gridClass: "md:col-span-2 md:row-span-2", // Carré géant
  },
  {
    id: 2,
    title: "Distribution",
    category: "Solidarité",
    media: "aid.mp4", 
    gridClass: "md:col-span-1 md:row-span-1", 
  },
  {
    id: 3,
    title: "Iftar Solidaire",
    category: "Entraide",
    media: "iftar.jpeg",
    gridClass: "md:col-span-1 md:row-span-1", 
  },
  {
    id: 4,
    title: "Iftar",
    category: "Ramadan",
    media: "iftar2.jpeg",
    gridClass: "md:col-span-1 md:row-span-2", // Carte haute (portrait)
  },
  {
    id: 5,
    title: "Fête de l'Aïd",
    category: "Événement",
    media: "aid.jpeg",
    gridClass: "md:col-span-2 md:row-span-1", // Carte large (paysage)
  },
  {
    id: 6,
    title: "Distribution",
    category: "Solidarité",
    media: "gift.mp4",
    gridClass: "md:col-span-1 md:row-span-1", 
  },
  {
    id: 7,
    title: "Association",
    category: "Vie Asso",
    media: "asso.mp4",
    gridClass: "md:col-span-2 md:row-span-1", 
  },
  {
    id: 8,
    title: "Iftar Solidaire",
    category: "volontariat",
    media: "iftar.mp4", 
    gridClass: "md:col-span-1 md:row-span-1", 
  },
  {
    id: 9,
    title: "activité ",
    category: "Vie Asso",
    media: "team.jpeg",
    gridClass: "md:col-span-1 md:row-span-2", 
  },
  {
    id: 10,
    title: "cadeaux de l'Aïd",
    category: "Solidarité",
    media: "gift.jpeg",
    gridClass: "md:col-span-3 md:row-span-1", // Longue carte finale
  }
];

const isVideoFile = (filename) => {
  return /\.(mp4|webm|ogg)$/i.test(filename);
};

export default function GallerySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // 1. Animation de l'en-tête
    gsap.fromTo(headerRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    // 2. Apparition des photos/vidéos
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          delay: index * 0.08, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          }
        }
      );
    });

    // 3. Animation d'ambiance en arrière-plan
    gsap.to('.gallery-orb', {
      y: "-=30",
      x: "+=20",
      rotation: "random(-15, 15)",
      duration: "random(4, 8)",
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, []);

  return (
    <section id='galerie' ref={sectionRef} className="relative py-32 bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* ── ARRIÈRE-PLAN ANIMÉ ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #1565C0 1px, transparent 1px)', 
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
        }} 
      />
      <div className="gallery-orb absolute top-0 left-[-10%] w-[35rem] h-[35rem] bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply opacity-60" />
      <div className="gallery-orb absolute bottom-0 right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-tl from-[#E0F7FA] to-[#B2EBF2] rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply opacity-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* ── EN-TÊTE ── */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block py-1.5 px-5 rounded-full bg-white text-[#0D47A1] text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm border border-[#E3F2FD]">
            Notre Parcours
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D47A1] tracking-tight mb-4 leading-tight">
            Souvenirs & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#00ACC1]">Partage</span>
          </h2>
          <p className="text-[#1565C0]/80 text-lg md:text-xl font-medium">
            Explorez les moments forts de Fil du Savoir : apprentissage, sourires et projets solidaires.
          </p>
        </div>

        {/* ── GRILLE BENTO CORRIGÉE (auto-rows-[250px]) ── */}
        {/* Le secret est ici : auto-rows-[250px] donne une base de 250px de hauteur à toutes les cartes */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[280px] gap-4 md:gap-6 w-full">
          
          {galleryItems.map((item, index) => {
            const isVideo = isVideoFile(item.media);

            return (
              <div 
                key={item.id}
                ref={(el) => (cardsRef.current[index] = el)}
                // J'ajoute w-full et h-full ici pour m'assurer que la div prend bien toute la place allouée
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-xl transition-shadow duration-500 bg-white border border-white/50 w-full h-full ${item.gridClass}`}
              >
                {/* Médias avec absolute inset-0 qui vont maintenant remplir le conteneur */}
                {isVideo ? (
                  <video 
                    src={item.media} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <img 
                    src={item.media} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/90 via-[#1565C0]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col items-start">
                  <span className="inline-block px-3 py-1 bg-[#00ACC1] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg mb-2 shadow-sm">
                    {item.category}
                  </span>
                  <h3 className="text-white text-xl md:text-2xl font-extrabold leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}

        </div>

       

      </div>
    </section>
  );
}