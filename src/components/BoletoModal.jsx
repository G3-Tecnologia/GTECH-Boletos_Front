import { useState } from 'react';
import { formatCurrency, formatDate, calcularDiasAtraso } from '../utils/formatters';

export default function BoletoModal({ boleto, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!boleto) return null;

  const diasAtraso = boleto.status === 'vencido' ? Math.max(0, calcularDiasAtraso(boleto.dataVencimento)) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(boleto.linhaDigitavel);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header do Modal */}
        <div className="no-print bg-slate-50 px-6 py-3.5 flex items-center justify-between text-slate-800 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ficha de Compensação Bancária</h3>
              <p className="text-[11px] text-slate-500">Padrão FEBRABAN • Portal Financeiro</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.077-.32-2.197-.32-3.329 0-3.866 3.134-7 7-7s7 3.134 7 7c0 1.132-.08 2.252-.32 3.329M6.72 13.829a8.96 8.96 0 00-3.72 2.371m17.44 0a8.96 8.96 0 00-3.72-2.371M6.72 13.829H17.28m-10.56 0A8.96 8.96 0 013 16.2m18 0a8.96 8.96 0 00-3.72-2.371M3 16.2v4.8A1 1 0 004 22h16a1 1 0 001-1v-4.8M3 16.2c0-1.657 1.343-3 3-3h12c1.657 0 3 1.343 3 3" />
              </svg>
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Fechar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Boleto */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Topo do Boleto: Banco, Código e Linha Digitável */}
          <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-slate-900 tracking-tight font-serif uppercase">
                {boleto.banco}
              </span>
              <span className="text-lg font-bold text-slate-800 border-l-2 border-r-2 border-slate-900 px-3">
                {boleto.banco === 'Bradesco' ? '237-2' : boleto.banco === 'Itaú' ? '341-7' : '001-9'}
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all tracking-tight">
              {boleto.linhaDigitavel}
            </div>
          </div>

          {/* Dados do Título (Grid FEBRABAN) */}
          <div className="border border-slate-400 text-xs divide-y divide-slate-400">
            {/* Linha 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-400">
              <div className="p-2 sm:col-span-3">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Local de Pagamento</span>
                <span className="font-medium text-slate-800">Pagável em qualquer rede bancária ou canais eletrônicos até o vencimento</span>
              </div>
              <div className="p-2 bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Vencimento</span>
                <span className={`font-bold text-sm ${boleto.status === 'vencido' ? 'text-rose-600' : 'text-slate-900'}`}>
                  {formatDate(boleto.dataVencimento)}
                </span>
              </div>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-400">
              <div className="p-2 sm:col-span-3">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Beneficiário</span>
                <span className="font-bold text-slate-800">{boleto.beneficiario}</span>
                <span className="text-slate-500 ml-2">CNPJ: {boleto.cnpjBeneficiario}</span>
              </div>
              <div className="p-2 bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Agência / Código Beneficiário</span>
                <span className="font-medium text-slate-800">{boleto.agencia} / {boleto.conta}</span>
              </div>
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-400">
              <div className="p-2">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Data do Documento</span>
                <span className="font-medium text-slate-800">{formatDate(boleto.dataEmissao)}</span>
              </div>
              <div className="p-2">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Número do Documento</span>
                <span className="font-mono font-medium text-slate-800">{boleto.nossoNumero}</span>
              </div>
              <div className="p-2">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Espécie Moeda</span>
                <span className="font-medium text-slate-800">R$ (BRL)</span>
              </div>
              <div className="p-2 bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Valor do Documento</span>
                <span className="font-extrabold text-base text-slate-950">{formatCurrency(boleto.valor)}</span>
              </div>
            </div>

            {/* Linha 4: Instruções */}
            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-400">
              <div className="p-3 sm:col-span-3 space-y-1">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Instruções de Responsabilidade do Beneficiário</span>
                <p className="text-slate-700 font-medium">{boleto.descricao}</p>
                <p className="text-[11px] text-slate-500">
                  • Após o vencimento cobrar juros de mora de 1% ao mês e multa rescisória de 2%.
                </p>
                <p className="text-[11px] text-slate-500">
                  • Em caso de dúvidas, contate o departamento financeiro GTECH.
                </p>
              </div>
              <div className="p-2 space-y-2 bg-slate-50">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">(-) Desconto / Abatimento</span>
                  <span className="font-medium text-slate-400">—</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">(=) Valor Cobrado</span>
                  <span className="font-bold text-slate-900">{formatCurrency(boleto.valor)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Código de Barras e Ações de Cópia */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Linha Digitável para Pagamento
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all break-all">
                  {boleto.linhaDigitavel}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    <span>Copiar Linha Digitável</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulação Gráfica do Código de Barras (SVG Vector Barcode) */}
            <div className="mt-4 flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl">
              <svg className="h-16 w-full max-w-lg" viewBox="0 0 400 60" preserveAspectRatio="none">
                <rect x="0" y="0" width="400" height="60" fill="white" />
                {Array.from({ length: 65 }).map((_, idx) => {
                  const width = ((idx * 7) % 4) + 1;
                  const x = idx * 6;
                  return <rect key={idx} x={x} y="5" width={width} height="50" fill="#0f172a" />;
                })}
              </svg>
              <span className="text-[10px] font-mono text-slate-500 tracking-widest mt-1">
                {boleto.codigoBarra}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="no-print bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Documento emitido eletronicamente</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
