/**
 * apDropdown — Generic dropdown component
 *
 * Config:
 *   placement   'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'  (default: 'bottom-start')
 *   disabled    boolean  (default false)
 *   width       'auto' | 'trigger' | string CSS width  (default: 'auto')
 *
 * Livewire usage:
 *   <div x-data="apDropdown()" @click.outside="close()">
 *     <button @click="toggle()">...</button>
 *     <div x-show="open" x-cloak :class="positionClass">...</div>
 *   </div>
 */
export default function apDropdown(config = {}) {
  return {
    open:      false,
    disabled:  config.disabled  ?? false,
    placement: config.placement ?? 'bottom-start',

    toggle() {
      if (this.disabled) return;
      this.open = !this.open;
    },

    close() {
      this.open = false;
    },

    get positionClass() {
      const map = {
        'bottom-start': 'top-full left-0 mt-1',
        'bottom-end':   'top-full right-0 mt-1',
        'top-start':    'bottom-full left-0 mb-1',
        'top-end':      'bottom-full right-0 mb-1',
      };
      return map[this.placement] ?? map['bottom-start'];
    },
  };
}
