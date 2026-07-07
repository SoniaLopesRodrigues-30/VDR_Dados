import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient.js';
import Login from './components/Login.jsx';
import FormularioVenda from './components/FormularioVenda.jsx';
import TabelaVendas from './components/TabelaVendas.jsx';
import CadastroCliente from './components/CadastroCliente.jsx';
import CadastroServico from './components/CadastroServico.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Controla qual aba está ativa na tela: 'painel', 'clientes' ou 'servicos'
  const [abaAtiva, setAbaAtiva] = useState('painel');
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
    <div className="min-h-screen w-screen bg-gray-50 font-sans flex flex-col m-0 p-0 overflow-x-hidden text-gray-800">
      {/* Cabeçalho do Sistema com as Abas de Navegação */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-sm w-full box-border gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full sm:w-auto">
          <h1 className="text-xl font-bold text-gray-900 m-0 whitespace-nowrap">VDR Net Adm</h1>
          
          {/* Menu de Navegação Interativo */}
          <nav className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
            <button 
              type="button"
              onClick={() => setAbaAtiva('painel')}
              className={`px-4 py-2 rounded-md text-sm font-semibold border-none cursor-pointer transition-colors duration-150 ${
                abaAtiva === 'painel' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Vendas & Lançamentos
            </button>
            
            <button 
              type="button"
              onClick={() => setAbaAtiva('clientes')}
              className={`px-4 py-2 rounded-md text-sm font-semibold border-none cursor-pointer transition-colors duration-150 ${
                abaAtiva === 'clientes' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Clientes
            </button>
            
            <button 
              type="button"
              onClick={() => setAbaAtiva('servicos')}
              className={`px-4 py-2 rounded-md text-sm font-semibold border-none cursor-pointer transition-colors duration-150 ${
                abaAtiva === 'servicos' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Catálogo de Serviços
            </button>
          </nav>
        </div>

        <button 
          type="button"
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white border-none rounded-md text-sm font-semibold transition cursor-pointer w-full sm:w-auto"
        >
          Sair do Sistema
        </button>
      </header>
      
      {/* Área de Conteúdo Principal (muda conforme a aba clicada) */}
      <main className="p-6 flex-1 w-full box-border max-w-7xl mx-auto">
        {abaAtiva === 'painel' && (
          <div className="flex flex-col gap-6">
            <FormularioVenda onVendaSalva={dispararAtualizacaoTabela} />
            <TabelaVendas atualizarGatilho={atualizarTabelaGatilho} />
          </div>
        )}

        {abaAtiva === 'clientes' && (
          <div className="w-full">
            <CadastroCliente />
          </div>
        )}

        {abaAtiva === 'servicos' && (
          <div className="w-full">
            <CadastroServico />
          </div>
        )}
      </main>
    </div>
  );
}
