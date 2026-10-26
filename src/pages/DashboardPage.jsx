import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_BOLETOS } from '../data/mockData';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import OverdueAlert from '../components/OverdueAlert';
import SearchBar from '../components/SearchBar';
import BoletoTable from '../components/BoletoTable';

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('recente');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Boletos pertencentes ao usuário autenticado (PF ou PJ)
  const userBoletos = useMemo(() => {
    if (!user?.id) return [];
    return MOCK_BOLETOS.filter((b) => b.userId === user.id);
  }, [user?.id]);

  // Contadores para os filtros
  const counts = useMemo(() => {
    return {
      todos: userBoletos.length,
      pago: userBoletos.filter((b) => b.status === 'pago').length,
      pendente: userBoletos.filter((b) => b.status === 'pendente').length,
      vencido: userBoletos.filter((b) => b.status === 'vencido').length,
    };
  }, [userBoletos]);

  // Boletos filtrados e ordenados
  const filteredBoletos = useMemo(() => {
    let list = [...userBoletos];

    // Filtro por status
    if (statusFilter !== 'todos') {
      list = list.filter((b) => b.status === statusFilter);
    }

    // Filtro por busca de texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.descricao.toLowerCase().includes(term) ||
          b.nossoNumero.toLowerCase().includes(term) ||
          b.banco.toLowerCase().includes(term) ||
          b.linhaDigitavel.includes(term) ||
          b.beneficiario.toLowerCase().includes(term) ||
          String(b.valor).includes(term)
      );
    }

    // Ordenação configurável
    if (sortBy === 'vencimento_proximo') {
      list.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
    } else if (sortBy === 'maior_valor') {
      list.sort((a, b) => b.valor - a.valor);
    } else if (sortBy === 'menor_valor') {
      list.sort((a, b) => a.valor - b.valor);
    } else {
      const statusWeight = { vencido: 0, pendente: 1, pago: 2 };
      list.sort((a, b) => {
        if (statusWeight[a.status] !== statusWeight[b.status]) {
          return statusWeight[a.status] - statusWeight[b.status];
        }
        return new Date(b.dataEmissao) - new Date(a.dataEmissao);
      });
    }

    return list;
  }, [userBoletos, statusFilter, searchTerm, sortBy]);

  // Ação de atualização com rotação das setas
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Simula requisição e busca de boletos
    await new Promise((resolve) => setTimeout(resolve, 800));
    resetFilters();
    setIsRefreshing(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setSortBy('recente');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Header Institucional Fixo */}
      <Header />

      {/* Conteúdo Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">
        {/* Barra Superior de Título e Ação de Atualização (Sem Exportar CSV) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Boletos Bancários
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consulta de títulos em cobrança e histórico de pagamentos
            </p>
          </div>

          <div className="flex items-center">
            {/* Botão de Atualizar com Animação de Rotação das Setas */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-75 shadow-sm"
              title="Buscar atualizações de boletos"
            >
              <svg
                className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 transition-transform ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>{isRefreshing ? 'Buscando atualizações...' : 'Atualizar'}</span>
            </button>
          </div>
        </div>

        {/* Alerta de Vencimento / Adimplência */}
        <OverdueAlert
          boletos={userBoletos}
          onSelectOverdueFilter={() => setStatusFilter('vencido')}
        />

        {/* Resumo da Carteira (Stats Cards) */}
        <StatsCards
          boletos={userBoletos}
          activeFilter={statusFilter}
          onSelectFilter={setStatusFilter}
        />

        {/* Busca, Filtros e Lista de Boletos */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Relação de Documentos
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {filteredBoletos.length} de {userBoletos.length} título{userBoletos.length !== 1 ? 's' : ''}
            </span>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />

          <BoletoTable
            boletos={filteredBoletos}
            onResetFilters={resetFilters}
          />
        </div>
      </main>

      {/* Rodapé Corporativo Limpo */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-10 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Portal Financeiro</span>
            <span>— Sistema Integrado de Gestão de Recebíveis</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            Ambiente Seguro Homologado • © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
