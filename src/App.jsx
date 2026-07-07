import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient.js';
import Login from './components/Login.jsx';
import FormularioVenda from './components/FormularioVenda.jsx';
import TabelaVendas from './components/TabelaVendas.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Gatilho para avisar a tabela para se atualizar quando o formulário salvar um dado
  const [atualizarTabelaGatilho, setAtualizarTabelaGatilho] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const dispararAtualizacaoTabela = () => {
    setAtualizarTabelaGatilho(prev => prev + 1);
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-gray-500 font-sans">
        Carregando aplicativo...
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 font-sans flex flex-col m-0 p-0 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm w-full box-border">
        <h1 className="text-xl font-bold text-gray-800 m-0">Painel Administrativo VDR Net</h1>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white border-none rounded-md text-sm font-medium transition cursor-pointer"
        >
          Sair do Sistema
        </button>
      </header>
      
      {/* Área de conteúdo do Painel */}
      <main className="p-6 flex-1 w-full box-border">
        {/* Formulário envia o aviso de sucesso */}
        <FormularioVenda onVendaSalva={dispararAtualizacaoTabela} />
        
        {/* Tabela escuta o aviso de sucesso e recarrega os dados */}
        <TabelaVendas atualizarGatilho={atualizarTabelaGatilho} />
      </main>
    </div>
  );
}
