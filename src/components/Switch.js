/**
 * apSwitch — Toggle switch component
 *
 * Config:
 *   value     boolean  (default false)
 *   disabled  boolean  (default false)
 *
 * Livewire: x-modelable="value" + wire:model.live="field"
 */
export default function apSwitch(config = {}) {
  return {
    value:    config.value    ?? false,
    disabled: config.disabled ?? false,

    init() {
      this.$watch('value', val => {
        this.$dispatch('input',  val);
        this.$dispatch('change', val);
      });
    },

    toggle() {
      if (this.disabled) return;
      this.value = !this.value;
    },
  };
}
