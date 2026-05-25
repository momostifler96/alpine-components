/**
 * apInputTags — Tag input component
 *
 * Config:
 *   tags            string[]  initial tags  (default [])
 *   placeholder     string
 *   maxTags         number|null
 *   allowDuplicates boolean  (default false)
 *   separators      string[]  keys that confirm a tag  (default ['Enter', ','])
 *
 * Livewire: expose via x-modelable="tags" + wire:model.live="field"
 */
export default function apInputTags(config = {}) {
  return {
    tags:            config.tags ? [...config.tags] : [],
    input:           '',
    focused:         false,
    disabled:        config.disabled        ?? false,
    placeholder:     config.placeholder     ?? 'Ajouter un tag...',
    maxTags:         config.maxTags         ?? null,
    allowDuplicates: config.allowDuplicates ?? false,
    separators:      config.separators      ?? ['Enter', ','],

    init() {
      this.$watch('tags', val => {
        this.$dispatch('input',  [...val]);
        this.$dispatch('change', [...val]);
      });
    },

    get value() {
      return this.tags;
    },

    get canAdd() {
      return this.maxTags === null || this.tags.length < this.maxTags;
    },

    addTag(raw) {
      const tag = String(raw ?? '').trim();
      if (!tag || !this.canAdd) return;
      if (!this.allowDuplicates && this.tags.includes(tag)) {
        this.input = '';
        return;
      }
      this.tags  = [...this.tags, tag];
      this.input = '';
    },

    removeTag(index) {
      this.tags = this.tags.filter((_, i) => i !== index);
    },

    onKeydown(event) {
      if (this.separators.includes(event.key)) {
        event.preventDefault();
        this.addTag(this.input.replace(/,$/, ''));
        return;
      }
      if (event.key === 'Backspace' && this.input === '' && this.tags.length) {
        this.tags = this.tags.slice(0, -1);
      }
    },

    onPaste(event) {
      const text  = event.clipboardData?.getData('text') ?? '';
      const parts = text.split(/[,\n\t]+/).map(s => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        event.preventDefault();
        parts.forEach(p => this.addTag(p));
      }
    },
  };
}
