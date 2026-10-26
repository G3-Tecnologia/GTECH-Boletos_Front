/**
 * Utilitários para formatação e validação de documentos e valores
 * Funções puras, sem side effects
 */

/**
 * Remove todos os caracteres não numéricos de uma string
 * @param {string} value
 * @returns {string}
 */
export function onlyNumbers(value) {
  return String(value).replace(/\D/g, '');
}

/**
 * Formata CPF: 000.000.000-00
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {string}
 */
export function formatCPF(cpf) {
  const digits = onlyNumbers(cpf).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Formata CNPJ: 00.000.000/0000-00
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {string}
 */
export function formatCNPJ(cnpj) {
  const digits = onlyNumbers(cnpj).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Formata automaticamente CPF ou CNPJ baseado na quantidade de dígitos
 * @param {string} value
 * @returns {string}
 */
export function formatDocument(value) {
  const digits = onlyNumbers(value);
  if (digits.length <= 11) {
    return formatCPF(digits);
  }
  return formatCNPJ(digits);
}

/**
 * Valida CPF com cálculo de dígitos verificadores
 * @param {string} cpf
 * @returns {boolean}
 */
export function validateCPF(cpf) {
  const digits = onlyNumbers(cpf);
  if (digits.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(digits)) return false;

  // Cálculo do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
}

/**
 * Valida CNPJ com cálculo de dígitos verificadores
 * @param {string} cnpj
 * @returns {boolean}
 */
export function validateCNPJ(cnpj) {
  const digits = onlyNumbers(cnpj);
  if (digits.length !== 14) return false;

  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(digits[12]) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(digits[13]) !== digit2) return false;

  return true;
}

/**
 * Valida documento (CPF ou CNPJ) automaticamente
 * @param {string} document
 * @returns {{ valid: boolean, type: 'CPF' | 'CNPJ' | null }}
 */
export function validateDocument(document) {
  const digits = onlyNumbers(document);

  if (digits.length <= 11) {
    return { valid: validateCPF(digits), type: 'CPF' };
  }
  if (digits.length <= 14) {
    return { valid: validateCNPJ(digits), type: 'CNPJ' };
  }
  return { valid: false, type: null };
}

/**
 * Formata valor monetário em BRL
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata data ISO para formato brasileiro
 * @param {string} dateString - Data em formato ISO (YYYY-MM-DD)
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Calcula dias de atraso de um boleto
 * @param {string} dataVencimento - Data de vencimento em formato ISO
 * @returns {number} - Dias de atraso (positivo = atrasado, negativo = faltam X dias)
 */
export function calcularDiasAtraso(dataVencimento) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(dataVencimento + 'T00:00:00');
  const diffMs = hoje - vencimento;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Sanitiza input do usuário para prevenir XSS
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
