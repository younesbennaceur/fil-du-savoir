import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SESSION_KEY = 'fil-du-savoir-inscription-popup-2026';

export default function EnrollmentPopup() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/' || sessionStorage.getItem(SESSION_KEY)) return undefined;

    const timer = window.setTimeout(() => setIsOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, 'seen');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-popup-title"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-950/30">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-[#073da5] shadow-md transition hover:scale-105 hover:bg-white"
          aria-label="Fermer la fenêtre"
        >
          ×
        </button>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#073da5] via-[#0b50bd] to-[#1686df] px-6 pb-10 pt-12 text-center text-white md:px-10">
          <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute -bottom-24 -right-14 h-60 w-60 rounded-full bg-white/15 blur-2xl" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.2em]">
              Places limitées
            </span>
            <p className="mt-6 text-sm font-bold uppercase tracking-[.22em] text-blue-100">Association Fil du Savoir</p>
            <h2 id="enrollment-popup-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Inscriptions 2026-2027 ouvertes
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-blue-50">
              Langue arabe, soutien scolaire et sciences islamiques : choisissez vos créneaux et déposez votre dossier en quelques minutes.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-[#073da5] md:text-sm">
            <div className="rounded-xl bg-blue-50 px-2 py-3">Formulaire rapide</div>
            <div className="rounded-xl bg-blue-50 px-2 py-3">Choix des cours</div>
            <div className="rounded-xl bg-blue-50 px-2 py-3">Confirmation e-mail</div>
          </div>

          <Link
            to="/inscription"
            onClick={close}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#073da5] px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#052f82]"
          >
            Je m’inscris maintenant
            <span aria-hidden="true" className="ml-2">→</span>
          </Link>
          <button type="button" onClick={close} className="mt-3 w-full py-2 text-sm font-semibold text-slate-500 transition hover:text-[#073da5]">
            Continuer à découvrir le site
          </button>
        </div>
      </div>
    </div>
  );
}
