import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function CadastroCliente() {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    const { error } = await supabase
      .from('clientes')
      .insert([{ nome, documento, telefone, email, endereco }]);

    setLoading(false);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Cliente cadastrado com sucesso!');
      setNome(''); setDocumento(''); setTelefone(''); setEmail(''); setEndereco('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Cadastro de Novo Cliente</h2>
      {mensagem && <div className="p-3 mb-4 text-sm bg-blue-50 text-blue-700 rounded font-medium">{mensagem}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome / Razão Social *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
          <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" disabled={loading} className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded cursor-pointer mt-2">
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </form>
    </div>
  );
}
