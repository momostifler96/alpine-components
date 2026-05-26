/**
 * apInputMask — Champ formaté avec presets et masques personnalisés
 *
 * Config :
 *   value      valeur initiale (brute)
 *   mask       preset string | { pattern } | { regex, hint }
 *   maxDigits  nb max de chiffres pour mask:'number' (défaut 8)
 *   placeholder
 *   prefix / suffix — comme apInputText
 *   disabled
 *   country    code ISO initial pour mask: 'phone-country' (défaut FR)
 *
 * Presets (mask: 'name') :
 *   number        · chiffres uniquement, limité à maxDigits (défaut 8)
 *   phone-fr      · 06 12 34 56 78
 *   phone-intl    · +33 6 12 34 56 78
 *   phone-country · drapeau + indicatif + numéro national (émet pays + numéro)
 *   money-eur     · 1 234,56 (espaces milliers, format live)
 *   money-usd     · 1,234.56
 *   card, date-fr, siret
 *
 * Exposé (phone-country en plus) :
 *   value, display, isValid, focused
 *   countryCode, country, dialCode, phoneNumber, fullPhone
 *
 * Événements (phone-country) :
 *   phone-change · { country, dialCode, number, full }
 *   country-change · { country, dialCode }
 */
import { PHONE_COUNTRIES, getCountryByCode } from '../data/phoneCountries.js';
import { formatMoneyLive, formatMoneyFinal } from '../utils/formatMoney.js';

// ── Presets ───────────────────────────────────────────────────────────────────

const PRESETS = {
  'phone-fr': {
    inputmode: 'tel',
    placeholder: '06 12 34 56 78',
    live: true,
    format(raw) {
      const d = raw.replace(/\D/g, '').slice(0, 10);
      if (!d) return '';
      return d.replace(
        /^(\d{1,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/,
        (_, a, b, c, e, f) => [a, b, c, e, f].filter(Boolean).join(' ')
      );
    },
    toRaw: s => s.replace(/\D/g, ''),
    validate: v => /^(0[67]|0[1-9])\d{8}$/.test(v) || /^\+33[1-9]\d{8}$/.test(v),
  },

  'phone-intl': {
    inputmode: 'tel',
    placeholder: '+33 6 12 34 56 78',
    live: true,
    format(raw) {
      const plus = raw.trimStart().startsWith('+');
      const d = raw.replace(/\D/g, '').slice(0, 15);
      if (!d) return plus ? '+' : '';
      const spaced = d.replace(
        /^(\d{1,3})(\d{0,3})(\d{0,3})(\d{0,4})$/,
        (_, a, b, c, e) => [a, b, c, e].filter(Boolean).join(' ')
      );
      return (plus ? '+' : '') + spaced;
    },
    toRaw: s => s.replace(/[\s]/g, ''),
    validate: v => /^\+?[1-9]\d{6,14}$/.test(v.replace(/[\s\-().]/g, '')),
  },

  'money-eur': {
    inputmode: 'decimal',
    placeholder: '0,00',
    locale: 'fr-FR',
    live: true,
    format(raw, focused) {
      if (raw === '' || raw == null) return '';
      if (focused) return formatMoneyLive(raw, 'fr-FR');
      return formatMoneyFinal(raw, 'fr-FR');
    },
    focusDisplay(raw) {
      if (!raw) return '';
      return formatMoneyLive(String(raw).replace('.', ','), 'fr-FR');
    },
    toRaw: s => String(s).replace(/\s/g, '').replace(',', '.'),
    validate: v => v === '' || !isNaN(parseFloat(v)),
  },

  'money-usd': {
    inputmode: 'decimal',
    placeholder: '0.00',
    locale: 'en-US',
    live: true,
    format(raw, focused) {
      if (raw === '' || raw == null) return '';
      if (focused) return formatMoneyLive(raw, 'en-US');
      return formatMoneyFinal(raw, 'en-US');
    },
    focusDisplay(raw) {
      if (!raw) return '';
      return formatMoneyLive(String(raw ?? ''), 'en-US');
    },
    toRaw: s => String(s).replace(/\s/g, '').replace(/,/g, ''),
    validate: v => v === '' || !isNaN(parseFloat(v)),
  },

  card: {
    inputmode: 'numeric',
    placeholder: '0000 0000 0000 0000',
    live: true,
    format: raw => raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
    toRaw: s => s.replace(/\D/g, ''),
    validate: v => v.replace(/\D/g, '').length === 16,
  },

  'date-fr': {
    inputmode: 'numeric',
    placeholder: 'JJ/MM/AAAA',
    live: true,
    format(raw) {
      const d = raw.replace(/\D/g, '').slice(0, 8);
      if (d.length <= 2) return d;
      if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
      return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    },
    toRaw: s => s.replace(/\D/g, ''),
    validate(v) {
      const d = v.replace(/\D/g, '');
      if (d.length !== 8) return false;
      const day = +d.slice(0, 2);
      const month = +d.slice(2, 4);
      const year = +d.slice(4);
      return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900;
    },
  },

  siret: {
    inputmode: 'numeric',
    placeholder: '000 000 000 00000',
    live: true,
    format(raw) {
      const d = raw.replace(/\D/g, '').slice(0, 14);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      if (d.length <= 9) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
    },
    toRaw: s => s.replace(/\D/g, ''),
    validate: v => v.replace(/\D/g, '').length === 14,
  },
};

/**
 * Formate un numéro national avec des espaces (groupes de 2).
 *
 * @param {string} digits Chiffres uniquement
 * @returns {string}
 */
function formatNationalPhone(digits) {
  if (!digits) return '';
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

// ── Composant ─────────────────────────────────────────────────────────────────

export default function apInputMask(config = {}) {
  const maskKey = typeof config.mask === 'string' ? config.mask : null;
  const maskPat = typeof config.mask === 'object' && config.mask?.pattern ? config.mask.pattern : null;
  const maskRx = typeof config.mask === 'object' && config.mask?.regex ? config.mask.regex : null;
  const rxHint = config.mask?.hint ?? null;
  const isPhoneCountry = maskKey === 'phone-country';
  const maxDigits = config.maxDigits ?? 8;

  const numberPreset = maskKey === 'number' ? {
    inputmode: 'numeric',
    placeholder: config.placeholder ?? '',
    live: true,
    format: raw => raw.replace(/\D/g, '').slice(0, maxDigits),
    toRaw: s => s.replace(/\D/g, ''),
    validate: v => !v || v.length <= maxDigits,
  } : null;

  const preset = maskKey && !isPhoneCountry ? (numberPreset ?? PRESETS[maskKey]) : null;

  const initialCountry =
    getCountryByCode(config.country ?? 'FR') ?? PHONE_COUNTRIES[0];

  const base = {
    raw: String(config.value ?? ''),
    display: '',
    value: String(config.value ?? ''),
    placeholder: config.placeholder ?? preset?.placeholder ?? '',
    disabled: config.disabled ?? false,
    prefix: config.prefix ?? null,
    suffix: config.suffix ?? null,
    focused: false,
    rxHint,

    init() {
      if (isPhoneCountry) {
        this._initPhoneCountry();
        return;
      }

      this.display = this._fmt(this.raw, false);
      this.$watch('value', v => {
        const s = String(v ?? '');
        if (s !== this.raw) {
          this.raw = s;
          this.display = this._fmt(s, this.focused);
        }
      });
    },

    get inputmode() {
      if (isPhoneCountry) return 'tel';
      return preset?.inputmode ?? 'text';
    },

    get isValid() {
      if (isPhoneCountry) {
        if (!this.phoneNumber) return true;
        const len = this.phoneNumber.length;
        return len >= Math.min(6, this.country?.digits ?? 9) && len <= (this.country?.digits ?? 15);
      }
      if (!this.raw) return true;
      if (preset?.validate) return preset.validate(this.display);
      if (maskRx) return new RegExp(maskRx).test(this.raw);
      return true;
    },

    _fmt(raw, focused) {
      if (preset) return preset.format(raw, focused);
      if (maskPat) return this._patternMask(raw, maskPat);
      return raw;
    },

    _toRaw(display) {
      if (preset?.toRaw) return preset.toRaw(display);
      if (maskPat) return display.replace(/[^A-Z0-9]/gi, '');
      return display;
    },

    _patternMask(input, pattern) {
      const src = input.replace(/[^A-Z0-9]/gi, '');
      let out = '';
      let si = 0;
      for (let pi = 0; pi < pattern.length && si < src.length; pi++) {
        const pc = pattern[pi];
        const sc = src[si];
        if (pc === '#') {
          if (!/\d/.test(sc)) break;
          out += sc;
          si++;
        } else if (pc === 'A') {
          if (!/[A-Za-z]/.test(sc)) break;
          out += sc.toUpperCase();
          si++;
        } else if (pc === '*') {
          out += sc.toUpperCase();
          si++;
        } else {
          out += pc;
          if (sc === pc) si++;
        }
      }
      return out;
    },

    onFocus() {
      this.focused = true;
      if (preset?.focusDisplay) {
        this.display = preset.focusDisplay(this.raw);
        this.$nextTick(() => this.$refs.input?.select());
      }
    },

    onInput(event) {
      const input = event.target;
      const prevLen = this.display.length;

      if (preset && preset.live === false) {
        this.display = input.value;
        this.raw = this._toRaw(input.value);
      } else {
        this.raw = this._toRaw(input.value);
        this.display = this._fmt(this.raw, true);
      }

      this.value = this.raw;
      this.$dispatch('input', this.raw);

      if (preset?.live || maskPat) {
        const inserted = this.display.length - prevLen;
        if (inserted > 0) {
          this.$nextTick(() => {
            if (!input.isConnected) return;
            const pos = Math.min(input.selectionStart + inserted, this.display.length);
            input.setSelectionRange(pos, pos);
          });
        }
      }
    },

    onBlur() {
      this.focused = false;

      if (preset?.live) {
        if (maskKey?.startsWith('money-')) {
          const raw = this._toRaw(this.display);
          if (!String(this.display).trim()) {
            this.raw = '';
            this.display = '';
            this.value = '';
            this.$dispatch('change', '');
            return;
          }
          const n = parseFloat(String(raw).replace(',', '.'));
          if (!isNaN(n)) {
            this.raw = String(n);
            this.display = this._fmt(this.raw, false);
            this.value = this.raw;
            this.$dispatch('input', this.raw);
            this.$dispatch('change', this.raw);
          }
          return;
        }
        this.$dispatch('change', this.raw);
        return;
      }

      if (preset && !preset.live) {
        const raw = this._toRaw(this.display);
        const n = parseFloat(raw.replace(',', '.'));
        if (!isNaN(n)) {
          this.raw = String(n);
          this.display = this._fmt(this.raw, false);
          this.value = this.raw;
          this.$dispatch('input', this.raw);
          this.$dispatch('change', this.raw);
        } else {
          this.raw = '';
          this.display = '';
          this.value = '';
        }
      } else {
        this.$dispatch('change', this.raw);
      }
    },
  };

  if (!isPhoneCountry) return base;

  return {
    ...base,
    countries: config.countries ?? PHONE_COUNTRIES,
    countryCode: initialCountry.code,
    country: initialCountry,
    dialCode: initialCountry.dial,
    phoneNumber: '',
    fullPhone: '',
    countryOpen: false,
    countryPanelStyle: {},

    /**
     * Initialise le mode téléphone avec sélecteur de pays.
     * @private
     */
    _initPhoneCountry() {
      const digits = String(config.value ?? '').replace(/\D/g, '');
      if (digits) {
        const dialDigits = this.country.dial.replace(/\D/g, '');
        if (digits.startsWith(dialDigits)) {
          this.phoneNumber = digits.slice(dialDigits.length);
        } else {
          this.phoneNumber = digits;
        }
      }
      this.display = formatNationalPhone(this.phoneNumber);
      this._syncPhoneOutputs();

      this.$watch('value', v => {
        const full = String(v ?? '').replace(/\s/g, '');
        if (full && full !== this.fullPhone) {
          this.fullPhone = full;
        }
      });
    },

    /**
     * Pays actuellement sélectionné.
     * @returns {import('../data/phoneCountries.js').PhoneCountry}
     */
    get selectedCountry() {
      return this.country;
    },

    /**
     * Ouvre/ferme le sélecteur de pays.
     */
    toggleCountryPicker() {
      if (this.disabled) return;
      this.countryOpen = !this.countryOpen;
      if (this.countryOpen) {
        this.$nextTick(() => this._positionCountryPanel());
      }
    },

    /**
     * Ferme le sélecteur de pays.
     */
    closeCountryPicker() {
      this.countryOpen = false;
    },

    /**
     * Sélectionne un pays et réémet les valeurs.
     *
     * @param {import('../data/phoneCountries.js').PhoneCountry} c
     */
    selectCountry(c) {
      this.country = c;
      this.countryCode = c.code;
      this.dialCode = c.dial;
      this.countryOpen = false;
      const max = c.digits ?? 15;
      if (this.phoneNumber.length > max) {
        this.phoneNumber = this.phoneNumber.slice(0, max);
        this.display = formatNationalPhone(this.phoneNumber);
      }
      this._syncPhoneOutputs();
      this.$dispatch('country-change', {
        country: this.countryCode,
        dialCode: this.dialCode,
      });
    },

    /**
     * Saisie du numéro national (sans indicatif).
     *
     * @param {Event} event
     */
    onPhoneInput(event) {
      const max = this.country?.digits ?? 15;
      const digits = event.target.value.replace(/\D/g, '').slice(0, max);
      this.phoneNumber = digits;
      this.display = formatNationalPhone(digits);
      this._syncPhoneOutputs();
      this.$dispatch('input', this.fullPhone);
    },

    onPhoneFocus() {
      this.focused = true;
    },

    onPhoneBlur() {
      this.focused = false;
      this.$dispatch('change', this.fullPhone);
    },

    /**
     * Met à jour fullPhone, value et émet phone-change.
     * @private
     */
    _syncPhoneOutputs() {
      const dial = (this.dialCode ?? '').replace(/\s/g, '');
      const national = this.phoneNumber ?? '';
      this.fullPhone = national ? `${dial}${national}` : dial;
      this.raw = national;
      this.value = this.fullPhone;
      this.$dispatch('phone-change', {
        country: this.countryCode,
        dialCode: this.dialCode,
        number: national,
        full: this.fullPhone,
      });
    },

    /**
     * Positionne le panneau pays pour rester visible (fixed).
     * @private
     */
    _positionCountryPanel() {
      const trigger = this.$refs.countryTrigger;
      const panel = this.$refs.countryPanel;
      if (!trigger || !panel) return;

      const gap = 4;
      const tr = trigger.getBoundingClientRect();
      const ph = panel.offsetHeight || 220;
      const pw = Math.max(panel.offsetWidth || 220, 220);
      const vh = window.innerHeight;

      let top = tr.bottom + gap;
      if (top + ph > vh - 8) top = tr.top - ph - gap;

      this.countryPanelStyle = {
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(tr.left)}px`,
        width: `${Math.round(pw)}px`,
        zIndex: 250,
      };
    },
  };
}
