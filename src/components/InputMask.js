/**
 * apInputMask — Formatted input with presets and custom masks
 *
 * Config:
 *   value      initial value (raw)
 *   mask       string preset | { pattern: '##/##/####' } | { regex: '^[A-Z]{2}\\d{4}$', hint: '...' }
 *   placeholder override placeholder
 *   prefix     { type, ... }  — same as apInputText
 *   suffix     { type, ... }
 *   disabled   boolean
 *
 * Preset masks (mask: 'name'):
 *   phone-fr   · 06 12 34 56 78
 *   phone-intl · +33 6 12 34 56 78
 *   money-eur  · 1 234,56  (raw = decimal string, format on blur)
 *   money-usd  · 1,234.56  (raw = decimal string, format on blur)
 *   card       · 0000 0000 0000 0000
 *   date-fr    · JJ/MM/AAAA
 *   siret      · 000 000 000 00000
 *
 * Pattern mask (mask: { pattern: '##/##/####' }):
 *   #  = digit    A = letter (uppercased)   * = any char (uppercased)
 *   Any other character is treated as a literal separator (auto-inserted).
 *
 * Regex mask (mask: { regex: '...', hint: '...' }):
 *   Free-form input, validated against the regex on change.
 *   isValid turns false if the value doesn't match.
 *
 * Exposed:
 *   value   — raw value (bind with wire:model / x-model)
 *   display — formatted display string (bound to the visible input)
 *   isValid — boolean
 *   focused — boolean
 *
 * Livewire: x-modelable="value" + wire:model.live="field"
 */

// ── Preset definitions ────────────────────────────────────────────────────────

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
    placeholder: '+1 202 555 0123',
    live: true,
    format(raw) {
      const plus  = raw.trimStart().startsWith('+');
      const d     = raw.replace(/\D/g, '').slice(0, 15);
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
    live: false, // format only on blur
    format(raw, focused) {
      if (focused || raw === '' || raw == null) return raw ?? '';
      const n = parseFloat(String(raw).replace(',', '.'));
      if (isNaN(n)) return raw;
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    },
    // When user focuses, strip thousand separators so they can edit naturally
    focusDisplay: raw => {
      if (!raw) return '';
      return String(raw).replace(',', '.');
    },
    toRaw: s => String(s).replace(/\s/g, '').replace(',', '.'),
    validate: v => v === '' || !isNaN(parseFloat(v)),
  },

  'money-usd': {
    inputmode: 'decimal',
    placeholder: '0.00',
    live: false,
    format(raw, focused) {
      if (focused || raw === '' || raw == null) return raw ?? '';
      const n = parseFloat(String(raw).replace(/,/g, ''));
      if (isNaN(n)) return raw;
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    },
    focusDisplay: raw => String(raw ?? ''),
    toRaw: s => String(s).replace(/,/g, ''),
    validate: v => v === '' || !isNaN(parseFloat(v)),
  },

  'card': {
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
      const day = +d.slice(0, 2), month = +d.slice(2, 4), year = +d.slice(4);
      return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900;
    },
  },

  'siret': {
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function apInputMask(config = {}) {
  const maskKey  = typeof config.mask === 'string'                      ? config.mask       : null;
  const maskPat  = typeof config.mask === 'object' && config.mask?.pattern ? config.mask.pattern : null;
  const maskRx   = typeof config.mask === 'object' && config.mask?.regex   ? config.mask.regex   : null;
  const rxHint   = config.mask?.hint ?? null;
  const preset   = maskKey ? PRESETS[maskKey] : null;

  return {
    raw:     String(config.value ?? ''),
    display: '',
    value:   String(config.value ?? ''),

    placeholder: config.placeholder ?? preset?.placeholder ?? '',
    disabled:    config.disabled    ?? false,
    prefix:      config.prefix      ?? null,
    suffix:      config.suffix      ?? null,
    focused:     false,
    rxHint,

    // ── Lifecycle ────────────────────────────────────────────────────────────

    init() {
      this.display = this._fmt(this.raw, false);
      this.$watch('value', v => {
        const s = String(v ?? '');
        if (s !== this.raw) {
          this.raw     = s;
          this.display = this._fmt(s, this.focused);
        }
      });
    },

    // ── Computed ─────────────────────────────────────────────────────────────

    get inputmode() {
      return preset?.inputmode ?? 'text';
    },

    get isValid() {
      if (!this.raw) return true;
      if (preset?.validate)  return preset.validate(this.display);
      if (maskRx)            return new RegExp(maskRx).test(this.raw);
      return true;
    },

    // ── Internal formatter ────────────────────────────────────────────────────

    _fmt(raw, focused) {
      if (preset)   return preset.format(raw, focused);
      if (maskPat)  return this._patternMask(raw, maskPat);
      return raw;
    },

    _toRaw(display) {
      if (preset?.toRaw)  return preset.toRaw(display);
      if (maskPat)        return display.replace(/[^A-Z0-9]/gi, '');
      return display;
    },

    // Pattern mask: # digit  A letter  * any alphanum  other = literal separator
    _patternMask(input, pattern) {
      const src = input.replace(/[^A-Z0-9]/gi, '');
      let out = '', si = 0;
      for (let pi = 0; pi < pattern.length && si < src.length; pi++) {
        const pc = pattern[pi], sc = src[si];
        if      (pc === '#') { if (!/\d/.test(sc))      break; out += sc;             si++; }
        else if (pc === 'A') { if (!/[A-Za-z]/.test(sc)) break; out += sc.toUpperCase(); si++; }
        else if (pc === '*') { out += sc.toUpperCase(); si++; }
        else {
          out += pc;                     // auto-insert separator
          if (sc === pc) si++;           // skip if user already typed it
        }
      }
      return out;
    },

    // ── Event handlers ───────────────────────────────────────────────────────

    onFocus() {
      this.focused = true;
      if (preset && !preset.live && preset.focusDisplay) {
        this.display = preset.focusDisplay(this.raw);
        this.$nextTick(() => this.$refs.input?.select());
      }
    },

    onInput(event) {
      const input = event.target;
      const prevLen = this.display.length;

      if (preset && !preset.live) {
        // Money: keep raw user input, don't reformat while typing
        this.display = input.value;
        this.raw     = this._toRaw(input.value);
      } else {
        this.raw     = this._toRaw(input.value);
        this.display = this._fmt(this.raw, true);
      }

      this.value = this.raw;
      this.$dispatch('input', this.raw);

      // Advance cursor past auto-inserted separators (pattern / live masks)
      if (preset?.live || maskPat) {
        const inserted = this.display.length - input.value.length;
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

      if (preset && !preset.live) {
        // Money: parse + reformat on blur
        const raw = this._toRaw(this.display);
        const n   = parseFloat(raw.replace(',', '.'));
        if (!isNaN(n)) {
          this.raw     = String(n);
          this.display = this._fmt(this.raw, false);
          this.value   = this.raw;
          this.$dispatch('input',  this.raw);
          this.$dispatch('change', this.raw);
        } else {
          this.raw     = '';
          this.display = '';
          this.value   = '';
        }
      } else {
        this.$dispatch('change', this.raw);
      }
    },
  };
}
