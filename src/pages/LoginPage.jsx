import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatDocument, onlyNumbers, validateDocument } from '../utils/formatters';

export default function LoginPage() {
  const { login, isLockedOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDoc, setRememberDoc] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const docDigits = onlyNumbers(document);
  const docValidation = validateDocument(document);
  const docType = docDigits.length > 11 ? 'CNPJ' : 'CPF';

  const handleDocumentChange = useCallback((e) => {
    const raw = onlyNumbers(e.target.value);
    if (raw.length <= 14) {
      setDocument(formatDocument(raw));
    }
  }, []);

  const fillDemoAccount = (doc, pwd) => {
    setDocument(doc);
    setPassword(pwd);
    setError('');
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');

      const rawDoc = onlyNumbers(document);
      if (rawDoc.length < 11) {
        setError('Por favor, informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
        return;
      }

      if (!password || password.length < 6) {
        setError('A senha deve possuir no mínimo 6 caracteres.');
        return;
      }

      setIsLoading(true);

      // Simulação de segurança / latência
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = login(document, password);

      if (!result.success) {
        setError(result.error);
      }

      setIsLoading(false);
    },
    [document, password, login]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-800 dark:text-slate-100 transition-colors">
      {/* Barra Superior Institucional */}
      <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Portal <span className="text-blue-600 dark:text-blue-400">Financeiro</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-normal border-l border-slate-200 dark:border-slate-700 pl-2">
                Consulta de Títulos e Boletos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão Dark / Light Mode no Login */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          {/* Card Principal de Login */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
            <div className="mb-6">
              <h1 className="text-center text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Acesse sua conta
              </h1>
            </div>

            {/* Alerta de Erro */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo CPF / CNPJ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="document-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    CPF ou CNPJ
                  </label>
                  {docDigits.length > 0 && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${docValidation.valid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                      {docType} {docValidation.valid ? '✓ Válido' : ''}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="document-input"
                    type="text"
                    inputMode="numeric"
                    value={document}
                    onChange={handleDocumentChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    autoComplete="username"
                    required
                    className="w-full bg-slate-50/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all tabular-nums"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Senha
                </label>

                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha de acesso"
                    autoComplete="current-password"
                    required
                    className="w-full bg-slate-50/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Opções Abaixo do Campo de Senha: Lembrar-me e Esqueceu a senha */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDoc}
                    onChange={(e) => setRememberDoc(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-600 dark:text-slate-400">Lembrar-me</span>
                </label>

                <a
                  href="#recuperar"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Em produção, o link de recuperação de senha será enviado para seu e-mail cadastrado.');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading || isLockedOut}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Validando credenciais...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Seletor de Contas de Demonstração */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Ambiente de Demonstração (Clique para preencher)
              </span>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('123.456.789-00', 'Gtech@2024')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Maria Silva</span>
                    <span className="text-slate-400 ml-1.5 font-mono">123.456.789-00</span>
                  </div>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Boleto em atraso
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount('12.345.678/0001-90', 'Gtech@2024')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Tech Solutions</span>
                    <span className="text-slate-400 ml-1.5 font-mono">12.345.678/0001-90</span>
                  </div>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Pessoa Jurídica
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Selos de Confiança e Ajuda */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Proteção SSL 256-bit
              </span>
              <span>•</span>
              <span>Conformidade LGPD</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Precisa de ajuda para acessar? Ligue <strong className="text-slate-600 dark:text-slate-300 font-medium">0800 700 4832</strong>
            </p>
          </div>
        </div>
      </main>

      {/* Rodapé Simples e Corporativo */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Portal Financeiro • CNPJ 45.123.456/0001-00</span>
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
