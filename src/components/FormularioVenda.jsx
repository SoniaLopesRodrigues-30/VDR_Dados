import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function FormularioVenda({ onVendaSalva }) {
  // Estados para carregar as opções do banco
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);

  // Estados dos campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(0);
  const [ncm, setNcm] = useState('');
  const [condicaoPagamento, setCondicaoPagamento] = useState('À Vista');
  const [status, setStatus] = useState('Pendente');
  const [observacao, setObservacao] = useState('');

  // Estados de controle da interface
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // 1. Carrega dados de clientes e serviços ao abrir a tela
  useEffect(() => {
    async function carregarDados() {
      const { data: listaClientes } = await supabase.from('clientes').select('id, nome');
      const { data: listaServicos } = await supabase.from('servicos').select('*');
      
      if (listaClientes) setClientes(listaClientes);
      if (listaServicos) setServicos(listaServicos);
    }
    carregarDados();
  }, []);

  // 2. Quando o usuário escolhe um serviço, preenche o valor unitário e o NCM padrão automaticamente
  const handleServicoChange = (id) => {
    setServicoId(id);
    const servicoSelecionado = servicos.find(s => s.id === id);
    if (servicoSelecionado) {
      setValorUnitario(servicoSelecionado.valor_unitario);
      setNcm(servicoSelecionado.ncm || '');
    }
  };

  // 3. Salva a venda no banco de dados do Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteId || !servicoId) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, selecione um cliente e um serviço.' });
      return;
    }

    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    const { data, error } = await supabase
      .from('vendas_pedidos')
      .insert([
        {
          cliente_id: clienteId,
          servico_id: servicoId,
          quantidade: parseInt(quantidade),
          valor_unitario_aplicado: parseFloat(valorUnitario),
          condicao_pagamento: condicaoPagamento,
          status: status,
          observacao: observacao
        }
      ]);

    setLoading(false);

    if (error) {
      setMensagem({ tipo: 'erro', texto: `Erro ao salvar: ${error.message}` });
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Venda/Serviço lançado com sucesso!' });
      // Limpa os campos opcionais
      setObservacao('');
      setQuantidade(1);
      if (onVendaSalva) onVendaSalva();
    }
  };

  // Cálculo do total em tempo real na tela
  const valorTotal = (quantidade * valorUnitario).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
        Lançamento de Venda / Serviço
      </h2>

      {mensagem.texto && (
        <div className={`p-4 mb-4 rounded-md flex items-center gap-2 text-sm font-medium ${
          mensagem.tipo === 'erro' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {mensagem.tipo === 'erro' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CLIENTE */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Selecione o Cliente --</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>

        {/* SERVIÇO */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Serviço / Produto *</label>
          <select
            value={servicoId}
            onChange={(e) => handleServicoChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Selecione o Serviço --</option>
            {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
        </div>

        {/* NCM (Apenas leitura informativa) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NCM</label>
          <input
            type="text"
            value={ncm}
            disabled
            className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed"
            placeholder="Preenchido automaticamente"
          />
        </div>

        {/* QUANTIDADE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* VALOR UNITÁRIO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={valorUnitario}
            onChange={(e) => setValorUnitario(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* VALOR TOTAL (Calculado dinamicamente na tela) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total Geral</label>
          <div className="w-full p-2 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-md text-lg">
            R$ {valorTotal}
          </div>
        </div>

        {/* CONDIÇÃO DE PAGAMENTO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condição de Pagamento *</label>
          <select
            value={condicaoPagamento}
            onChange={(e) => setCondicaoPagamento(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="À Vista">À Vista (Dinheiro/Pix)</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Boleto 30 dias">Boleto 30 dias</option>
            <option value="Faturado Parcelado">Faturado Parcelado</option>
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status do Pedido *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Pendente">Pendente</option>
            <option value="Concluído">Concluído</option>
            <option value="Faturado">Faturado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* OBSERVAÇÃO */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações do Pedido</label>
          <textarea
            rows="3"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Detalhes adicionais sobre a entrega ou termos do serviço..."
          ></textarea>
        </div>

        {/* BOTÃO SALVAR */}
        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-200 disabled:bg-blue-300"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Salvando Venda...' : 'Confirmar e Salvar Lançamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
