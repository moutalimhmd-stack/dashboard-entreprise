'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Nettoyage de la saisie (retire les espaces accidentels)
    const usernameClean = identifiant.trim();
    const passwordClean = password.trim();

    console.log("Tentative de connexion avec l'identifiant :", `"${usernameClean}"`);

    try {
      // 2. Requête Supabase
      const { data, error: supabaseError } = await supabase
        .from('personnels')
        .select('*')
        .eq('nom', usernameClean)
        .eq('password_text', passwordClean)
        .maybeSingle(); // Évite les crashs si plusieurs lignes ou aucune ne correspondent

      if (supabaseError) {
        console.error("Erreur de communication Supabase :", supabaseError);
        setError("Erreur technique de communication avec la base de données.");
        setLoading(false);
        return;
      }

      console.log("Réponse reçue de Supabase :", data);

      if (data) {
        // Sauvegarde des données de session locale
        localStorage.setItem('user_nom', data.nom);
        localStorage.setItem('user_departement', data.departement);
        
        // Journalisation de la visite
        await supabase.from('visiteurs_logs').insert({ nom_visiteur: data.nom });
        
        // Redirection vers le tableau de bord
        router.push('/dashboard');
      } else {
        setError('Identifiant ou mot de passe incorrect (Vérifiez les majuscules).');
      }
    } catch (err) {
      console.error("Erreur inattendue :", err);
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-6 border border-gray-100">
        
        <div className="flex justify-center">
          <Image 
            src="/logo.jpeg" 
            alt="Logo de l'Entreprise" 
            width={140} 
            height={70} 
            className="object-contain"
            priority
          />
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 tracking-tight">Portail Décisionnel</h2>
        {error && <div className="text-red-600 bg-red-50 p-2.5 rounded-xl text-xs text-center font-medium">{error}</div>}
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Identifiant</label>
          <input 
            type="text"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            placeholder="Ex: root ou personnel"
            required 
            disabled={loading}
            className="w-full p-3 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mot de Passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={loading}
            className="w-full p-3 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm disabled:bg-blue-400"
        >
          {loading ? 'Vérification...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}