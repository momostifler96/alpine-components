/**
 * apDemoCopy — Copie le snippet d'exemple d'un composant dans le presse-papiers.
 *
 * @param {Object} [config]
 * @param {string} [config.snippet] Code source à copier (prioritaire sur le contenu du DOM)
 * @returns {Object} Données Alpine
 *
 * @example
 * <div x-data="apDemoCopy({ snippet: '<div x-data=\"apDropdown()\">...' })">
 *   <button @click="copySnippet()">Copier le code</button>
 * </div>
 */
export default function apDemoCopy(config = {}) {
  return {
    copied: false,
    snippet: config.snippet ?? '',

    /**
     * Copie le snippet dans le presse-papiers et affiche un toast.
     *
     * @returns {Promise<void>}
     */
    async copySnippet() {
      const el = this.$refs.snippet;
      const text = (this.snippet || el?.textContent || '').trim();
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        window.Alpine?.store('toast')?.success?.('Code copié dans le presse-papiers', 'Copié');
        setTimeout(() => { this.copied = false; }, 2000);
      } catch {
        window.Alpine?.store('toast')?.error?.('Impossible de copier le code', 'Erreur');
      }
    },
  };
}
