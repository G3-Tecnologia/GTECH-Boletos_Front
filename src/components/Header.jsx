import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha o modal de confirmação no ESC
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutConfirm]);

  // Número do WhatsApp para atendimento
  const whatsappNumber = '558195630100';
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de suporte no Portal Financeiro.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo e Nome da Aplicação */}
            <div className="flex items-center gap-3 sm:gap-5">
              <a href="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Portal <span className="text-blue-600 dark:text-blue-400">Financeiro</span>
                </span>
              </a>

              {/* Atalhos: Início e Atendimento */}
              <nav className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3 sm:pl-4">
                {/* Atalho Início */}
                <a
                  href="/dashboard"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  title="Voltar ao início do painel"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span>Início</span>
                </a>

                {/* Atalho Atendimento */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Abrir canal de atendimento"
                >
                  Atendimento
                </a>
              </nav>
            </div>

            {/* Lado Direito: Dark/Light Mode e Ícone de Perfil */}
            <div className="flex items-center gap-2">
              {/* Botão Dark / Light Mode */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-sm"
                title={isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
                aria-label={isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>

              {/* Botão de Perfil: Apenas o ÍCONE DO BONECO */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
                    isProfileOpen
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  aria-label="Menu do Usuário"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  title="Minha Conta (Clique para ver dados e sair)"
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </button>

                {/* Menu Dropdown de Perfil */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {user?.name}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-2.5 space-y-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">CPF/CNPJ Conectado:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {user?.document}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Classificação:</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {user?.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </span>
                      </div>
                    </div>

                    {/* Botão Sair da Conta (Abre a verificação de saída) */}
                    <div className="pt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Verificação/Confirmação para Sair do Sistema */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Ícone de Alerta */}
            <div className="w-11 h-11 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </div>

            {/* Texto de Confirmação */}
            <div className="text-center mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deseja sair do sistema?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Sua sessão atual será encerrada com segurança. Para acessar seus boletos novamente, será necessário informar suas credenciais.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
