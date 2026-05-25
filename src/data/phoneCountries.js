/**
 * Liste des pays supportés pour le masque téléphone international.
 * Chaque entrée fournit le code ISO, l'indicatif, le drapeau (emoji) et la longueur nationale max.
 *
 * @typedef {Object} PhoneCountry
 * @property {string} code   Code ISO 3166-1 alpha-2 (ex. FR)
 * @property {string} name   Nom du pays en français
 * @property {string} dial   Indicatif international (ex. +33)
 * @property {string} flag   Emoji drapeau
 * @property {number} digits Nombre de chiffres du numéro national (sans indicatif)
 */

/** @type {PhoneCountry[]} */
export const PHONE_COUNTRIES = [
  { code: 'FR', name: 'France',       dial: '+33', flag: '🇫🇷', digits: 9 },
  { code: 'BE', name: 'Belgique',     dial: '+32', flag: '🇧🇪', digits: 9 },
  { code: 'CH', name: 'Suisse',       dial: '+41', flag: '🇨🇭', digits: 9 },
  { code: 'LU', name: 'Luxembourg',   dial: '+352', flag: '🇱🇺', digits: 9 },
  { code: 'DE', name: 'Allemagne',    dial: '+49', flag: '🇩🇪', digits: 11 },
  { code: 'GB', name: 'Royaume-Uni',  dial: '+44', flag: '🇬🇧', digits: 10 },
  { code: 'ES', name: 'Espagne',      dial: '+34', flag: '🇪🇸', digits: 9 },
  { code: 'IT', name: 'Italie',       dial: '+39', flag: '🇮🇹', digits: 10 },
  { code: 'PT', name: 'Portugal',     dial: '+351', flag: '🇵🇹', digits: 9 },
  { code: 'NL', name: 'Pays-Bas',     dial: '+31', flag: '🇳🇱', digits: 9 },
  { code: 'US', name: 'États-Unis',   dial: '+1', flag: '🇺🇸', digits: 10 },
  { code: 'CA', name: 'Canada',       dial: '+1', flag: '🇨🇦', digits: 10 },
  { code: 'MA', name: 'Maroc',        dial: '+212', flag: '🇲🇦', digits: 9 },
  { code: 'TN', name: 'Tunisie',      dial: '+216', flag: '🇹🇳', digits: 8 },
  { code: 'SN', name: 'Sénégal',      dial: '+221', flag: '🇸🇳', digits: 9 },
];

/**
 * Retourne un pays par son code ISO.
 *
 * @param {string} code Code ISO (ex. FR)
 * @param {PhoneCountry[]} [list=PHONE_COUNTRIES]
 * @returns {PhoneCountry|undefined}
 */
export function getCountryByCode(code, list = PHONE_COUNTRIES) {
  return list.find(c => c.code === code);
}
