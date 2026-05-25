/**
 * apSlider — Range slider component
 *
 * Config:
 *   value       number  (default: min)
 *   min         number  (default 0)
 *   max         number  (default 100)
 *   step        number  (default 1)
 *   disabled    boolean
 *   showTooltip boolean  (default true)
 *   format      (value: number) => string  — optional display formatter
 *
 * Livewire: x-modelable="value" + wire:model.live="field"
 */
export default function apSlider(config = {}) {
  return {
    min:         config.min         ?? 0,
    max:         config.max         ?? 100,
    step:        config.step        ?? 1,
    disabled:    config.disabled    ?? false,
    showTooltip: config.showTooltip ?? true,
    format:      config.format      ?? (v => String(v)),
    dragging:    false,

    value: config.value !== undefined
      ? config.value
      : (config.min ?? 0),

    init() {
      this.$watch('value', val => {
        this.$dispatch('input',  val);
        this.$dispatch('change', val);
      });
    },

    get percentage() {
      const range = this.max - this.min;
      if (range === 0) return 0;
      return ((this.value - this.min) / range) * 100;
    },

    get displayValue() {
      return this.format(this.value);
    },

    onInput(event) {
      this.value = Number(event.target.value);
    },
  };
}
