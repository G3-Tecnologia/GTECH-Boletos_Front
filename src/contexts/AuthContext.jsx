import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { onlyNumbers } from '../utils/formatters';

/**
 * Contexto de autenticação da aplicação
 * Gerencia estado de login, sessão e dados do usuário
 *
 * NOTA DE SEGURANÇA: Em produção, a autenticação deve ser feita
 * via API com tokens JWT, httpOnly cookies e refresh tokens.
 * Este contexto é apenas para demonstração do fluxo visual.
 */

const AuthContext = createContext(null);

// Chave para sessionStorage (mais seguro que localStorage para sessões)
const SESSION_KEY = 'gtech_session';

/**
 * Controle de tentativas de login para brute-force protection
 * Em produção: implementar rate limiting no backend
 */
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutos

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verifica se a sessão ainda é válida (expira em 30 min)
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return parsed.user;
        }
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return null;
  });

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  /**
   * Realiza autenticação do usuário
   * @param {string} document - CPF ou CNPJ
   * @param {string} password - Senha do usuário
   * @returns {{ success: boolean, error?: string }}
   */
  const login = useCallback((document, password) => {
    // Verifica lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `Muitas tentativas. Aguarde ${remainingMinutes} minuto(s) para tentar novamente.`,
      };
    }

    // Reset lockout se expirou
    if (lockoutUntil && Date.now() >= lockoutUntil) {
      setLockoutUntil(null);
      setLoginAttempts(0);
    }

    const documentDigits = onlyNumbers(document);

    // Busca usuário pelo documento
    const foundUser = MOCK_USERS.find(
      (u) => u.documentRaw === documentDigits
    );

    if (!foundUser || foundUser.password !== password) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
        return {
          success: false,
          error: `Conta bloqueada por excesso de tentativas. Aguarde 5 minutos.`,
        };
      }

      return {
        success: false,
        error: `CPF/CNPJ ou senha inválidos. Tentativa ${newAttempts} de ${MAX_LOGIN_ATTEMPTS}.`,
      };
    }

    // Login bem-sucedido
    setLoginAttempts(0);
    setLockoutUntil(null);

    // Dados seguros do usuário (sem senha)
    const safeUser = {
      id: foundUser.id,
      name: foundUser.name,
      document: foundUser.document,
      email: foundUser.email,
      type: foundUser.type,
    };

    // Salva sessão com expiração de 30 minutos
    const session = {
      user: safeUser,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(safeUser);

    return { success: true };
  }, [loginAttempts, lockoutUntil]);

  /**
   * Realiza logout do usuário e limpa sessão
   */
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = useMemo(() => !!user, [user]);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      loginAttempts,
      isLockedOut: lockoutUntil && Date.now() < lockoutUntil,
    }),
    [user, isAuthenticated, login, logout, loginAttempts, lockoutUntil]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de autenticação
 * @returns {Object} Dados e funções de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
