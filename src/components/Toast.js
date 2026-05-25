/**
 * Toast store — globally accessible via $store.toast
 *
 * Usage (anywhere in Alpine):
 *   $store.toast.success('Enregistré avec succès')
 *   $store.toast.error('Une erreur est survenue', 'Erreur 500')
 *   $store.toast.warning('Quota presque atteint')
 *   $store.toast.info('Mise à jour disponible', 'Info', { duration: 0 }) // persistent
 *   $store.toast.dismiss(id)
 *
 * Also works globally: window.$toast.success(...)
 */
export function registerToastStore(Alpine) {
  Alpine.store('toast', {
    items: [],
    _id: 0,

    add({ type = 'info', title = '', message = '', duration = 4500, action = null }) {
      const id = ++this._id;
      this.items.push({ id, type, title, message, action, visible: true });

      if (duration > 0) {
        setTimeout(() => this.dismiss(id), duration);
      }
      return id;
    },

    dismiss(id) {
      const item = this.items.find(t => t.id === id);
      if (!item) return;
      item.visible = false;
      setTimeout(() => {
        this.items = this.items.filter(t => t.id !== id);
      }, 350);
    },

    clear() {
      this.items.forEach(t => (t.visible = false));
      setTimeout(() => (this.items = []), 350);
    },

    success(message, title = 'Succès', opts = {}) {
      return this.add({ type: 'success', title, message, ...opts });
    },
    error(message, title = 'Erreur', opts = {}) {
      return this.add({ type: 'error', title, message, ...opts });
    },
    warning(message, title = 'Attention', opts = {}) {
      return this.add({ type: 'warning', title, message, ...opts });
    },
    info(message, title = 'Info', opts = {}) {
      return this.add({ type: 'info', title, message, ...opts });
    },
  });

  // Shortcut on window for convenience
  window.$toast = Alpine.store('toast');
}
