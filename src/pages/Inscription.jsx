import { useState } from 'react';
import Navigation from '../components/nav/Navigation';
import { API_URL } from '../config/api';

const COURSES = [
  { group: 'Langue arabe enfants', id: 'arabe_enfant_samedi_matin', label: 'Samedi 9h30 à 12h - niveau 1 et CP' },
  { group: 'Langue arabe enfants', id: 'arabe_enfant_dimanche_matin', label: 'Dimanche 9h30 à 12h - maternelle et CP' },
  { group: 'Langue arabe enfants', id: 'arabe_enfant_samedi_apres_midi', label: 'Samedi 14h à 16h30 - niveaux 1 à 3' },
  { group: 'Langue arabe enfants', id: 'arabe_enfant_dimanche_apres_midi', label: 'Dimanche 14h à 16h30 - niveaux 1 à 3' },
  { group: 'Langue arabe enfants', id: 'arabe_enfant_mercredi', label: 'Mercredi 14h30 à 17h - maternelle et CP' },
  { group: 'Soutien scolaire', id: 'soutien_scolaire_samedi', label: 'Samedi 16h30 à 18h30 - aide aux devoirs' },
  { group: 'Langue arabe femmes adultes', id: 'arabe_femme_vendredi', label: 'Vendredi 19h à 21h - niveau 2' },
  { group: 'Langue arabe femmes adultes', id: 'arabe_femme_dimanche', label: 'Dimanche 18h à 20h - niveau 1' },
  { group: 'Sciences islamiques jeunes adolescentes', id: 'sciences_islamiques_mardi', label: 'Mardi 18h à 20h' }
];

const EMPTY_FORM = {
  registrationType: 'inscription', childLastName: '', childFirstName: '', childGender: '',
  childBirthDate: '', childBirthPlace: '', addressStreetNumber: '', addressStreet: '',
  addressCity: '', addressPostalCode: '', fatherName: '', fatherPhone: '', fatherEmail: '',
  motherName: '', motherPhone: '', motherEmail: '', courseChoices: [],
  imageRightsInternal: null, imageRightsExternal: null, signerName: '', signatureDate: new Date().toISOString().slice(0, 10)
};

const fieldClass = 'mt-1.5 h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

export default function InscriptionPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const change = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const setConsent = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const toggleCourse = (id) => setForm((current) => ({
    ...current,
    courseChoices: current.courseChoices.includes(id)
      ? current.courseChoices.filter((choice) => choice !== id)
      : [...current.courseChoices, id]
  }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (!form.courseChoices.length) return setMessage({ type: 'error', text: 'Choisissez au moins un cours.' });
    const contactEmail = form.fatherEmail || form.motherEmail;
    if (!contactEmail) return setMessage({ type: 'error', text: 'Renseignez l’e-mail d’au moins un parent.' });
    if ((!form.fatherName || !form.fatherPhone) && (!form.motherName || !form.motherPhone)) {
      return setMessage({ type: 'error', text: 'Renseignez le nom et le téléphone d’au moins un parent.' });
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/inscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, contactEmail })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Le dossier n’a pas pu être envoyé.');
      setMessage({ type: 'success', text: data.message });
      setForm({ ...EMPTY_FORM, signatureDate: new Date().toISOString().slice(0, 10) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const groupedCourses = COURSES.reduce((groups, course) => {
    groups[course.group] = [...(groups[course.group] || []), course];
    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-[#f6f9ff] text-slate-800">
      <Navigation />
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-36 md:px-8">
        <header className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#073da5] to-[#1267d8] px-6 py-10 text-white shadow-xl shadow-blue-200 md:px-10">
          <p className="text-sm font-bold uppercase tracking-[.24em] text-blue-100">Association Fil du Savoir</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Inscriptions 2026-2027</h1>
          <p className="mt-3 max-w-2xl text-blue-50">Fiche d’inscription en ligne · places limitées</p>
        </header>

        {message && <div role="alert" className={`mb-6 rounded-2xl border p-4 font-semibold ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}>{message.text}</div>}

        <form onSubmit={submit} className="space-y-6">
          <Section title="Informations civiles">
            <div className="grid gap-5 md:grid-cols-2">
              <Choice name="registrationType" label="Type de dossier" value={form.registrationType} options={[['inscription', 'Inscription'], ['renouvellement', 'Renouvellement']]} onChange={change} />
              <Choice name="childGender" label="Sexe de l’enfant" value={form.childGender} options={[['F', 'Fille'], ['M', 'Garçon']]} onChange={change} required />
              <Field label="Nom de l’enfant" name="childLastName" value={form.childLastName} onChange={change} required />
              <Field label="Prénom de l’enfant" name="childFirstName" value={form.childFirstName} onChange={change} required />
              <Field label="Date de naissance" name="childBirthDate" type="date" value={form.childBirthDate} onChange={change} required />
              <Field label="Lieu de naissance" name="childBirthPlace" value={form.childBirthPlace} onChange={change} required />
              <Field label="N° de rue" name="addressStreetNumber" value={form.addressStreetNumber} onChange={change} />
              <Field label="Rue" name="addressStreet" value={form.addressStreet} onChange={change} required />
              <Field label="Commune" name="addressCity" value={form.addressCity} onChange={change} required />
              <Field label="Code postal" name="addressPostalCode" inputMode="numeric" value={form.addressPostalCode} onChange={change} required />
            </div>
          </Section>

          <Section title="Contact avec les parents" subtitle="Le nom et le téléphone d’au moins un parent sont obligatoires.">
            <div className="grid gap-6 md:grid-cols-2">
              <ParentFields title="Père" prefix="father" form={form} onChange={change} />
              <ParentFields title="Mère" prefix="mother" form={form} onChange={change} />
            </div>
          </Section>

          <Section title="Cours, jours et horaires souhaités" subtitle="Vous pouvez sélectionner plusieurs créneaux.">
            <div className="grid gap-5 md:grid-cols-2">
              {Object.entries(groupedCourses).map(([group, courses]) => (
                <fieldset key={group} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                  <legend className="px-2 font-extrabold text-[#073da5]">{group}</legend>
                  <div className="space-y-3 pt-2">
                    {courses.map((course) => <label key={course.id} className="flex cursor-pointer gap-3 text-sm leading-5"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#073da5]" checked={form.courseChoices.includes(course.id)} onChange={() => toggleCourse(course.id)} /><span>{course.label}</span></label>)}
                  </div>
                </fieldset>
              ))}
            </div>
          </Section>

          <Section title="Tarif et paiement">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <Price value="180 € / an" label="Cours de langues" note="+ 20 € de frais de livres" />
              <Price value="30 € / an" label="Soutien scolaire" note="Paiement par espèces, chèque ou virement" />
            </div>
          </Section>

          <Section title="Droit à l’image" subtitle="Des photos ou vidéos peuvent être réalisées pendant les activités et sorties.">
            <div className="grid gap-5 md:grid-cols-2">
              <Consent label="J’autorise la publication en interne" name="imageRightsInternal" value={form.imageRightsInternal} onChange={setConsent} />
              <Consent label="J’autorise la publication à l’extérieur" name="imageRightsExternal" value={form.imageRightsExternal} onChange={setConsent} />
            </div>
          </Section>

          <Section title="Signature">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nom et prénom du signataire" name="signerName" value={form.signerName} onChange={change} required />
              <Field label="Date" name="signatureDate" type="date" value={form.signatureDate} onChange={change} required />
            </div>
            <p className="mt-4 text-xs text-slate-500">En envoyant ce formulaire, vous certifiez l’exactitude des informations saisies.</p>
          </Section>

          <button disabled={loading} className="w-full rounded-2xl bg-[#073da5] px-6 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-[#052f82] disabled:cursor-wait disabled:opacity-60">{loading ? 'Envoi du dossier…' : 'Envoyer mon dossier'}</button>
          <p className="text-center text-sm text-slate-500">Renseignements : 06 16 23 90 58 · assofildusavoir@gmail.com</p>
        </form>
      </div>
    </main>
  );
}

function Section({ title, subtitle, children }) {
  return <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm md:p-7"><h2 className="text-xl font-black text-[#073da5]">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}<div className="mt-5">{children}</div></section>;
}
function Field({ label, ...props }) { return <label className="block text-sm font-bold text-slate-700">{label}{props.required && ' *'}<input {...props} className={fieldClass} /></label>; }
function Choice({ label, options, ...props }) { return <fieldset><legend className="text-sm font-bold text-slate-700">{label}{props.required && ' *'}</legend><div className="mt-2 flex gap-3">{options.map(([value, text]) => <label key={value} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-blue-100 p-3 text-sm"><input type="radio" {...props} value={value} checked={props.value === value} className="accent-[#073da5]" />{text}</label>)}</div></fieldset>; }
function ParentFields({ title, prefix, form, onChange }) { return <fieldset className="rounded-2xl border border-blue-100 p-4"><legend className="px-2 font-extrabold text-[#073da5]">{title}</legend><div className="space-y-4"><Field label="Nom et prénom" name={`${prefix}Name`} value={form[`${prefix}Name`]} onChange={onChange} /><Field label="Téléphone" type="tel" name={`${prefix}Phone`} value={form[`${prefix}Phone`]} onChange={onChange} /><Field label="E-mail" type="email" name={`${prefix}Email`} value={form[`${prefix}Email`]} onChange={onChange} /></div></fieldset>; }
function Consent({ label, name, value, onChange }) { return <fieldset><legend className="text-sm font-bold text-slate-700">{label} *</legend><div className="mt-2 flex gap-3">{[[true, 'Oui'], [false, 'Non']].map(([choice, text]) => <label key={text} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-blue-100 p-3 text-sm"><input type="radio" name={name} required checked={value === choice} onChange={() => onChange(name, choice)} className="accent-[#073da5]" />{text}</label>)}</div></fieldset>; }
function Price({ value, label, note }) { return <div className="rounded-2xl bg-blue-50 p-4"><div className="font-black text-[#073da5]">{label} · {value}</div><div className="mt-1 text-slate-600">{note}</div></div>; }
