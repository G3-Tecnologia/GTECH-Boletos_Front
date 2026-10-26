import { calcularDiasAtraso, formatCurrency } from '../utils/formatters';

export default function OverdueAlert({ boletos, onSelectOverdueFilter }) {
  const vencidos = boletos.filter((b) => b.status === 'vencido');

  if (vencidos.length === 0) {
    return (
      <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 flex items-center justify-between text-xs sm:text-sm transition-colors">
        <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-300">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Situação Cadastral Regular:</strong> Todos os seus títulos bancários estão em dia ou quitados.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
          Adimplente
        </span>
      </div>
    );
  }

  const maiorAtraso = Math.max(
    ...vencidos.map((b) => Math.max(0, calcularDiasAtraso(b.dataVencimento)))
  );

  const totalValorVencido = vencidos.reduce((acc, b) => acc + b.valor, 0);

  return (
    <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm transition-colors">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <div className="text-rose-900 dark:text-rose-200 leading-relaxed">
          <span className="font-bold">
            {vencidos.length === 1 ? '1 boleto em atraso' : `${vencidos.length} boletos em atraso`}:
          </span>{' '}
          Vencimento expirado há <strong>{maiorAtraso} dia{maiorAtraso > 1 ? 's' : ''}</strong>. Montante total em aberto:{' '}
          <strong className="tabular-nums font-mono font-bold text-rose-950 dark:text-rose-100">{formatCurrency(totalValorVencido)}</strong>.
        </div>
      </div>

      {onSelectOverdueFilter && (
        <button
          type="button"
          onClick={onSelectOverdueFilter}
          className="self-end sm:self-auto px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
        >
          Filtrar boletos vencidos
        </button>
      )}
    </div>
  );
}
