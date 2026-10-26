import { formatCurrency } from '../utils/formatters';

export default function StatsCards({ boletos, activeFilter, onSelectFilter }) {
  const totalCount = boletos.length;
  const pagos = boletos.filter((b) => b.status === 'pago');
  const pendentes = boletos.filter((b) => b.status === 'pendente');
  const vencidos = boletos.filter((b) => b.status === 'vencido');

  const totalPago = pagos.reduce((acc, b) => acc + (b.valorPago || 0), 0);
  const totalPendente = pendentes.reduce((acc, b) => acc + b.valor, 0);
  const totalVencido = vencidos.reduce((acc, b) => acc + b.valor, 0);
  const totalGeral = totalPago + totalPendente + totalVencido;

  const cards = [
    {
      id: 'todos',
      label: 'Volume Total',
      count: totalCount,
      amount: totalGeral,
      detail: `${totalCount} títulos emitidos`,
      badge: '100%',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      activeClass: 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500',
    },
    {
      id: 'pago',
      label: 'Títulos Liquidados',
      count: pagos.length,
      amount: totalPago,
      detail: `${pagos.length} boletos compensados`,
      badge: totalCount > 0 ? `${Math.round((pagos.length / totalCount) * 100)}%` : '0%',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      activeClass: 'border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-600 dark:ring-emerald-500',
    },
    {
      id: 'pendente',
      label: 'A Compensar',
      count: pendentes.length,
      amount: totalPendente,
      detail: `${pendentes.length} no prazo de vencimento`,
      badge: totalCount > 0 ? `${Math.round((pendentes.length / totalCount) * 100)}%` : '0%',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
      activeClass: 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500',
    },
    {
      id: 'vencido',
      label: 'Vencidos / Em Mora',
      count: vencidos.length,
      amount: totalVencido,
      detail: `${vencidos.length} requer atenção`,
      badge: totalCount > 0 ? `${Math.round((vencidos.length / totalCount) * 100)}%` : '0%',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      activeClass: 'border-rose-600 dark:border-rose-500 ring-1 ring-rose-600 dark:ring-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter && onSelectFilter(card.id)}
            className={`text-left bg-white dark:bg-slate-900 rounded-xl border p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer relative ${
              isSelected ? card.activeClass : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums font-mono">
              {formatCurrency(card.amount)}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{card.detail}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {card.count} {card.count === 1 ? 'doc' : 'docs'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
