'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
  const [personnels, setPersonnels] = useState<{ nom: string }[]>([]);
  const [selectedNom, setSelectedNom] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadPersonnel() {
      const { data } = await supabase.from('personnels').select('nom').order('nom');
      if (data) { setPersonnels(data); setSelectedNom(data[0]?.nom || ''); }
    }
    loadPersonnel();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from('personnels')
      .select('*')
      .eq('nom', selectedNom)
      .eq('password_text', password)
      .single();

    if (data) {
      localStorage.setItem('user_nom', data.nom);
      localStorage.setItem('user_departement', data.departement);
      
      // Ajout automatique d'une ligne d'audit pour l'utilisateur Root
      await supabase.from('visiteurs_logs').insert({ nom_visiteur: data.nom });
      
      router.push('/dashboard');
    } else {
      setError('Clef d’authentification ou identifiant incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-6 border border-gray-100">
        
        {/* Affichage du logo .jpeg positionné dans le répertoire /public */}
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
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Collaborateur</label>
          <select value={selectedNom} onChange={(e) => setSelectedNom(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 text-sm font-medium text-gray-700">
            {personnels.map(p => <option key={p.nom} value={p.nom}>{p.nom}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mot de Passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm">
          Se connecter
        </button>
      </form>
    </div>
  );
}