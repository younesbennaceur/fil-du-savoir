import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Navigation from '../components/nav/Navigation';

export default function ThemedRegistrationForm() {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const [courseType, setCourseType] = useState('arabe_enfant');

  useEffect(() => {
    // Animation GSAP : Apparition "Fade Up" élégante des cartes du formulaire
    const cards = gsap.utils.toArray('.form-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2
      }
    );

    // Animation de l'orbe d'arrière-plan pour garder la touche "Fil du Savoir"
    gsap.to('.theme-orb', {
      y: -20,
      x: 20,
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] py-20 px-4 md:px-8 font-sans overflow-hidden">
      <Navigation />
      {/* ── ARRIÈRE-PLAN (Thème Landing Page) ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(#1565C0 1px, transparent 1px)', 
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }} 
      />
      <div className="theme-orb absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#E3F2FD] rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply" />
      <div className="theme-orb absolute bottom-[20%] right-[-5%] w-[30vw] h-[30vw] bg-[#E0F7FA] rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* ── EN-TÊTE ── */}
        <div className="mb-12 mt-16 text-center md:text-left form-card">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white text-[#00ACC1] text-xs font-bold tracking-widest uppercase mb-4 border border-[#E0F7FA] shadow-sm">
            Inscription 2026
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0D47A1] mb-3">
            Rejoignez l'aventure
          </h1>
          <p className="text-[#1565C0]/70 text-base max-w-2xl leading-relaxed font-medium">
            L’association Fil du Savoir vous accueille dans les locaux de la mairie de Lieusaint pour son programme d’apprentissage et de soutien.
          </p>
        </div>

        {/* ── FORMULAIRE ── */}
        <form ref={formRef} className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* SECTION 1 : PARENTS */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Informations Personnelles (Parents)</h3>
              <p className="text-xs text-[#1565C0]/70 mt-0.5">Renseignez les coordonnées du responsable légal.</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Nom et prénom</label>
                <input className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] placeholder:text-[#1565C0]/40 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all" placeholder="Ex: Jean Dupont" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Adresse complète</label>
                <input className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] placeholder:text-[#1565C0]/40 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all" placeholder="N°, Rue, Code Postal, Ville" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0D47A1]">Téléphone</label>
                <input type="tel" className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] placeholder:text-[#1565C0]/40 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all" placeholder="06 00 00 00 00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0D47A1]">Adresse e-mail</label>
                <input type="email" className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] placeholder:text-[#1565C0]/40 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all" placeholder="nom@exemple.com" />
              </div>
            </div>
          </div>

          {/* SECTION 2 : APPRENANT */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Informations sur l’apprenant</h3>
              <p className="text-xs text-[#1565C0]/70 mt-0.5">Détails concernant l'élève inscrit.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-[#0D47A1]">Nom et prénom de l'élève</label>
                  <input className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D47A1]">Âge</label>
                  <input type="number" className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D47A1]">Téléphone (si différent)</label>
                  <input type="tel" className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] transition-all" />
                </div>
              </div>

              {/* Toggle group shadcn-style mais coloré Fil du Savoir */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Niveau actuel en langue arabe</label>
                <div className="flex flex-wrap gap-2">
                  {['Maternelle 5ans', 'CP', 'Niveau 1', 'Niveau 2', 'Niveau 3'].map((niv) => (
                    <label key={niv} className="relative flex cursor-pointer items-center justify-center rounded-lg border border-[#E3F2FD] bg-white px-4 py-2 text-sm font-semibold text-[#1565C0] transition-colors hover:bg-[#F4F9FF] has-[:checked]:bg-[#00ACC1] has-[:checked]:text-white has-[:checked]:border-[#00ACC1] shadow-sm">
                      <input type="radio" name="niveau" className="sr-only" />
                      {niv}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Ou Soutien scolaire, précisez la classe :</label>
                <input type="text" className="flex h-10 w-full md:w-1/2 rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] placeholder:text-[#1565C0]/40 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] transition-all" placeholder="Ex: CM1, 4ème..." />
              </div>
            </div>
          </div>

          {/* SECTION 3 : CHOIX DU COURS & HORAIRES */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Choix du cours</h3>
              <p className="text-xs text-[#1565C0]/70 mt-0.5">Sélectionnez le type de cours et vos disponibilités.</p>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Tabs style shadcn adaptés au thème */}
              <div className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F4F9FF] p-1 text-[#1565C0] w-full md:w-auto border border-[#E3F2FD]">
                <button 
                  type="button"
                  onClick={() => setCourseType('arabe_enfant')}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold transition-all focus:outline-none ${courseType === 'arabe_enfant' ? 'bg-white text-[#0D47A1] shadow-sm border border-[#E3F2FD]' : 'hover:bg-[#E3F2FD]/50'}`}
                >
                  Arabe enfants
                </button>
                <button 
                  type="button"
                  onClick={() => setCourseType('arabe_femme')}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold transition-all focus:outline-none ${courseType === 'arabe_femme' ? 'bg-white text-[#0D47A1] shadow-sm border border-[#E3F2FD]' : 'hover:bg-[#E3F2FD]/50'}`}
                >
                  Arabe femmes
                </button>
                <button 
                  type="button"
                  onClick={() => setCourseType('soutien')}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold transition-all focus:outline-none ${courseType === 'soutien' ? 'bg-white text-[#0D47A1] shadow-sm border border-[#E3F2FD]' : 'hover:bg-[#E3F2FD]/50'}`}
                >
                  Soutien scolaire
                </button>
              </div>

              {/* Checkboxes Horaires */}
              <div className="space-y-3 p-5 rounded-xl border border-[#E3F2FD] bg-[#F8FAFC]">
                <label className="text-sm font-bold text-[#0D47A1]">Horaires souhaités :</label>
                
                {courseType === 'arabe_enfant' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {['Samedi matin (Maternelle & CP)', 'Samedi après-midi (Niv 1 à 3)', 'Dimanche matin (Maternelle & CP)', 'Dimanche après-midi (Niv 1 à 3)'].map(horaire => (
                      <label key={horaire} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-[#BBDEFB] text-[#00ACC1] focus:ring-[#00ACC1]" />
                        <span className="text-sm font-medium text-[#1565C0]">{horaire}</span>
                      </label>
                    ))}
                  </div>
                )}

                {courseType === 'arabe_femme' && (
                  <label className="flex items-center space-x-3 mt-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#BBDEFB] text-[#00ACC1] focus:ring-[#00ACC1]" />
                    <span className="text-sm font-medium text-[#1565C0]">Dimanche après-midi 16h à 20h (Niveau 1)</span>
                  </label>
                )}

                {courseType === 'soutien' && (
                  <label className="flex items-center space-x-3 mt-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#BBDEFB] text-[#00ACC1] focus:ring-[#00ACC1]" />
                    <span className="text-sm font-medium text-[#1565C0]">Samedi après-midi 16h à 18h</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4 : TARIFS ET VALIDATION */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Tarifs & Signature</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#E3F2FD] bg-[#F8FAFC] p-4 text-center">
                  <div className="text-xs font-bold text-[#1565C0]/70 uppercase tracking-wider mb-1">Cours Arabe</div>
                  <div className="text-2xl font-extrabold text-[#0D47A1]">180€ <span className="text-sm font-medium text-[#1565C0]/60">/an</span></div>
                </div>
                <div className="rounded-xl border border-[#E3F2FD] bg-[#F8FAFC] p-4 text-center">
                  <div className="text-xs font-bold text-[#1565C0]/70 uppercase tracking-wider mb-1">Soutien Scolaire</div>
                  <div className="text-2xl font-extrabold text-[#0D47A1]">20€ <span className="text-sm font-medium text-[#1565C0]/60">/an</span></div>
                </div>
                <div className="rounded-xl border border-[#E3F2FD] bg-[#F8FAFC] p-4 text-center">
                  <div className="text-xs font-bold text-[#1565C0]/70 uppercase tracking-wider mb-1">Ateliers culturels</div>
                  <div className="text-2xl font-extrabold text-[#0D47A1]">20€ <span className="text-sm font-medium text-[#1565C0]/60">/an</span></div>
                </div>
              </div>

              <div className="text-sm text-[#1565C0] font-medium flex items-center gap-2 bg-[#F4F9FF] p-3 rounded-lg border border-[#E3F2FD]">
                <span className="text-[#00ACC1]">ℹ️</span>
                Paiement accepté : Espèces, chèque ou virement.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D47A1]">Fait à Lieusaint, le</label>
                  <input type="date" className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D47A1]">Nom & Signature (Parent)</label>
                  <input type="text" className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] transition-all" placeholder="Tapez votre nom..." />
                </div>
              </div>
            </div>

            {/* Submit Button (Style shadcn adapté) */}
            <div className="bg-slate-50 p-6 border-t border-[#E3F2FD] flex justify-end">
              <button 
                type="submit" 
                className="inline-flex items-center justify-center rounded-xl bg-[#0D47A1] text-white hover:bg-[#1565C0] h-11 px-8 py-2 text-sm font-bold shadow-md hover:shadow-lg transition-all w-full md:w-auto transform active:scale-95"
              >
                Valider l'inscription
              </button>
            </div>
          </div>
        </form>

      </div>
    </section>
  );
}