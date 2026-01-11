
import React, { useState } from 'react';

interface Props {
  onCreate: (name: string) => void;
}

const ProfileCreation: React.FC<Props> = ({ onCreate }) => {
  const [name, setName] = useState('');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-system mb-8 text-blue-400 border-b border-blue-900/50 pb-2">CRIAÇÃO DE PERFIL</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase font-system text-slate-500 mb-2 tracking-widest">NOME DO HUNTER</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white font-system focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          
          <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-sm text-slate-400">
            <p><strong>Aviso do Sistema:</strong> Após a criação, você passará pelo processo de Awakening. Seu Rank inicial será determinado aleatoriamente pelo potencial latente.</p>
          </div>

          <button 
            disabled={!name.trim()}
            onClick={() => onCreate(name)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-system font-bold rounded-lg transition-all"
          >
            CONFIRMAR PERFIL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
