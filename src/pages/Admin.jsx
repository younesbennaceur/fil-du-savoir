import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const COURSE_LABELS = {
  arabe_enfant_samedi_matin: 'Arabe enfants · sam. 9h30-12h',
  arabe_enfant_dimanche_matin: 'Arabe enfants · dim. 9h30-12h',
  arabe_enfant_samedi_apres_midi: 'Arabe enfants · sam. 14h-16h30',
  arabe_enfant_dimanche_apres_midi: 'Arabe enfants · dim. 14h-16h30',
  arabe_enfant_mercredi: 'Arabe enfants · mer. 14h30-17h',
  soutien_scolaire_samedi: 'Soutien scolaire · sam. 16h30-18h30',
  arabe_femme_vendredi: 'Arabe femmes · ven. 19h-21h',
  arabe_femme_dimanche: 'Arabe femmes · dim. 18h-20h',
  sciences_islamiques_mardi: 'Sciences islamiques · mar. 18h-20h'
};
const STATUS = {
  en_attente: ['En attente', 'bg-amber-100 text-amber-800'],
  valide: ['Validé', 'bg-emerald-100 text-emerald-800'],
  refuse: ['Refusé', 'bg-red-100 text-red-800']
};
const normalizeStatus = (status) => ({ 'en attente': 'en_attente', 'validé': 'valide', 'refusé': 'refuse' }[status] || status || 'en_attente');
const childName = (item) => item.childFirstName ? `${item.childFirstName} ${item.childLastName}` : item.studentName || 'Sans nom';
const courses = (item) => item.courseChoices?.length ? item.courseChoices.map((id) => COURSE_LABELS[id] || id) : item.schedules || [item.courseType || 'Non précisé'];

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [items, setItems] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [expanded, setExpanded] = useState(null);

  const logout = () => { localStorage.removeItem('adminToken'); setToken(''); setItems([]); };
  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { 'x-auth-token': token } : {}), ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) logout();
    if (!response.ok) throw new Error(data.message || 'Une erreur est survenue.');
    return data;
  };

  const login = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('');
    try {
      const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('adminToken', data.token); setToken(data.token);
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };
  const load = async () => {
    setLoading(true); setMessage('');
    try { setItems(await request('/api/inscriptions/admin')); } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };
  useEffect(() => {
    if (token) load();
    // load dépend du jeton courant et ne doit être relancé qu'à son changement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const visible = useMemo(() => items.filter((item) => {
    const haystack = `${childName(item)} ${item.fatherName || item.parentName || ''} ${item.motherName || ''} ${item.contactEmail || item.parentEmail || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (filter === 'tous' || normalizeStatus(item.status) === filter);
  }), [items, search, filter]);

  const updateStatus = async (id, status) => {
    setMessage('');
    try {
      const data = await request(`/api/inscriptions/admin/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      setItems((current) => current.map((item) => item._id === id ? data.inscription : item));
      setMessage(data.emailStatus?.sent ? 'Statut mis à jour et e-mail envoyé.' : `Statut mis à jour. E-mail non envoyé${data.emailStatus?.reason ? ` : ${data.emailStatus.reason}` : '.'}`);
    } catch (error) { setMessage(error.message); }
  };

  const exportCsv = () => {
    const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = visible.map((item) => [new Date(item.createdAt).toLocaleDateString('fr-FR'), childName(item), item.registrationType, item.fatherName, item.fatherPhone, item.fatherEmail, item.motherName, item.motherPhone, item.motherEmail, courses(item).join(' | '), normalizeStatus(item.status)].map(quote).join(';'));
    const header = ['Date', 'Enfant', 'Type', 'Père', 'Téléphone père', 'Email père', 'Mère', 'Téléphone mère', 'Email mère', 'Cours', 'Statut'].map(quote).join(';');
    const url = URL.createObjectURL(new Blob([`\uFEFF${header}\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'inscriptions-2026-2027.csv'; link.click(); URL.revokeObjectURL(url);
  };

  if (!token) return <Login email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={login} loading={loading} message={message} />;

  const stats = Object.fromEntries(['en_attente', 'valide', 'refuse'].map((status) => [status, items.filter((item) => normalizeStatus(item.status) === status).length]));
  return (
    <main className="min-h-screen bg-[#f6f9ff] p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-[#073da5] p-6 text-white shadow-xl md:flex md:items-center md:justify-between">
          <div><Link to="/" className="text-sm text-blue-100 hover:text-white">← Retour au site</Link><h1 className="mt-2 text-3xl font-black">Inscriptions 2026-2027</h1></div>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-0"><button onClick={load} className="rounded-xl bg-white/15 px-4 py-2 font-bold">Actualiser</button><button onClick={exportCsv} className="rounded-xl bg-white px-4 py-2 font-bold text-[#073da5]">Exporter CSV</button><button onClick={logout} className="rounded-xl bg-red-500 px-4 py-2 font-bold">Déconnexion</button></div>
        </header>
        {message && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900">{message}</div>}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Stat label="Total" value={items.length} /><Stat label="En attente" value={stats.en_attente} /><Stat label="Validés" value={stats.valide} /><Stat label="Refusés" value={stats.refuse} /></div>
        <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[1fr_240px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un enfant ou un parent…" className="h-11 rounded-xl border border-blue-100 px-4 outline-none focus:ring-4 focus:ring-blue-100" />
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 rounded-xl border border-blue-100 px-4"><option value="tous">Tous les statuts</option><option value="en_attente">En attente</option><option value="valide">Validés</option><option value="refuse">Refusés</option></select>
        </div>
        {loading && <p className="text-center font-semibold text-slate-500">Chargement…</p>}
        <div className="space-y-3">{visible.map((item) => <Dossier key={item._id} item={item} open={expanded === item._id} toggle={() => setExpanded(expanded === item._id ? null : item._id)} update={updateStatus} />)}{!loading && !visible.length && <div className="rounded-3xl bg-white p-12 text-center text-slate-500">Aucun dossier trouvé.</div>}</div>
      </div>
    </main>
  );
}

function Login({ email, password, setEmail, setPassword, submit, loading, message }) { return <main className="flex min-h-screen items-center justify-center bg-[#f6f9ff] p-4"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><Link to="/" className="text-sm text-slate-500">← Retour au site</Link><h1 className="mt-5 text-2xl font-black text-[#073da5]">Espace administration</h1>{message && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}<label className="mt-6 block text-sm font-bold">E-mail<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-blue-100 px-3" /></label><label className="mt-4 block text-sm font-bold">Mot de passe<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-blue-100 px-3" /></label><button disabled={loading} className="mt-6 w-full rounded-xl bg-[#073da5] py-3 font-bold text-white">{loading ? 'Connexion…' : 'Se connecter'}</button></form></main>; }
function Stat({ label, value }) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-1 text-3xl font-black text-[#073da5]">{value}</div></div>; }
function Dossier({ item, open, toggle, update }) {
  const status = normalizeStatus(item.status); const [label, color] = STATUS[status] || STATUS.en_attente;
  return <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><button onClick={toggle} className="grid w-full items-center gap-3 p-5 text-left md:grid-cols-[1.2fr_1fr_1fr_auto]"><div><div className="font-black text-[#073da5]">{childName(item)}</div><div className="text-xs text-slate-500">{item.registrationType === 'renouvellement' ? 'Renouvellement' : 'Inscription'} · {new Date(item.createdAt).toLocaleDateString('fr-FR')}</div></div><div className="text-sm">{item.contactEmail || item.parentEmail}</div><div className="text-sm text-slate-500">{courses(item)[0]}</div><span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{label}</span></button>{open && <div className="border-t border-blue-100 bg-blue-50/40 p-5"><div className="grid gap-5 text-sm md:grid-cols-3"><Info title="Enfant" lines={[`Né(e) le ${item.childBirthDate ? new Date(item.childBirthDate).toLocaleDateString('fr-FR') : '—'} à ${item.childBirthPlace || '—'}`, `${item.addressStreetNumber || ''} ${item.addressStreet || item.parentAddress || ''}`, `${item.addressPostalCode || ''} ${item.addressCity || ''}`]} /><Info title="Parents" lines={[`Père : ${item.fatherName || item.parentName || '—'} · ${item.fatherPhone || item.parentPhone || '—'}`, item.fatherEmail || item.parentEmail, `Mère : ${item.motherName || '—'} · ${item.motherPhone || '—'}`, item.motherEmail]} /><Info title="Choix" lines={courses(item)} /><Info title="Droit à l’image" lines={[`Interne : ${item.imageRightsInternal === true ? 'Oui' : item.imageRightsInternal === false ? 'Non' : '—'}`, `Extérieur : ${item.imageRightsExternal === true ? 'Oui' : item.imageRightsExternal === false ? 'Non' : '—'}`]} /><Info title="Signature" lines={[item.signerName || item.signature || '—', item.signatureDate ? new Date(item.signatureDate).toLocaleDateString('fr-FR') : '—']} /><Info title="E-mail initial" lines={[item.emailStatus || 'ancien dossier', item.emailError]} /></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => update(item._id, 'valide')} className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white">Valider et notifier</button><button onClick={() => update(item._id, 'refuse')} className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white">Refuser et notifier</button><button onClick={() => update(item._id, 'en_attente')} className="rounded-xl bg-amber-100 px-4 py-2 font-bold text-amber-900">Remettre en attente</button></div></div>}</article>;
}
function Info({ title, lines }) { return <div><h3 className="font-black text-[#073da5]">{title}</h3><div className="mt-1 space-y-1 text-slate-600">{lines.filter(Boolean).map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}</div></div>; }
