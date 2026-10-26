import { useState } from 'react';
import { formatCurrency, formatDate, calcularDiasAtraso } from '../utils/formatters';
import BoletoModal from './BoletoModal';

export default function BoletoTable({ boletos, onResetFilters }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedBoletoModal, setSelectedBoletoModal] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopyCode = (e, boleto) => {
    e.stopPropagation();
    navigator.clipboard.writeText(boleto.linhaDigitavel);
    setCopiedId(boleto.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenModal = (e, boleto) => {
    e.stopPropagation();
    setSelectedBoletoModal(boleto);
  };

  if (boletos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm transition-colors">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">Nenhum título encontrado</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
          Não há registros compatíveis com os filtros selecionados ou termo de busca informado.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Redefinir filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Modal Ficha Bancária */}
      {selectedBoletoModal && (
        <BoletoModal
          boleto={selectedBoletoModal}
          onClose={() => setSelectedBoletoModal(null)}
        />
      )}

      {/* Tabela Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden transition-colors">
        {/* Cabeçalho Desktop */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="col-span-4">Descrição do Título / Beneficiário</div>
          <div className="col-span-2">Vencimento</div>
          <div className="col-span-2 text-right">Valor do Documento</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {/* Linhas */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {boletos.map((boleto) => {
            const isExpanded = expandedId === boleto.id;
            const isCopied = copiedId === boleto.id;
            const diasAtraso = boleto.status === 'vencido' ? Math.max(0, calcularDiasAtraso(boleto.dataVencimento)) : 0;

            // Badges sutis e limpos
            let statusBadge = null;
            if (boleto.status === 'pago') {
              statusBadge = (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Liquidado
                </span>
              );
            } else if (boleto.status === 'vencido') {
              statusBadge = (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Vencido ({diasAtraso}d)
                </span>
              );
            } else {
              statusBadge = (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  A compensar
                </span>
              );
            }

            return (
              <div
                key={boleto.id}
                className={`transition-colors duration-150 ${
                  isExpanded ? 'bg-slate-50/70 dark:bg-slate-800/40' : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
                }`}
              >
                {/* Linha Desktop */}
                <div
                  onClick={() => toggleExpand(boleto.id)}
                  className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-5 py-3.5 cursor-pointer"
                >
                  {/* Descrição */}
                  <div className="col-span-4 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {boleto.descricao}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{boleto.banco}</span>
                      <span>•</span>
                      <span>Nosso nº <span className="font-mono">{boleto.nossoNumero}</span></span>
                    </div>
                  </div>

                  {/* Vencimento */}
                  <div className="col-span-2">
                    <span className={`text-sm tabular-nums font-medium ${boleto.status === 'vencido' ? 'text-rose-700 dark:text-rose-400 font-semibold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {formatDate(boleto.dataVencimento)}
                    </span>
                    {boleto.status === 'pago' && boleto.dataPagamento && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 tabular-nums">
                        Pago em {formatDate(boleto.dataPagamento)}
                      </p>
                    )}
                    {boleto.status === 'vencido' && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                        {diasAtraso} dia{diasAtraso > 1 ? 's' : ''} em atraso
                      </p>
                    )}
                  </div>

                  {/* Valor */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      {formatCurrency(boleto.valor)}
                    </span>
                    {boleto.valorPago && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        Liq: {formatCurrency(boleto.valorPago)}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    {statusBadge}
                  </div>

                  {/* Ações */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(e, boleto)}
                      className={`p-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800'
                      }`}
                      title="Copiar linha digitável"
                    >
                      {isCopied ? (
                        <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleOpenModal(e, boleto)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Boleto
                    </button>

                    <button
                      type="button"
                      className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Linha / Card Mobile */}
                <div
                  onClick={() => toggleExpand(boleto.id)}
                  className="lg:hidden p-4 cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{boleto.banco}</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                        {boleto.descricao}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Nº {boleto.nossoNumero}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        {formatCurrency(boleto.valor)}
                      </div>
                      <div className="mt-1">{statusBadge}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span>Vencimento: </span>
                      <strong className={`tabular-nums ${boleto.status === 'vencido' ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                        {formatDate(boleto.dataVencimento)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(e, boleto)}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                      >
                        {isCopied ? 'Copiado!' : 'Copiar'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleOpenModal(e, boleto)}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                      >
                        Ver Boleto
                      </button>

                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Detalhes Expandidos (Gaveta Inline) */}
                {isExpanded && (
                  <div className="px-5 py-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Linha Digitável
                          </span>
                          {isCopied && (
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              ✓ Código copiado para a área de transferência
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-800 dark:text-slate-200 select-all break-all">
                            {boleto.linhaDigitavel}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(e, boleto)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shrink-0 cursor-pointer shadow-sm"
                          >
                            {isCopied ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-medium block">Beneficiário</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{boleto.beneficiario}</span>
                          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{boleto.cnpjBeneficiario}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-medium block">Agência / Conta</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">Ag: {boleto.agencia}</span>
                          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">CC: {boleto.conta}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-medium block">Data de Emissão</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(boleto.dataEmissao)}</span>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={(e) => handleOpenModal(e, boleto)}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.077-.32-2.197-.32-3.329 0-3.866 3.134-7 7-7s7 3.134 7 7c0 1.132-.08 2.252-.32 3.329M6.72 13.829a8.96 8.96 0 00-3.72 2.371m17.44 0a8.96 8.96 0 00-3.72-2.371M6.72 13.829H17.28m-10.56 0A8.96 8.96 0 013 16.2m18 0a8.96 8.96 0 00-3.72-2.371M3 16.2v4.8A1 1 0 004 22h16a1 1 0 001-1v-4.8M3 16.2c0-1.657 1.343-3 3-3h12c1.657 0 3 1.343 3 3" />
                            </svg>
                            <span>Ficha Completa (PDF)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé da Tabela */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Exibindo <strong>{boletos.length}</strong> {boletos.length === 1 ? 'título' : 'títulos'}
          </span>
          <span className="text-[11px] text-slate-400">
            Clique na linha para expandir informações
          </span>
        </div>
      </div>
    </>
  );
}
