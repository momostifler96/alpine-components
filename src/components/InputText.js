/**
 * apInputText — Text input with prefix/suffix support
 *
 * Config:
 *   value       string  (default '')
 *   type        'text'|'email'|'password'|'number'|'url'|'tel'  (default 'text')
 *   placeholder string
 *   prefix      { type: 'icon'|'text', svg?, content? }
 *   suffix      { type: 'icon'|'text'|'button', svg?, content?, label?, action? }
 *   disabled    boolean
 *   readonly    boolean
 *   clearable   boolean  (default false)
 *
 * Livewire: wire:model listens to the native `input` event which Alpine dispatches.
 * Use x-modelable="value" + wire:model.live="field" for full reactivity.
 */
export default function apInputText(config = {}) {
  return {
    value:       config.value       ?? '',
    type:        config.type        ?? 'text',
    placeholder: config.placeholder ?? '',
    prefix:      config.prefix      ?? null,
    suffix:      config.suffix      ?? null,
    disabled:    config.disabled    ?? false,
    readonly:    config.readonly    ?? false,
    clearable:   config.clearable   ?? false,
    focused:     false,
    showPassword: false,

    init() {
      this.$watch('value', val => {
        this.$dispatch('input',  val);
        this.$dispatch('change', val);
      });
    },

    get inputType() {
      if (this.type === 'password') return this.showPassword ? 'text' : 'password';
      return this.type;
    },

    get hasValue() {
      return this.value !== '' && this.value !== null && this.value !== undefined;
    },

    get isPassword() {
      return this.type === 'password';
    },

    clear() {
      this.value = '';
      this.$nextTick(() => this.$refs.input?.focus());
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    renderAddon(item, side = 'prefix') {
      if (!item) return '';
      switch (item.type) {
        case 'icon':
          return `<span class="inline-flex items-center justify-center w-5 h-5 text-gray-400">${item.svg}</span>`;
        case 'text':
          return `<span class="text-sm text-gray-500 font-medium select-none whitespace-nowrap">${item.content}</span>`;
        default:
          return '';
      }
    },
  };
}
