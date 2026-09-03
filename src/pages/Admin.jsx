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
  en_attente: { label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  valide: { label: 'Validé', color: 'bg-emerald-100 text-emerald-800' },
  refuse: { label: 'Refusé', color: 'bg-red-100 text-red-800' }
};

const PAYMENT = {
  non_paye: { label: 'Pas encore payé', short: 'Non payé', color: 'bg-orange-100 text-orange-800' },
  especes: { label: 'Payé en espèces', short: 'Espèces', color: 'bg-emerald-100 text-emerald-800' },
  cheque: { label: 'Payé par chèque', short: 'Chèque', color: 'bg-emerald-100 text-emerald-800' },
  virement: { label: 'Payé par virement', short: 'Virement', color: 'bg-emerald-100 text-emerald-800' },
  carte_en_ligne: { label: 'Payé par carte en ligne', short: 'Carte en ligne', color: 'bg-emerald-100 text-emerald-800' }
};

const normalizeStatus = (status) => ({
  'en attente': 'en_attente',
  'validé': 'valide',
  'refusé': 'refuse'
}[status] || status || 'en_attente');

const normalizePayment = (status) => PAYMENT[status] ? status : 'non_paye';
const isPaid = (item) => normalizePayment(item.paymentStatus) !== 'non_paye';
const childName = (item) => item.childFirstName
  ? `${item.childFirstName} ${item.childLastName || ''}`.trim()
  : item.studentName || 'Sans nom';
const courses = (item) => item.courseChoices?.length
  ? item.courseChoices.map((id) => COURSE_LABELS[id] || id)
  : item.schedules || [item.courseType || 'Non précisé'];
const formatDate = (date) => {
  if (!date) return '—';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('fr-FR');
};

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [items, setItems] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [paymentFilter, setPaymentFilter] = useState('tous');
  const [expanded, setExpanded] = useState(null);

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setItems([]);
  };

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-auth-token': token } : {}),
        ...options.headers
      }
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) logout();
    if (!response.ok) throw new Error(data.message || 'Une erreur est survenue.');
    return data;
  };

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      setItems(await request('/api/inscriptions/admin'));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // Le chargement doit être relancé uniquement quand le jeton change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const visible = useMemo(() => items.filter((item) => {
    const haystack = `${childName(item)} ${item.fatherName || item.parentName || ''} ${item.motherName || ''} ${item.contactEmail || item.parentEmail || ''}`.toLowerCase();
    const dossierMatches = filter === 'tous' || normalizeStatus(item.status) === filter;
    const paymentMatches = paymentFilter === 'tous'
      || (paymentFilter === 'paye' ? isPaid(item) : normalizePayment(item.paymentStatus) === paymentFilter);
    return haystack.includes(search.trim().toLowerCase()) && dossierMatches && paymentMatches;
  }), [items, search, filter, paymentFilter]);

  const updateStatus = async (id, status) => {
    setBusyId(`${id}:status`);
    setMessage(null);
    try {
      const data = await request(`/api/inscriptions/admin/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setItems((current) => current.map((item) => item._id === id ? data.inscription : item));
      setMessage({
        type: data.emailStatus?.sent ? 'success' : 'warning',
        text: data.emailStatus?.sent
          ? 'Statut du dossier mis à jour et e-mail envoyé.'
          : `Statut mis à jour. E-mail non envoyé${data.emailStatus?.reason ? ` : ${data.emailStatus.reason}` : '.'}`
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusyId('');
    }
  };

  const updatePayment = async (id, paymentStatus, paymentNote) => {
    setBusyId(`${id}:payment`);
    setMessage(null);
    try {
      const data = await request(`/api/inscriptions/admin/${id}/payment`, {
        method: 'PUT',
        body: JSON.stringify({ paymentStatus, paymentNote })
      });
      setItems((current) => current.map((item) => item._id === id ? data.inscription : item));
      setMessage({ type: 'success', text: 'Paiement enregistré dans le dossier.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusyId('');
    }
  };

  const downloadPdf = async (item) => {
    setBusyId(`${item._id}:pdf`);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/api/inscriptions/admin/${item._id}/pdf`, {
        headers: { 'x-auth-token': token }
      });
      if (response.status === 401) logout();
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Le PDF n’a pas pu être généré.');
      }
      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') || '';
      const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1]
        || `recapitulatif-${childName(item).replace(/\s+/g, '-').toLowerCase()}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: `PDF de ${childName(item)} téléchargé.` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusyId('');
    }
  };

  const exportCsv = () => {
    const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = visible.map((item) => [
      formatDate(item.createdAt), childName(item), item.registrationType,
      item.fatherName, item.fatherPhone, item.fatherEmail,
      item.motherName, item.motherPhone, item.motherEmail,
      courses(item).join(' | '), STATUS[normalizeStatus(item.status)]?.label,
      PAYMENT[normalizePayment(item.paymentStatus)].label, item.paymentNote,
      formatDate(item.paymentUpdatedAt)
    ].map(quote).join(';'));
    const header = [
      'Date', 'Enfant', 'Type', 'Père', 'Téléphone père', 'Email père',
      'Mère', 'Téléphone mère', 'Email mère', 'Cours', 'Statut dossier',
      'Paiement', 'Note paiement', 'Date paiement'
    ].map(quote).join(';');
    const url = URL.createObjectURL(new Blob([`\uFEFF${header}\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inscriptions-2026-2027.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return <Login email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={login} loading={loading} message={message} />;
  }

  const stats = {
    enAttente: items.filter((item) => normalizeStatus(item.status) === 'en_attente').length,
    valides: items.filter((item) => normalizeStatus(item.status) === 'valide').length,
    refuses: items.filter((item) => normalizeStatus(item.status) === 'refuse').length,
    payes: items.filter(isPaid).length,
    nonPayes: items.filter((item) => !isPaid(item)).length
  };

  return (
    <main className="min-h-screen bg-[#f4f7fc] p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#073da5] to-[#1267d8] p-6 text-white shadow-xl shadow-blue-200 md:flex md:items-center md:justify-between md:p-8">
          <div>
            <Link to="/" className="text-sm font-semibold text-blue-100 hover:text-white">← Retour au site</Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-blue-100">Association Fil du Savoir</p>
            <h1 className="mt-1 text-3xl font-black">Pilotage des inscriptions</h1>
            <p className="mt-2 text-sm text-blue-100">Dossiers, paiements et documents 2026-2027</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 md:mt-0">
            <button type="button" onClick={load} disabled={loading} className="rounded-xl bg-white/15 px-4 py-2.5 font-bold transition hover:bg-white/25 disabled:opacity-60">{loading ? 'Actualisation…' : 'Actualiser'}</button>
            <button type="button" onClick={exportCsv} className="rounded-xl bg-white px-4 py-2.5 font-bold text-[#073da5] transition hover:bg-blue-50">Exporter CSV</button>
            <button type="button" onClick={logout} className="rounded-xl bg-red-500 px-4 py-2.5 font-bold transition hover:bg-red-600">Déconnexion</button>
          </div>
        </header>

        {message && <Notice message={message} />}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Stat label="Total" value={items.length} />
          <Stat label="En attente" value={stats.enAttente} tone="amber" />
          <Stat label="Validés" value={stats.valides} tone="green" />
          <Stat label="Refusés" value={stats.refuses} tone="red" />
          <Stat label="Payés" value={stats.payes} tone="green" />
          <Stat label="Non payés" value={stats.nonPayes} tone="orange" />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un enfant, un parent ou un e-mail…" className="h-11 rounded-xl border border-blue-100 px-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-white px-4">
              <option value="tous">Tous les dossiers</option>
              <option value="en_attente">En attente</option>
              <option value="valide">Validés</option>
              <option value="refuse">Refusés</option>
            </select>
            <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-white px-4">
              <option value="tous">Tous les paiements</option>
              <option value="non_paye">Non payés</option>
              <option value="paye">Tous les payés</option>
              <option value="especes">Espèces</option>
              <option value="cheque">Chèque</option>
              <option value="virement">Virement</option>
              <option value="carte_en_ligne">Carte en ligne</option>
            </select>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">{visible.length} dossier{visible.length > 1 ? 's' : ''} affiché{visible.length > 1 ? 's' : ''}</p>
        </section>

        {loading && <p className="py-3 text-center font-semibold text-slate-500">Chargement des dossiers…</p>}
        <div className="space-y-3">
          {visible.map((item) => (
            <Dossier
              key={item._id}
              item={item}
              open={expanded === item._id}
              toggle={() => setExpanded(expanded === item._id ? null : item._id)}
              updateStatus={updateStatus}
              updatePayment={updatePayment}
              downloadPdf={downloadPdf}
              busyId={busyId}
            />
          ))}
          {!loading && !visible.length && <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">Aucun dossier ne correspond aux filtres.</div>}
        </div>
      </div>
    </main>
  );
}

function Login({ email, password, setEmail, setPassword, submit, loading, message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fc] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-8 shadow-xl">
        <Link to="/" className="text-sm text-slate-500">← Retour au site</Link>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-blue-500">Fil du Savoir</p>
        <h1 className="mt-1 text-2xl font-black text-[#073da5]">Espace administration</h1>
        {message && <Notice message={message} />}
        <label className="mt-6 block text-sm font-bold">E-mail
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" className="mt-1.5 h-11 w-full rounded-xl border border-blue-100 px-3 outline-none focus:ring-4 focus:ring-blue-100" />
        </label>
        <label className="mt-4 block text-sm font-bold">Mot de passe
          <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-1.5 h-11 w-full rounded-xl border border-blue-100 px-3 outline-none focus:ring-4 focus:ring-blue-100" />
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#073da5] py-3 font-bold text-white transition hover:bg-[#052f82] disabled:opacity-60">{loading ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </main>
  );
}

function Notice({ message }) {
  const colors = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    error: 'border-red-200 bg-red-50 text-red-700'
  };
  return <div role="status" className={`mt-4 rounded-2xl border p-4 text-sm font-semibold ${colors[message.type] || 'border-blue-200 bg-blue-50 text-blue-900'}`}>{message.text}</div>;
}

function Stat({ label, value, tone = 'blue' }) {
  const colors = {
    blue: 'text-[#073da5]', amber: 'text-amber-700', green: 'text-emerald-700',
    red: 'text-red-700', orange: 'text-orange-700'
  };
  return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div><div className={`mt-1 text-3xl font-black ${colors[tone]}`}>{value}</div></div>;
}

function Dossier({ item, open, toggle, updateStatus, updatePayment, downloadPdf, busyId }) {
  const status = normalizeStatus(item.status);
  const payment = normalizePayment(item.paymentStatus);
  const [paymentDraft, setPaymentDraft] = useState(payment);
  const [noteDraft, setNoteDraft] = useState(item.paymentNote || '');
  const statusBusy = busyId === `${item._id}:status`;
  const paymentBusy = busyId === `${item._id}:payment`;
  const pdfBusy = busyId === `${item._id}:pdf`;

  useEffect(() => {
    setPaymentDraft(normalizePayment(item.paymentStatus));
    setNoteDraft(item.paymentNote || '');
  }, [item.paymentStatus, item.paymentNote]);

  return (
    <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:shadow-md">
      <button type="button" onClick={toggle} aria-expanded={open} className="grid w-full items-center gap-3 p-5 text-left md:grid-cols-[1.2fr_1fr_1fr_auto_auto]">
        <div>
          <div className="font-black text-[#073da5]">{childName(item)}</div>
          <div className="text-xs text-slate-500">{item.registrationType === 'renouvellement' ? 'Renouvellement' : 'Inscription'} · {formatDate(item.createdAt)}</div>
        </div>
        <div className="truncate text-sm">{item.contactEmail || item.parentEmail || 'Sans e-mail'}</div>
        <div className="truncate text-sm text-slate-500">{courses(item)[0]}</div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${STATUS[status]?.color || STATUS.en_attente.color}`}>{STATUS[status]?.label || 'En attente'}</span>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${PAYMENT[payment].color}`}>{PAYMENT[payment].short}</span>
      </button>

      {open && (
        <div className="border-t border-blue-100 bg-blue-50/40 p-5 md:p-6">
          {status === 'valide' && isPaid(item) && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">✓ Dossier complet : inscription validée et paiement enregistré.</div>}

          <div className="grid gap-5 text-sm md:grid-cols-3">
            <Info title="Enfant" lines={[
              `Né(e) le ${formatDate(item.childBirthDate)} à ${item.childBirthPlace || '—'}`,
              `${item.addressStreetNumber || ''} ${item.addressStreet || item.parentAddress || ''}`.trim(),
              `${item.addressPostalCode || ''} ${item.addressCity || ''}`.trim()
            ]} />
            <Info title="Parents" lines={[
              `Père : ${item.fatherName || item.parentName || '—'} · ${item.fatherPhone || item.parentPhone || '—'}`,
              item.fatherEmail || item.parentEmail,
              `Mère : ${item.motherName || '—'} · ${item.motherPhone || '—'}`,
              item.motherEmail
            ]} />
            <Info title="Choix" lines={courses(item)} />
            <Info title="Droit à l’image" lines={[
              `Interne : ${item.imageRightsInternal === true ? 'Oui' : item.imageRightsInternal === false ? 'Non' : '—'}`,
              `Extérieur : ${item.imageRightsExternal === true ? 'Oui' : item.imageRightsExternal === false ? 'Non' : '—'}`
            ]} />
            <Info title="Signature" lines={[item.signerName || item.signature || '—', formatDate(item.signatureDate)]} />
            <Info title="E-mail initial" lines={[item.emailStatus || 'ancien dossier', item.emailError]} />
          </div>

          <section className="mt-6 rounded-2xl border border-blue-100 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-[#073da5]">Suivi du paiement</h3>
                <p className="mt-1 text-xs text-slate-500">Dernière mise à jour : {formatDate(item.paymentUpdatedAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${PAYMENT[payment].color}`}>{PAYMENT[payment].label}</span>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[260px_1fr_auto]">
              <select value={paymentDraft} onChange={(event) => setPaymentDraft(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-white px-3">
                {Object.entries(PAYMENT).map(([value, details]) => <option key={value} value={value}>{details.label}</option>)}
              </select>
              <input value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} maxLength={200} placeholder="Note interne facultative (référence, date, remise…)" className="h-11 rounded-xl border border-blue-100 px-3 outline-none focus:ring-4 focus:ring-blue-100" />
              <button type="button" disabled={paymentBusy || (paymentDraft === payment && noteDraft === (item.paymentNote || ''))} onClick={() => updatePayment(item._id, paymentDraft, noteDraft)} className="rounded-xl bg-[#073da5] px-5 py-2.5 font-bold text-white transition hover:bg-[#052f82] disabled:cursor-not-allowed disabled:opacity-50">{paymentBusy ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </section>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => updateStatus(item._id, 'valide')} disabled={statusBusy} className="rounded-xl bg-emerald-600 px-4 py-2.5 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">Valider et notifier</button>
            <button type="button" onClick={() => updateStatus(item._id, 'refuse')} disabled={statusBusy} className="rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white transition hover:bg-red-700 disabled:opacity-50">Refuser et notifier</button>
            <button type="button" onClick={() => updateStatus(item._id, 'en_attente')} disabled={statusBusy} className="rounded-xl bg-amber-100 px-4 py-2.5 font-bold text-amber-900 transition hover:bg-amber-200 disabled:opacity-50">Remettre en attente</button>
            <button type="button" onClick={() => downloadPdf(item)} disabled={pdfBusy} className="rounded-xl border-2 border-[#073da5] bg-white px-4 py-2 font-bold text-[#073da5] transition hover:bg-blue-50 disabled:opacity-50">{pdfBusy ? 'Création du PDF…' : 'Télécharger le récapitulatif PDF'}</button>
          </div>
        </div>
      )}
    </article>
  );
}

function Info({ title, lines }) {
  return <div><h3 className="font-black text-[#073da5]">{title}</h3><div className="mt-1 space-y-1 text-slate-600">{lines.filter(Boolean).map((line, index) => <div key={`${title}-${index}`}>{line}</div>)}</div></div>;
}
