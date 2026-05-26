/**
 * Normalise les séparateurs de milliers en espaces visibles.
 *
 * @param {string} formatted Chaîne formatée par Intl
 * @returns {string}
 */
export function withSpaceSeparators(formatted) {
  return String(formatted).replace(/[\u00a0\u202f]/g, ' ');
}

/**
 * Formate une partie entière avec des espaces tous les 3 chiffres.
 *
 * @param {string} intPart Chiffres de la partie entière
 * @returns {string}
 */
function groupThousands(intPart) {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Formate un montant pendant la saisie (séparateurs d'espaces, décimales optionnelles).
 *
 * @param {string} input Valeur saisie
 * @param {'fr-FR'|'en-US'} locale Locale de formatage
 * @returns {string}
 */
export function formatMoneyLive(input, locale = 'fr-FR') {
  if (input == null || input === '') return '';

  const decSep = locale === 'fr-FR' ? ',' : '.';
  const cleaned = String(input).replace(/\s/g, '');
  const lastSep = Math.max(cleaned.lastIndexOf(','), cleaned.lastIndexOf('.'));
  let intPart = '';
  let decPart = '';

  if (lastSep >= 0) {
    intPart = cleaned.slice(0, lastSep).replace(/[^\d]/g, '');
    decPart = cleaned.slice(lastSep + 1).replace(/[^\d]/g, '').slice(0, 2);
  } else {
    intPart = cleaned.replace(/[^\d]/g, '');
  }

  if (!intPart && !decPart) return '';

  const grouped = intPart ? groupThousands(intPart) : '0';
  if (decPart !== '' || (lastSep >= 0 && (cleaned.endsWith(',') || cleaned.endsWith('.')))) {
    return `${grouped}${decSep}${decPart}`;
  }
  return grouped;
}

/**
 * Formate un montant final (2 décimales, espaces comme séparateurs de milliers).
 *
 * @param {number|string} raw Valeur numérique ou chaîne brute
 * @param {'fr-FR'|'en-US'} locale Locale de formatage
 * @returns {string}
 */
export function formatMoneyFinal(raw, locale = 'fr-FR') {
  const n = parseFloat(String(raw).replace(/\s/g, '').replace(',', '.'));
  if (isNaN(n)) return '';
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return withSpaceSeparators(formatted);
}
