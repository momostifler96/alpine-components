/**
 * apDropdown — Dropdown générique avec positionnement intelligent (flip + fixed).
 *
 * Config :
 *   placement   'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'  (défaut : bottom-start)
 *   disabled    boolean  (défaut false)
 *   width       'auto' | 'trigger'  (défaut auto)
 *   fixed       boolean  (défaut true — position fixed pour éviter le clipping overflow)
 *
 * Marqueurs HTML recommandés :
 *   data-dropdown-trigger sur le bouton déclencheur
 *   data-dropdown-panel sur le panneau (x-ref="panel" équivalent)
 *
 * @example
 * <div x-data="apDropdown()" @click.outside="close()">
 *   <button data-dropdown-trigger @click="toggle()">...</button>
 *   <div data-dropdown-panel x-show="open" :style="panelStyle" :class="panelClass">...</div>
 * </div>
 */
export default function apDropdown(config = {}) {
  return {
    open: false,
    disabled: config.disabled ?? false,
    placement: config.placement ?? 'bottom-start',
    useFixed: config.fixed ?? true,
    widthMode: config.width ?? 'auto',
    resolvedPlacement: 'bottom-start',
    panelStyle: {},

    init() {
      this.$watch('open', isOpen => {
        if (isOpen) {
          this.$nextTick(() => {
            this.updatePosition();
            this._bindReposition();
          });
        } else {
          this._unbindReposition();
        }
      });
    },

    /**
     * Bascule l'état ouvert/fermé du dropdown.
     */
    toggle() {
      if (this.disabled) return;
      this.open = !this.open;
    },

    /**
     * Ferme le dropdown.
     */
    close() {
      this.open = false;
    },

    /**
     * Classes CSS pour le positionnement relatif (mode non-fixed).
     *
     * @returns {string}
     */
    get positionClass() {
      const map = {
        'bottom-start': 'top-full left-0 mt-1',
        'bottom-end': 'top-full right-0 mt-1',
        'top-start': 'bottom-full left-0 mb-1',
        'top-end': 'bottom-full right-0 mb-1',
      };
      return map[this.resolvedPlacement] ?? map['bottom-start'];
    },

    /**
     * Classes du panneau (fixed ou absolute selon la config).
     *
     * @returns {string}
     */
    get panelClass() {
      const base = 'z-[200] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden';
      if (this.useFixed) return `fixed ${base}`;
      return `absolute ${this.positionClass} ${base}`;
    },

    /**
     * Recalcule la position du panneau pour qu'il reste visible dans le viewport.
     */
    updatePosition() {
      const trigger =
        this.$refs.trigger ??
        this.$el.querySelector('[data-dropdown-trigger]');
      const panel =
        this.$refs.panel ??
        this.$el.querySelector('[data-dropdown-panel]');

      if (!trigger || !panel) return;

      const gap = 6;
      const tr = trigger.getBoundingClientRect();
      const pw = panel.offsetWidth || panel.scrollWidth || 192;
      const ph = panel.offsetHeight || panel.scrollHeight || 120;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;

      let vert = this.placement.startsWith('top') ? 'top' : 'bottom';
      let horiz = this.placement.endsWith('end') ? 'end' : 'start';

      if (vert === 'bottom' && tr.bottom + ph + gap > vh - margin) vert = 'top';
      if (vert === 'top' && tr.top - ph - gap < margin) vert = 'bottom';
      if (horiz === 'start' && tr.left + pw > vw - margin) horiz = 'end';
      if (horiz === 'end' && tr.right - pw < margin) horiz = 'start';

      this.resolvedPlacement = `${vert}-${horiz}`;

      let top;
      let left;

      if (vert === 'bottom') top = tr.bottom + gap;
      else top = tr.top - ph - gap;

      if (horiz === 'start') left = tr.left;
      else left = tr.right - pw;

      left = Math.max(margin, Math.min(left, vw - pw - margin));
      top = Math.max(margin, Math.min(top, vh - ph - margin));

      const style = {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
      };

      if (this.widthMode === 'trigger') {
        style.width = `${Math.round(tr.width)}px`;
      }

      this.panelStyle = style;
    },

    /** @private */
    _bindReposition() {
      this._onReposition = () => this.open && this.updatePosition();
      window.addEventListener('scroll', this._onReposition, true);
      window.addEventListener('resize', this._onReposition);
    },

    /** @private */
    _unbindReposition() {
      if (!this._onReposition) return;
      window.removeEventListener('scroll', this._onReposition, true);
      window.removeEventListener('resize', this._onReposition);
      this._onReposition = null;
    },
  };
}
