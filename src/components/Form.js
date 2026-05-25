/**
 * apForm — Form state management
 *
 * Config:
 *   data      {}   initial field values (reactive)
 *   errors    {}   initial errors (optional, e.g. pre-filled from SSR)
 *
 * API:
 *   data            reactive form fields
 *   errors          { fieldName: ['msg1', ...] }
 *   loading         boolean
 *   success         boolean
 *
 *   hasError(path)  → boolean   path: 'name' or 'members.0.name'
 *   getError(path)  → string    first error message
 *   setErrors(obj)  set errors from backend (normalises to arrays)
 *   clearError(path)
 *   clearErrors()
 *
 *   submit(url, options?) → { ok, status, data }
 *     options: { method, headers, transform(data) }
 *     Dispatches 'form:success' | 'form:error' on the root element
 *
 *   reset()   clear data to initial values + clear errors
 *
 * Livewire:
 *   Use @form:success.window to react globally, or wire into Livewire
 *   component errors via $wire.errorBag then call setErrors().
 */
export default function apForm(config = {}) {
  const _initial = JSON.parse(JSON.stringify(config.data ?? {}));

  return {
    data:    config.data    ? { ...config.data }    : {},
    errors:  config.errors  ? { ...config.errors }  : {},
    loading: false,
    success: false,

    // ── Error helpers ─────────────────────────────────────────────────────────

    setErrors(raw) {
      const norm = {};
      for (const [k, v] of Object.entries(raw ?? {})) {
        norm[k] = Array.isArray(v) ? v : [v];
      }
      this.errors = norm;
    },

    hasError(path) {
      return (this.errors[path]?.length ?? 0) > 0;
    },

    getError(path) {
      return this.errors[path]?.[0] ?? '';
    },

    clearError(path) {
      if (this.errors[path]) {
        const e = { ...this.errors };
        delete e[path];
        this.errors = e;
      }
    },

    clearErrors() {
      this.errors = {};
    },

    // ── Submission ────────────────────────────────────────────────────────────

    async submit(url, options = {}) {
      if (this.loading) return { ok: false };
      this.loading = true;
      this.success = false;

      try {
        const method  = (options.method ?? 'POST').toUpperCase();
        const payload = options.transform ? options.transform(this.data) : this.data;

        const headers = {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
          ...options.headers,
        };
        const csrf = document.querySelector('meta[name="csrf-token"]');
        if (csrf) headers['X-CSRF-TOKEN'] = csrf.content;

        const res = await fetch(url, {
          method,
          headers,
          body: method !== 'GET' ? JSON.stringify(payload) : undefined,
          signal: options.signal,
        });

        let body;
        try { body = await res.json(); } catch { body = null; }

        if (!res.ok) {
          if (res.status === 422 && body?.errors) {
            this.setErrors(body.errors);
          }
          this.$dispatch('form:error', { status: res.status, data: body });
          return { ok: false, status: res.status, data: body };
        }

        this.errors  = {};
        this.success = true;
        this.$dispatch('form:success', { status: res.status, data: body });
        return { ok: true, status: res.status, data: body };

      } catch (err) {
        if (err.name !== 'AbortError') {
          this.$dispatch('form:error', { status: 0, error: err.message });
        }
        return { ok: false, error: err.message };
      } finally {
        this.loading = false;
      }
    },

    // ── Reset ─────────────────────────────────────────────────────────────────

    reset() {
      this.errors  = {};
      this.success = false;
      this.data    = JSON.parse(JSON.stringify(_initial));
    },
  };
}
