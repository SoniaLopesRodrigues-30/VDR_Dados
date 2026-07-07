import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { RefreshCw, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TabelaVendas({ atualizarGatilho }) {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);

  // Função para buscar as vendas do banco de dados
  const buscarVendas = async () => {
    setLoading(true);
    
    // Faz o "JOIN" trazendo os dados da venda + o nome do cliente + o nome do serviço
    const { data, error } = await supabase
      .from('vendas_pedidos')
      .select(`
        id,
        data,
        quantidade,
        valor_unitario_aplicado,
        total,
        condicao_pagamento,
        status,
        observacao,
        clientes ( nome ),
        servicos ( nome, ncm )
      `)
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vendas:', error.message);
    } else {
      setVendas(data || []);
      
      // Calcula a soma de todas as vendas cadastradas
      const totalAcumulado = (data || []).reduce((acc, item) => acc + (item.total || 0), 0);
      setFaturamentoTotal(totalAcumulado);
    }
    setLoading(false);
  };

  // Recarrega os dados sempre que a página abre ou quando uma nova venda é adicionada
  useEffect(() => {
    buscarVendas();
  }, [atualizarGatilho]);

  // Função auxiliar para colorir as etiquetas de status
  const obterEstiloStatus = (status) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
      case 'Faturado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pendente
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      
      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white shadow">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium opacity-90">Faturamento Bruto</span>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <div className="text-2xl font-bold mt-1">R$ {faturamentoTotal.toFixed(2)}</div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-500">Pedidos Efetuados</span>
            <div className="text-2xl font-bold text-gray-800 mt-1">{vendas.length}</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500 opacity-60" />
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-500">Aguardando Pagamento</span>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {vendas.filter(v => v.status === 'Pendente').length}
            </div>
          </div>
          <Clock className="w-8 h-8 text-yellow-500 opacity-60" />
        </div>
      </div>

      {/* Cabeçalho da Tabela */}
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h3 className="text-lg font-bold text-gray-800">Histórico de Vendas e Serviços</h3>
        <button 
          onClick={buscarVendas}
          className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded border border-gray-300 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Estrutura da Tabela HTML */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Carregando dados da tabela...</div>
      ) : vendas.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">Nenhum serviço ou venda lançado ainda.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="p-3">Data</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Serviço / NCM</th>
                <th className="p-3 text-center">Qtd</th>
                <th className="p-3">Unitário</th>
                <th className="p-3">Total Geral</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {vendas.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(venda.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3 font-medium text-gray-900">
                    {venda.clientes?.nome || 'Cliente não encontrado'}
                  </td>
                  <td className="p-3">
                    <div>{venda.servicos?.nome || 'Serviço excluído'}</div>
                    {venda.servicos?.ncm && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        NCM: {venda.servicos.ncm}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-medium">{venda.quantidade}</td>
                  <td className="p-3">R$ {venda.valor_unitario_aplicado.toFixed(2)}</td>
                  <td className="p-3 font-bold text-gray-900">R$ {venda.total?.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${obterEstiloStatus(venda.status)}`}>
                      {venda.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
