/**
 * apSelect — Alpine.js select component
 *
 * Config options:
 *   options[]       { value, label, prefix?, suffix?, disabled? }
 *   prefix/suffix   { type: 'image'|'icon'|'text'|'badge'|'dot', ...props }
 *   multiple        boolean  (default false)
 *   value           initial value (scalar or array when multiple)
 *   placeholder     string
 *   searchable      boolean (default false)
 *   clearable       boolean (default true)
 *   disabled        boolean (default false)
 *   maxSelected     number|null
 *
 * Livewire usage:
 *   <div x-data="apSelect({...})" x-modelable="value" wire:model.live="field">
 */
export default function apSelect(config = {}) {
  return {
    open: false,
    search: '',
    focused: false,

    value: config.value !== undefined
      ? config.value
      : (config.multiple ? [] : null),

    options:      config.options      ?? [],
    multiple:     config.multiple     ?? false,
    placeholder:  config.placeholder  ?? 'Sélectionner...',
    searchable:   config.searchable   ?? false,
    disabled:     config.disabled     ?? false,
    clearable:    config.clearable    ?? true,
    maxSelected:  config.maxSelected  ?? null,

    init() {
      this.$watch('value', val => {
        this.$dispatch('input',  val);
        this.$dispatch('change', val);
      });
    },

    // ── Computed ──────────────────────────────────────────────────────────────

    get filteredOptions() {
      if (!this.search.trim()) return this.options;
      const q = this.search.toLowerCase();
      return this.options.filter(o =>
        String(o.label ?? o.value).toLowerCase().includes(q)
      );
    },

    get selectedOption() {
      if (this.multiple) return null;
      return this.options.find(o => o.value === this.value) ?? null;
    },

    get selectedOptions() {
      if (!this.multiple) return [];
      return (this.value ?? [])
        .map(v => this.options.find(o => o.value === v))
        .filter(Boolean);
    },

    get hasValue() {
      return this.multiple
        ? (this.value ?? []).length > 0
        : this.value !== null && this.value !== undefined && this.value !== '';
    },

    get canAddMore() {
      if (!this.multiple || this.maxSelected === null) return true;
      return (this.value ?? []).length < this.maxSelected;
    },

    // ── Actions ───────────────────────────────────────────────────────────────

    select(option) {
      if (option.disabled) return;
      if (this.multiple) {
        const vals = this.value ?? [];
        this.value = vals.includes(option.value)
          ? vals.filter(v => v !== option.value)
          : this.canAddMore ? [...vals, option.value] : vals;
      } else {
        this.value = option.value;
        this.open  = false;
        this.search = '';
      }
    },

    removeTag(val, event) {
      event?.stopPropagation();
      this.value = (this.value ?? []).filter(v => v !== val);
    },

    clear(event) {
      event?.stopPropagation();
      this.value = this.multiple ? [] : null;
    },

    isSelected(val) {
      return this.multiple
        ? (this.value ?? []).includes(val)
        : this.value === val;
    },

    toggleOpen() {
      if (this.disabled) return;
      this.open = !this.open;
      if (this.open && this.searchable) {
        this.$nextTick(() => this.$refs.searchInput?.focus());
      }
    },

    close() {
      this.open   = false;
      this.search = '';
    },

    // ── Prefix/Suffix renderer ────────────────────────────────────────────────

    renderItem(item, size = 'sm') {
      if (!item) return '';
      const dim = { xs: 14, sm: 16, md: 20 }[size] ?? 16;

      switch (item.type) {
        case 'image':
          return `<img src="${item.src}" alt="${item.alt ?? ''}" width="${dim}" height="${dim}" class="rounded object-cover shrink-0 inline-block" style="min-width:${dim}px;height:${dim}px">`;

        case 'icon':
          return `<span class="inline-flex items-center justify-center shrink-0" style="width:${dim}px;height:${dim}px">${item.svg}</span>`;

        case 'text':
          return `<span class="text-sm text-gray-500 shrink-0 leading-none">${item.content}</span>`;

        case 'badge': {
          const palette = {
            green:  'bg-green-100 text-green-700',
            blue:   'bg-blue-100 text-blue-700',
            red:    'bg-red-100 text-red-700',
            yellow: 'bg-yellow-100 text-yellow-700',
            purple: 'bg-purple-100 text-purple-700',
            indigo: 'bg-indigo-100 text-indigo-700',
            gray:   'bg-gray-100 text-gray-600',
          };
          const cls = palette[item.color ?? 'gray'] ?? palette.gray;
          return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${cls}">${item.content}</span>`;
        }

        case 'dot': {
          const colors = {
            green:  'bg-green-400',
            red:    'bg-red-400',
            yellow: 'bg-yellow-400',
            blue:   'bg-blue-400',
            purple: 'bg-purple-400',
            gray:   'bg-gray-400',
          };
          const cls = colors[item.color ?? 'gray'] ?? colors.gray;
          return `<span class="inline-block rounded-full shrink-0 ${cls}" style="width:8px;height:8px;margin-top:3px"></span>`;
        }

        default:
          return '';
      }
    },
  };
}
