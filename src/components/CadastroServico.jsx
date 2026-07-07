import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function CadastroServico() {
  const [nome, setNome] = useState('');
  const [ncm, setNcm] = useState('');
  const [valorUnitario, setValorUnitario] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    const { error } = await supabase
      .from('servicos')
      .insert([{ nome, ncm, valor_unitario: parseFloat(valorUnitario) }]);

    setLoading(false);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Serviço cadastrado com sucesso!');
      setNome(''); setNcm(''); setValorUnitario(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Adicionar Serviço ao Catálogo</h2>
      {mensagem && <div className="p-3 mb-4 text-sm bg-emerald-50 text-emerald-700 rounded font-medium">{mensagem}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código NCM</label>
          <input type="text" value={ncm} onChange={(e) => setNcm(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário Padrão (R$) *</label>
          <input type="number" step="0.01" value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" disabled={loading} className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer mt-2">
          {loading ? 'Salvando...' : 'Cadastrar no Catálogo'}
        </button>
      </form>
    </div>
  );
}
