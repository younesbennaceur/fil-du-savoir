import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ── Logo Fil du Savoir (Version Blanche pour fond sombre) ──
const FilDuSavoirLogo = ({ className }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="40" r="38" fill="transparent" stroke="currentColor" strokeWidth="2.5" />
    <path d="M14 52 Q40 44 40 44 L40 20 Q40 20 14 28 Z" fill="currentColor" opacity="0.15"/>
    <path d="M66 52 Q40 44 40 44 L40 20 Q40 20 66 28 Z" fill="currentColor" opacity="0.3"/>
    <path d="M14 28 Q27 23 40 20 Q53 23 66 28" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M14 52 Q27 47 40 44 Q53 47 66 52" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="18" y1="35" x2="36" y2="31" stroke="#00ACC1" strokeWidth="1.5"/>
    <line x1="18" y1="40" x2="36" y2="37" stroke="#00ACC1" strokeWidth="1.5"/>
    <line x1="44" y1="31" x2="62" y2="35" stroke="#00ACC1" strokeWidth="1.5"/>
    <line x1="44" y1="37" x2="62" y2="40" stroke="#00ACC1" strokeWidth="1.5"/>
    <path d="M38 14 C38 14 44 16 44 22 C44 27 40 29 38 28 C36 27 35 25 36 23 C37 21 40 21 41 23 C42 25 40 27 38 26" stroke="#00ACC1" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <line x1="38" y1="26" x2="38" y2="33" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="35.5" cy="33.5" rx="2.5" ry="1.5" fill="#00ACC1"/>
  </svg>
);

export default function Footer() {
  const footerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Animation d'apparition des éléments du footer
    gsap.fromTo(elementsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%", // Se déclenche quand on voit le footer
        }
      }
    );

    // Animation flottante de la carte CTA
    gsap.to('.cta-float', {
      y: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[#0A2744] text-white pt-32 pb-10 font-sans mt-24">
      
      {/* ── CARTE FLOTTANTE CTA (Superposée entre la section précédente et le footer) ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-5xl z-20 cta-float">
        <div className="bg-gradient-to-r from-[#1565C0] to-[#00ACC1] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(21,101,192,0.6)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-white/20">
          {/* Décoration interne */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-2">Envie de nous soutenir ?</h3>
            <p className="text-white/80 font-medium text-lg">Rejoignez-nous en tant que bénévole ou faites un don.</p>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <Link to="/don" className="flex-1 md:flex-none bg-white text-[#0D47A1] px-8 py-3.5 rounded-xl font-bold hover:bg-[#F4F9FF] hover:scale-105 transition-all shadow-lg">
              Faire un don
            </Link>
          </div>
        </div>
      </div>

      {/* ── DÉCORATION D'ARRIÈRE-PLAN DU FOOTER ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1565C0]/20 rounded-full blur-[100px]" />
        <div className="absolute top-10 -right-24 w-96 h-96 bg-[#00ACC1]/10 rounded-full blur-[100px]" />
        {/* Grille subtile */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Colonne : Marque & Mission */}
          <div ref={(el) => (elementsRef.current[0] = el)} className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <FilDuSavoirLogo className="w-12 h-12 text-white" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight leading-none text-white">Fil du Savoir</span>
                <span className="text-[#00ACC1] font-bold text-[10px] tracking-widest uppercase mt-1">Association</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed font-medium">
              Une association dédiée à la cohésion sociale à travers l’apprentissage, l'entraide et la diversité culturelle à Lieusaint.
            </p>
          </div>

          {/* 2. Colonne : Liens Rapides */}
          <div ref={(el) => (elementsRef.current[1] = el)}>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ACC1]" /> Liens utiles
            </h4>
            <ul className="flex flex-col gap-3">
              {['Accueil', 'Notre Mission', 'Ateliers & Cours', 'Événements', 'Soutenir l\'association'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-[#00ACC1] text-sm font-medium transition-colors hover:translate-x-1 inline-block duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Colonne : Contact (Avec vos infos) */}
          <div ref={(el) => (elementsRef.current[2] = el)}>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ACC1]" /> Contactez-nous
            </h4>
            <ul className="flex flex-col gap-4">
              {/* Téléphone */}
              <li>
                <a href="tel:0616239058" className="group flex items-start gap-3 text-white/60 hover:text-white transition-colors">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00ACC1]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#00ACC1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-white/40 uppercase mb-0.5">Téléphone</span>
                    <span className="text-sm font-medium">06 16 23 90 58</span>
                  </div>
                </a>
              </li>
              
              {/* Email */}
              <li>
                <a href="mailto:assofildusavoir@gmail.com" className="group flex items-start gap-3 text-white/60 hover:text-white transition-colors">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00ACC1]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#00ACC1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-white/40 uppercase mb-0.5">E-mail</span>
                    <span className="text-sm font-medium">assofildusavoir@gmail.com</span>
                  </div>
                </a>
              </li>

              {/* Adresse / Ville */}
              <li>
                <div className="group flex items-start gap-3 text-white/60">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <svg className="w-5 h-5 text-[#00ACC1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-white/40 uppercase mb-0.5">Localisation</span>
                    <span className="text-sm font-medium">Lieusaint 77127<br/>Île-de-France, France</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* 4. Colonne : Réseaux Sociaux */}
          <div ref={(el) => (elementsRef.current[3] = el)}>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ACC1]" /> Suivez-nous
            </h4>
            <a 
              href="https://instagram.com/fil_du_savoir" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="block text-xs font-semibold opacity-80 mb-0.5">Rejoignez-nous sur</span>
                <span className="font-bold">@fil_du_savoir</span>
              </div>
            </a>
          </div>

        </div>

        {/* ── COPYRIGHT & LÉGAL ── */}
        <div ref={(el) => (elementsRef.current[4] = el)} className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/40">
          <p>© {new Date().getFullYear()} Association Fil du Savoir. Tous droits réservés.</p>
        
        </div>
      </div>
    </footer>
  );
}