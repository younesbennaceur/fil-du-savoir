import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Navigation from '../components/nav/Navigation'; // Ajuste le chemin si besoin

export default function ThemedRegistrationForm() {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  
  // ── 1. ETAT DU FORMULAIRE (Correspond exactement à ton modèle backend) ──
  const [courseType, setCourseType] = useState('arabe_enfant');
  const [formData, setFormData] = useState({
    parentName: '',
    parentAddress: '',
    parentPhone: '',
    parentEmail: '',
    studentName: '',
    studentAge: '',
    studentPhone: '',
    level: '',
    soutienClass: '',
    schedules: [], // Tableau pour les cases cochées
    signature: ''
  });

  // États pour l'interface utilisateur (UX)
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ── 2. FONCTIONS DE GESTION DES CHAMPS ──
  // Pour les champs textes normaux
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pour les cases à cocher (Horaires)
  const handleScheduleToggle = (horaire) => {
    setFormData((prev) => {
      const isSelected = prev.schedules.includes(horaire);
      if (isSelected) {
        return { ...prev, schedules: prev.schedules.filter(h => h !== horaire) };
      } else {
        return { ...prev, schedules: [...prev.schedules, horaire] };
      }
    });
  };

  // ── 3. SOUMISSION AU BACKEND ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setIsSuccess(false);

    // Préparation des données finales
    const dataToSend = {
      ...formData,
      courseType: courseType
    };

    try {
      // Envoi de la requête au serveur Node.js
      const response = await fetch('http://localhost:5000/api/inscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // Optionnel : Vider le formulaire après succès
        setFormData({
          parentName: '', parentAddress: '', parentPhone: '', parentEmail: '',
          studentName: '', studentAge: '', studentPhone: '', level: '',
          soutienClass: '', schedules: [], signature: ''
        });
        
        // Petit scroll vers le haut pour voir le message de succès
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(data.message || "Une erreur s'est produite lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      setErrorMessage("Impossible de se connecter au serveur. Vérifiez qu'il est bien lancé.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Animation GSAP
    const cards = gsap.utils.toArray('.form-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out", delay: 0.2 }
    );

    gsap.to('.theme-orb', {
      y: -20, x: 20, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut"
    });
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] py-20 px-4 md:px-8 font-sans overflow-hidden">
      <Navigation />
      
      {/* ── ARRIÈRE-PLAN ── */}
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

       {/* ── POP-UP DE SUCCÈS (Style shadcn/ui) ── */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            
            {/* Bouton Fermer (Croix en haut à droite) */}
            <button 
              onClick={() => setIsSuccess(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <line x1="18" x2="6" y1="6" y2="18"></line>
                <line x1="6" x2="18" y1="6" y2="18"></line>
              </svg>
              <span className="sr-only">Fermer</span>
            </button>

            {/* Contenu de la Modal */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F7FA] mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#0D47A1]">
                Inscription confirmée !
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Merci pour votre confiance. L'équipe du Fil du Savoir a bien reçu votre demande et la traitera dans les plus brefs délais.
              </p>
            </div>

            {/* Bouton d'action */}
            <div className="mt-6 flex justify-center sm:justify-end">
              <button
                onClick={() => setIsSuccess(false)}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#0D47A1] px-4 py-2 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-[#1565C0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                Fermer
              </button>
            </div>
            
          </div>
        </div>
      )}

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm form-card">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ── FORMULAIRE ── */}
        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
          
          {/* SECTION 1 : PARENTS */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Informations Personnelles (Parents)</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Nom et prénom *</label>
                <input required name="parentName" value={formData.parentName} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Adresse complète *</label>
                <input required name="parentAddress" value={formData.parentAddress} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0D47A1]">Téléphone *</label>
                <input required type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0D47A1]">Adresse e-mail *</label>
                <input required type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* SECTION 2 : APPRENANT */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Informations sur l’apprenant</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-[#0D47A1]">Nom et prénom de l'élève *</label>
                  <input required name="studentName" value={formData.studentName} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D47A1]">Âge *</label>
                  <input required type="number" name="studentAge" value={formData.studentAge} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D47A1]">Téléphone (si différent)</label>
                  <input type="tel" name="studentPhone" value={formData.studentPhone} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" />
                </div>
              </div>

              {/* Toggle Group Niveau */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Niveau actuel en langue arabe *</label>
                <div className="flex flex-wrap gap-2">
                  {['Maternelle 5ans', 'CP', 'Niveau 1', 'Niveau 2', 'Niveau 3'].map((niv) => (
                    <label key={niv} className="relative flex cursor-pointer items-center justify-center rounded-lg border border-[#E3F2FD] bg-white px-4 py-2 text-sm font-semibold text-[#1565C0] transition-colors hover:bg-[#F4F9FF] has-[:checked]:bg-[#00ACC1] has-[:checked]:text-white has-[:checked]:border-[#00ACC1] shadow-sm">
                      <input required type="radio" name="level" value={niv} checked={formData.level === niv} onChange={handleChange} className="sr-only" />
                      {niv}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0D47A1]">Ou Soutien scolaire, précisez la classe :</label>
                <input type="text" name="soutienClass" value={formData.soutienClass} onChange={handleChange} className="flex h-10 w-full md:w-1/2 rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" placeholder="Ex: CM1, 4ème..." />
              </div>
            </div>
          </div>

          {/* SECTION 3 : CHOIX DU COURS */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#F4F9FF] px-6 py-4 border-b border-[#BBDEFB]">
              <h3 className="font-bold text-[#0D47A1]">Choix du cours</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F4F9FF] p-1 text-[#1565C0] w-full md:w-auto border border-[#E3F2FD]">
                <button type="button" onClick={() => setCourseType('arabe_enfant')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${courseType === 'arabe_enfant' ? 'bg-white text-[#0D47A1] shadow-sm border border-[#E3F2FD]' : ''}`}>Arabe enfants</button>
                <button type="button" onClick={() => setCourseType('arabe_femme')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${courseType === 'arabe_femme' ? 'bg-white text-[#0D47A1] shadow-sm border border-[#E3F2FD]' : ''}`}>Arabe femmes</button>
                <button type="button" onClick={() => setCourseType('soutien')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${courseType === 'soutien' ? 'bg-white text-[#0D47A1] shadow-sm border border-[#E3F2FD]' : ''}`}>Soutien scolaire</button>
              </div>

              <div className="space-y-3 p-5 rounded-xl border border-[#E3F2FD] bg-[#F8FAFC]">
                <label className="text-sm font-bold text-[#0D47A1]">Horaires souhaités :</label>
                
                {courseType === 'arabe_enfant' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {['Samedi matin (Maternelle & CP)', 'Samedi après-midi (Niv 1 à 3)', 'Dimanche matin (Maternelle & CP)', 'Dimanche après-midi (Niv 1 à 3)'].map(horaire => (
                      <label key={horaire} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                        <input type="checkbox" checked={formData.schedules.includes(horaire)} onChange={() => handleScheduleToggle(horaire)} className="h-4 w-4 rounded border-[#BBDEFB] text-[#00ACC1] focus:ring-[#00ACC1]" />
                        <span className="text-sm font-medium text-[#1565C0]">{horaire}</span>
                      </label>
                    ))}
                  </div>
                )}
                {/* Reprendre le même modèle pour arabe_femme et soutien */}
                {courseType === 'arabe_femme' && (
                  <label className="flex items-center space-x-3 mt-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input type="checkbox" checked={formData.schedules.includes('Dimanche après-midi 16h à 20h (Niveau 1)')} onChange={() => handleScheduleToggle('Dimanche après-midi 16h à 20h (Niveau 1)')} className="h-4 w-4 rounded border-[#BBDEFB] text-[#00ACC1] focus:ring-[#00ACC1]" />
                    <span className="text-sm font-medium text-[#1565C0]">Dimanche après-midi 16h à 20h (Niveau 1)</span>
                  </label>
                )}
                {courseType === 'soutien' && (
                  <label className="flex items-center space-x-3 mt-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input type="checkbox" checked={formData.schedules.includes('Samedi après-midi 16h à 18h')} onChange={() => handleScheduleToggle('Samedi après-midi 16h à 18h')} className="h-4 w-4 rounded border-[#BBDEFB] text-[#00ACC1] focus:ring-[#00ACC1]" />
                    <span className="text-sm font-medium text-[#1565C0]">Samedi après-midi 16h à 18h</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4 : SIGNATURE */}
          <div className="form-card rounded-2xl border border-[#BBDEFB] bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0D47A1]">Nom & Signature (Parent) *</label>
                <input required type="text" name="signature" value={formData.signature} onChange={handleChange} className="flex h-10 w-full md:w-1/2 rounded-lg border border-[#E3F2FD] bg-white px-3 py-2 text-sm text-[#0D47A1] focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" placeholder="Tapez votre nom complet pour signer..." />
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-slate-50 p-6 border-t border-[#E3F2FD] flex justify-end">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`inline-flex items-center justify-center rounded-xl bg-[#0D47A1] text-white hover:bg-[#1565C0] h-11 px-8 py-2 text-sm font-bold shadow-md transition-all w-full md:w-auto transform active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Envoi en cours...' : "Valider l'inscription"}
              </button>
            </div>
          </div>
        </form>

      </div>
    </section>
  );
}