import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [inscriptions, setInscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // ── ÉTATS POUR LA RECHERCHE ET LES FILTRES ──
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [courseFilter, setCourseFilter] = useState('tous'); // 👈 Le nouveau filtre

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      const response = await fetch('https://fil-du-savoir-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        setLoginError(data.message || 'Identifiants incorrects');
      }
    } catch (error) {
      setLoginError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const fetchInscriptions = async () => {
    setIsFetching(true);
    try {
      const response = await fetch('https://fil-du-savoir-backend.onrender.com/api/inscriptions/admin', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      if (response.ok) {
        setInscriptions(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token) fetchInscriptions();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`https://fil-du-savoir-backend.onrender.com/api/inscriptions/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setInscriptions(prev => 
          prev.map(ins => ins._id === id ? { ...ins, status: newStatus } : ins)
        );
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  // ── LOGIQUE DE FILTRAGE ET RECHERCHE MULTIPLE ──
  const filteredInscriptions = inscriptions.filter(ins => {
    // 1. Filtre par texte (nom élève ou parent)
    const matchesSearch = 
      ins.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ins.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Filtre par statut
    const matchesStatus = statusFilter === 'tous' || ins.status === statusFilter;
    
    // 3. Filtre par cours
    const matchesCourse = courseFilter === 'tous' || ins.courseType === courseFilter;

    // L'inscription doit correspondre aux 3 critères pour s'afficher
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // ── STATISTIQUES ──
  const stats = {
    total: inscriptions.length,
    valides: inscriptions.filter(i => i.status === 'validé').length,
    attente: inscriptions.filter(i => i.status === 'en attente').length,
    refuses: inscriptions.filter(i => i.status === 'refusé').length,
  };

  // ── EXPORT EXCEL (CSV) ──
  const exportToExcel = () => {
    const headers = ['Date', 'Eleve', 'Age', 'Parent', 'Telephone', 'Email', 'Type de Cours', 'Niveau', 'Horaires', 'Statut'];
    const rows = filteredInscriptions.map(ins => [
      new Date(ins.createdAt).toLocaleDateString('fr-FR'),
      `"${ins.studentName}"`, ins.studentAge, `"${ins.parentName}"`, 
      `"${ins.parentPhone}"`, `"${ins.parentEmail}"`,
      ins.courseType, `"${ins.level}"`, `"${ins.schedules.join(', ')}"`, ins.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Inscriptions_Fil_du_Savoir_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    window.print();
  };

  // ── VUE 1 : CONNEXION ──
  if (!token) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="absolute top-6 left-6 md:top-10 md:left-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0D47A1] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transition-transform group-hover:-translate-x-1"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Retour au site
          </Link>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-[#E3F2FD]/50 border border-[#E3F2FD] w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="mx-auto bg-[#F4F9FF] w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-[#E3F2FD]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-[#0D47A1]">Espace Sécurisé</h1>
            <p className="text-sm text-slate-500 mt-2">Administration Fil du Savoir</p>
          </div>
          {loginError && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#0D47A1] mb-1.5">Adresse e-mail</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-[#E3F2FD] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all placeholder:text-slate-400" placeholder="admin@fildusavoir.fr" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0D47A1] mb-1.5">Mot de passe</label>
              <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-[#E3F2FD] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full h-12 mt-2 bg-[#0D47A1] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-[#1565C0] hover:-translate-y-0.5 transition-all flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── VUE 2 : TABLEAU DE BORD ADMIN ──
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER ET BOUTONS D'ACTION */}
        <div className="print:hidden">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0D47A1] transition-colors group mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transition-transform group-hover:-translate-x-1"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Retour au site public
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[#E3F2FD] gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0D47A1]">Gestion des Inscriptions</h1>
              <p className="text-sm text-slate-500 mt-1">Gérez, filtrez et exportez vos dossiers.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button onClick={exportToExcel} className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors" title="Télécharger pour Excel">
                📊 Excel (CSV)
              </button>
              <button onClick={exportToPDF} className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors" title="Imprimer ou Sauvegarder en PDF">
                📄 PDF
              </button>
              <button onClick={fetchInscriptions} className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-[#0D47A1] bg-[#F4F9FF] border border-[#E3F2FD] rounded-xl hover:bg-[#E3F2FD] transition-colors">
                🔄 Actualiser
              </button>
              <button onClick={handleLogout} className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* CARTES DE STATISTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E3F2FD]">
            <div className="text-sm font-semibold text-slate-500 mb-1">Total dossiers</div>
            <div className="text-3xl font-extrabold text-[#0D47A1]">{stats.total}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-slate-500 mb-1">Validés</div>
            <div className="text-3xl font-extrabold text-green-600">{stats.valides}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
            <div className="text-sm font-semibold text-slate-500 mb-1">En attente</div>
            <div className="text-3xl font-extrabold text-orange-500">{stats.attente}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100">
            <div className="text-sm font-semibold text-slate-500 mb-1">Refusés</div>
            <div className="text-3xl font-extrabold text-red-600">{stats.refuses}</div>
          </div>
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="flex flex-col md:flex-row gap-4 print:hidden">
          {/* Recherche */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher un élève ou un parent..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E3F2FD] bg-white focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all shadow-sm"
            />
          </div>
          
          {/* Filtre Cours */}
          <div className="md:w-56">
            <select 
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-[#E3F2FD] bg-white text-[#0D47A1] font-semibold focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all shadow-sm cursor-pointer"
            >
              <option value="tous">📚 Tous les cours</option>
              <option value="arabe_enfant">👦 Arabe Enfants</option>
              <option value="arabe_femme">👩 Arabe Femmes</option>
              <option value="soutien">📖 Soutien Scolaire</option>
            </select>
          </div>

          {/* Filtre Statut */}
          <div className="md:w-56">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-[#E3F2FD] bg-white text-[#0D47A1] font-semibold focus:ring-2 focus:ring-[#00ACC1] outline-none transition-all shadow-sm cursor-pointer"
            >
              <option value="tous">⚪ Tous les statuts</option>
              <option value="en attente">⏳ En attente</option>
              <option value="validé">✔️ Validés</option>
              <option value="refusé">❌ Refusés</option>
            </select>
          </div>
        </div>

        {/* TITRE POUR L'IMPRESSION SEULEMENT */}
        <div className="hidden print:block mb-4">
          <h1 className="text-2xl font-bold text-black">Liste des inscriptions - Fil du Savoir</h1>
          <p className="text-sm text-gray-500">Date d'édition : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        {/* TABLE DES DONNÉES */}
        <div className="bg-white rounded-3xl print:rounded-none shadow-sm print:shadow-none border border-[#E3F2FD] print:border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap print:text-xs">
              <thead className="bg-[#F4F9FF] print:bg-gray-100 text-[#0D47A1] print:text-black border-b border-[#E3F2FD] print:border-gray-300">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wide">Date</th>
                  <th className="px-6 py-4 font-bold tracking-wide">Apprenant</th>
                  <th className="px-6 py-4 font-bold tracking-wide">Contact Parent</th>
                  <th className="px-6 py-4 font-bold tracking-wide">Cours & Choix</th>
                  <th className="px-6 py-4 font-bold tracking-wide">Statut</th>
                  <th className="px-6 py-4 font-bold tracking-wide text-right print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3F2FD] print:divide-gray-200">
                {filteredInscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center print:hidden">
                        <span className="text-4xl mb-3">📭</span>
                        <p className="font-medium text-[#0D47A1]">Aucun résultat trouvé.</p>
                      </div>
                      <span className="hidden print:block">Aucune donnée à imprimer.</span>
                    </td>
                  </tr>
                ) : (
                  filteredInscriptions.map((ins) => (
                    <tr key={ins._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-slate-500 print:text-black font-medium">
                        {new Date(ins.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-[#0D47A1] print:text-black">{ins.studentName}</div>
                        <div className="text-xs text-slate-500 print:text-gray-600 mt-0.5 flex items-center">
                          <span className="bg-[#E3F2FD] print:bg-transparent print:border print:border-gray-300 text-[#0D47A1] print:text-black px-2 py-0.5 rounded-md mr-2">{ins.studentAge} ans</span>
                          {ins.level}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 print:text-black">{ins.parentName}</div>
                        <div className="text-xs text-slate-500 print:text-gray-600 mt-0.5 flex flex-col gap-0.5">
                          <span>📞 {ins.parentPhone}</span>
                          <span>✉️ {ins.parentEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#00ACC1] print:text-black">
                          {ins.courseType === 'arabe_enfant' ? 'Arabe Enfants' : ins.courseType === 'arabe_femme' ? 'Arabe Femmes' : 'Soutien Scolaire'}
                        </div>
                        <div className="text-xs text-slate-500 print:text-gray-600 mt-1 max-w-[200px] print:max-w-none truncate print:whitespace-normal" title={ins.schedules.join(', ')}>
                          🕒 {ins.schedules.length > 0 ? ins.schedules[0] : 'Non précisé'}
                          {ins.schedules.length > 1 && ' ...'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border print:border-none print:px-0
                          ${ins.status === 'validé' ? 'bg-green-50 text-green-700 border-green-200 print:text-green-800' : 
                            ins.status === 'refusé' ? 'bg-red-50 text-red-700 border-red-200 print:text-red-800' : 
                            'bg-orange-50 text-orange-700 border-orange-200 print:text-orange-800'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 print:hidden
                            ${ins.status === 'validé' ? 'bg-green-500' : ins.status === 'refusé' ? 'bg-red-500' : 'bg-orange-500'}`}>
                          </span>
                          {ins.status === 'validé' ? 'Validé' : ins.status === 'refusé' ? 'Refusé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        {ins.status !== 'validé' && (
                          <button onClick={() => updateStatus(ins._id, 'validé')} className="inline-flex items-center px-3 py-1.5 bg-white border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow">
                            ✔️ Valider
                          </button>
                        )}
                        {ins.status !== 'refusé' && (
                          <button onClick={() => updateStatus(ins._id, 'refusé')} className="inline-flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow">
                            ❌ Refuser
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}