/**
 * Durée des transitions CSS (ms) — synchronisée avec dismiss().
 * @type {number}
 */
export const TOAST_TRANSITION_MS = 320;

/**
 * Store toast — accessible globalement via $store.toast
 *
 * Usage (partout dans Alpine) :
 *   $store.toast.success('Enregistré avec succès')
 *   $store.toast.error('Une erreur est survenue', 'Erreur 500')
 *   $store.toast.dismiss(id)
 *
 * Accessible aussi via window.$toast
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export function registerToastStore(Alpine) {
  Alpine.store('toast', {
    items: [],
    _id: 0,
    transitionMs: TOAST_TRANSITION_MS,

    /**
     * Ajoute une notification toast.
     *
     * @param {Object} opts
     * @param {'success'|'error'|'warning'|'info'} [opts.type='info']
     * @param {string} [opts.title='']
     * @param {string} [opts.message='']
     * @param {number} [opts.duration=4500] 0 = persistant
     * @param {{ label: string, fn?: () => void }|null} [opts.action=null]
     * @returns {number} Identifiant du toast
     */
    add({ type = 'info', title = '', message = '', duration = 4500, action = null }) {
      const id = ++this._id;
      this.items.push({ id, type, title, message, action, visible: true });

      if (duration > 0) {
        setTimeout(() => this.dismiss(id), duration);
      }
      return id;
    },

    /**
     * Masque puis retire un toast après la transition de sortie.
     *
     * @param {number} id
     */
    dismiss(id) {
      const item = this.items.find(t => t.id === id);
      if (!item) return;
      item.visible = false;
      setTimeout(() => {
        this.items = this.items.filter(t => t.id !== id);
      }, TOAST_TRANSITION_MS);
    },

    /** Retire tous les toasts avec animation. */
    clear() {
      this.items.forEach(t => (t.visible = false));
      setTimeout(() => (this.items = []), TOAST_TRANSITION_MS);
    },

    /**
     * @param {string} message
     * @param {string} [title='Succès']
     * @param {Object} [opts]
     */
    success(message, title = 'Succès', opts = {}) {
      return this.add({ type: 'success', title, message, ...opts });
    },

    /**
     * @param {string} message
     * @param {string} [title='Erreur']
     * @param {Object} [opts]
     */
    error(message, title = 'Erreur', opts = {}) {
      return this.add({ type: 'error', title, message, ...opts });
    },

    /**
     * @param {string} message
     * @param {string} [title='Attention']
     * @param {Object} [opts]
     */
    warning(message, title = 'Attention', opts = {}) {
      return this.add({ type: 'warning', title, message, ...opts });
    },

    /**
     * @param {string} message
     * @param {string} [title='Info']
     * @param {Object} [opts]
     */
    info(message, title = 'Info', opts = {}) {
      return this.add({ type: 'info', title, message, ...opts });
    },
  });

  window.$toast = Alpine.store('toast');
}
