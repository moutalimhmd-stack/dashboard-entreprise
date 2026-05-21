'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
  // Remplacement de la liste par un champ de texte classique (String vide au départ)
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Requête directe avec l'identifiant tapé par l'utilisateur (sensible à la casse)
    const { data } = await supabase
      .from('personnels')
      .select('*')
      .eq('nom', identifiant.trim())
      .eq('password_text', password)
      .single();

    if (data) {
      localStorage.setItem('user_nom', data.nom);
      localStorage.setItem('user_departement', data.departement);
      
      // Ajout automatique dans les logs d'audit
      await supabase.from('visiteurs_logs').insert({ nom_visiteur: data.nom });
      
      router.push('/dashboard');
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-6 border border-gray-100">
        
        {/* Logo de l'entreprise au format JPEG */}
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
        
        {/* Remplacement du <select> par un <input> textuel classique */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Identifiant</label>
          <input 
            type="text"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            placeholder="Ex: Root ou personnel"
            required 
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
            className="w-full p-3 border rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm">
          Se connecter
        </button>
      </form>
    </div>
  );
}