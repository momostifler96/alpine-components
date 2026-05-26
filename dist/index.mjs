function R(t = {}) {
  return {
    open: !1,
    search: "",
    focused: !1,
    value: t.value !== void 0 ? t.value : t.multiple ? [] : null,
    options: t.options ?? [],
    multiple: t.multiple ?? !1,
    placeholder: t.placeholder ?? "Sélectionner...",
    searchable: t.searchable ?? !1,
    disabled: t.disabled ?? !1,
    clearable: t.clearable ?? !0,
    maxSelected: t.maxSelected ?? null,
    init() {
      this.$watch("value", (e) => {
        this.$dispatch("input", e), this.$dispatch("change", e);
      });
    },
    // ── Computed ──────────────────────────────────────────────────────────────
    get filteredOptions() {
      if (!this.search.trim()) return this.options;
      const e = this.search.toLowerCase();
      return this.options.filter(
        (s) => String(s.label ?? s.value).toLowerCase().includes(e)
      );
    },
    get selectedOption() {
      return this.multiple ? null : this.options.find((e) => e.value === this.value) ?? null;
    },
    get selectedOptions() {
      return this.multiple ? (this.value ?? []).map((e) => this.options.find((s) => s.value === e)).filter(Boolean) : [];
    },
    get hasValue() {
      return this.multiple ? (this.value ?? []).length > 0 : this.value !== null && this.value !== void 0 && this.value !== "";
    },
    get canAddMore() {
      return !this.multiple || this.maxSelected === null ? !0 : (this.value ?? []).length < this.maxSelected;
    },
    // ── Actions ───────────────────────────────────────────────────────────────
    select(e) {
      if (!e.disabled)
        if (this.multiple) {
          const s = this.value ?? [];
          this.value = s.includes(e.value) ? s.filter((i) => i !== e.value) : this.canAddMore ? [...s, e.value] : s;
        } else
          this.value = e.value, this.open = !1, this.search = "";
    },
    removeTag(e, s) {
      s == null || s.stopPropagation(), this.value = (this.value ?? []).filter((i) => i !== e);
    },
    clear(e) {
      e == null || e.stopPropagation(), this.value = this.multiple ? [] : null;
    },
    isSelected(e) {
      return this.multiple ? (this.value ?? []).includes(e) : this.value === e;
    },
    toggleOpen() {
      this.disabled || (this.open = !this.open, this.open && this.searchable && this.$nextTick(() => {
        var e;
        return (e = this.$refs.searchInput) == null ? void 0 : e.focus();
      }));
    },
    close() {
      this.open = !1, this.search = "";
    },
    // ── Prefix/Suffix renderer ────────────────────────────────────────────────
    renderItem(e, s = "sm") {
      if (!e) return "";
      const i = { xs: 14, sm: 16, md: 20 }[s] ?? 16;
      switch (e.type) {
        case "image":
          return `<img src="${e.src}" alt="${e.alt ?? ""}" width="${i}" height="${i}" class="rounded object-cover shrink-0 inline-block" style="min-width:${i}px;height:${i}px">`;
        case "icon":
          return `<span class="inline-flex items-center justify-center shrink-0" style="width:${i}px;height:${i}px">${e.svg}</span>`;
        case "text":
          return `<span class="text-sm text-gray-500 shrink-0 leading-none">${e.content}</span>`;
        case "badge": {
          const l = {
            green: "bg-green-100 text-green-700",
            blue: "bg-blue-100 text-blue-700",
            red: "bg-red-100 text-red-700",
            yellow: "bg-yellow-100 text-yellow-700",
            purple: "bg-purple-100 text-purple-700",
            indigo: "bg-indigo-100 text-indigo-700",
            gray: "bg-gray-100 text-gray-600"
          };
          return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${l[e.color ?? "gray"] ?? l.gray}">${e.content}</span>`;
        }
        case "dot": {
          const l = {
            green: "bg-green-400",
            red: "bg-red-400",
            yellow: "bg-yellow-400",
            blue: "bg-blue-400",
            purple: "bg-purple-400",
            gray: "bg-gray-400"
          };
          return `<span class="inline-block rounded-full shrink-0 ${l[e.color ?? "gray"] ?? l.gray}" style="width:8px;height:8px;margin-top:3px"></span>`;
        }
        default:
          return "";
      }
    }
  };
}
function T(t = {}) {
  return {
    open: !1,
    disabled: t.disabled ?? !1,
    placement: t.placement ?? "bottom-start",
    useFixed: t.fixed ?? !0,
    widthMode: t.width ?? "auto",
    resolvedPlacement: "bottom-start",
    panelStyle: {},
    init() {
      this.$watch("open", (e) => {
        e ? this.$nextTick(() => {
          this.updatePosition(), this._bindReposition();
        }) : this._unbindReposition();
      });
    },
    /**
     * Bascule l'état ouvert/fermé du dropdown.
     */
    toggle() {
      this.disabled || (this.open = !this.open);
    },
    /**
     * Ferme le dropdown.
     */
    close() {
      this.open = !1;
    },
    /**
     * Classes CSS pour le positionnement relatif (mode non-fixed).
     *
     * @returns {string}
     */
    get positionClass() {
      const e = {
        "bottom-start": "top-full left-0 mt-1",
        "bottom-end": "top-full right-0 mt-1",
        "top-start": "bottom-full left-0 mb-1",
        "top-end": "bottom-full right-0 mb-1"
      };
      return e[this.resolvedPlacement] ?? e["bottom-start"];
    },
    /**
     * Classes du panneau (fixed ou absolute selon la config).
     *
     * @returns {string}
     */
    get panelClass() {
      const e = "z-[200] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden";
      return this.useFixed ? `fixed ${e}` : `absolute ${this.positionClass} ${e}`;
    },
    /**
     * Recalcule la position du panneau pour qu'il reste visible dans le viewport.
     */
    updatePosition() {
      const e = this.$refs.trigger ?? this.$el.querySelector("[data-dropdown-trigger]"), s = this.$refs.panel ?? this.$el.querySelector("[data-dropdown-panel]");
      if (!e || !s) return;
      const i = 6, l = e.getBoundingClientRect(), a = s.offsetWidth || s.scrollWidth || 192, o = s.offsetHeight || s.scrollHeight || 120, d = window.innerWidth, c = window.innerHeight, h = 8;
      let m = this.placement.startsWith("top") ? "top" : "bottom", y = this.placement.endsWith("end") ? "end" : "start";
      m === "bottom" && l.bottom + o + i > c - h && (m = "top"), m === "top" && l.top - o - i < h && (m = "bottom"), y === "start" && l.left + a > d - h && (y = "end"), y === "end" && l.right - a < h && (y = "start"), this.resolvedPlacement = `${m}-${y}`;
      let n, r;
      m === "bottom" ? n = l.bottom + i : n = l.top - o - i, y === "start" ? r = l.left : r = l.right - a, r = Math.max(h, Math.min(r, d - a - h)), n = Math.max(h, Math.min(n, c - o - h));
      const u = {
        top: `${Math.round(n)}px`,
        left: `${Math.round(r)}px`
      };
      this.widthMode === "trigger" && (u.width = `${Math.round(l.width)}px`), this.panelStyle = u;
    },
    /** @private */
    _bindReposition() {
      this._onReposition = () => this.open && this.updatePosition(), window.addEventListener("scroll", this._onReposition, !0), window.addEventListener("resize", this._onReposition);
    },
    /** @private */
    _unbindReposition() {
      this._onReposition && (window.removeEventListener("scroll", this._onReposition, !0), window.removeEventListener("resize", this._onReposition), this._onReposition = null);
    }
  };
}
function k(t = {}) {
  return {
    value: t.value ?? "",
    type: t.type ?? "text",
    placeholder: t.placeholder ?? "",
    prefix: t.prefix ?? null,
    suffix: t.suffix ?? null,
    disabled: t.disabled ?? !1,
    readonly: t.readonly ?? !1,
    clearable: t.clearable ?? !1,
    focused: !1,
    showPassword: !1,
    init() {
      this.$watch("value", (e) => {
        this.$dispatch("input", e), this.$dispatch("change", e);
      });
    },
    get inputType() {
      return this.type === "password" ? this.showPassword ? "text" : "password" : this.type;
    },
    get hasValue() {
      return this.value !== "" && this.value !== null && this.value !== void 0;
    },
    get isPassword() {
      return this.type === "password";
    },
    clear() {
      this.value = "", this.$nextTick(() => {
        var e;
        return (e = this.$refs.input) == null ? void 0 : e.focus();
      });
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    renderAddon(e, s = "prefix") {
      if (!e) return "";
      switch (e.type) {
        case "icon":
          return `<span class="inline-flex items-center justify-center w-5 h-5 text-gray-400">${e.svg}</span>`;
        case "text":
          return `<span class="text-sm text-gray-500 font-medium select-none whitespace-nowrap">${e.content}</span>`;
        default:
          return "";
      }
    }
  };
}
function C(t = {}) {
  return {
    tags: t.tags ? [...t.tags] : [],
    input: "",
    focused: !1,
    disabled: t.disabled ?? !1,
    placeholder: t.placeholder ?? "Ajouter un tag...",
    maxTags: t.maxTags ?? null,
    allowDuplicates: t.allowDuplicates ?? !1,
    separators: t.separators ?? ["Enter", ","],
    init() {
      this.$watch("tags", (e) => {
        this.$dispatch("input", [...e]), this.$dispatch("change", [...e]);
      });
    },
    get value() {
      return this.tags;
    },
    get canAdd() {
      return this.maxTags === null || this.tags.length < this.maxTags;
    },
    addTag(e) {
      const s = String(e ?? "").trim();
      if (!(!s || !this.canAdd)) {
        if (!this.allowDuplicates && this.tags.includes(s)) {
          this.input = "";
          return;
        }
        this.tags = [...this.tags, s], this.input = "";
      }
    },
    removeTag(e) {
      this.tags = this.tags.filter((s, i) => i !== e);
    },
    onKeydown(e) {
      if (this.separators.includes(e.key)) {
        e.preventDefault(), this.addTag(this.input.replace(/,$/, ""));
        return;
      }
      e.key === "Backspace" && this.input === "" && this.tags.length && (this.tags = this.tags.slice(0, -1));
    },
    onPaste(e) {
      var l;
      const i = (((l = e.clipboardData) == null ? void 0 : l.getData("text")) ?? "").split(/[,\n\t]+/).map((a) => a.trim()).filter(Boolean);
      i.length > 1 && (e.preventDefault(), i.forEach((a) => this.addTag(a)));
    }
  };
}
function _(t = {}) {
  return {
    value: t.value ?? !1,
    disabled: t.disabled ?? !1,
    init() {
      this.$watch("value", (e) => {
        this.$dispatch("input", e), this.$dispatch("change", e);
      });
    },
    toggle() {
      this.disabled || (this.value = !this.value);
    }
  };
}
function N(t = {}) {
  return {
    min: t.min ?? 0,
    max: t.max ?? 100,
    step: t.step ?? 1,
    disabled: t.disabled ?? !1,
    showTooltip: t.showTooltip ?? !0,
    format: t.format ?? ((e) => String(e)),
    dragging: !1,
    value: t.value !== void 0 ? t.value : t.min ?? 0,
    init() {
      this.$watch("value", (e) => {
        this.$dispatch("input", e), this.$dispatch("change", e);
      });
    },
    get percentage() {
      const e = this.max - this.min;
      return e === 0 ? 0 : (this.value - this.min) / e * 100;
    },
    get displayValue() {
      return this.format(this.value);
    },
    onInput(e) {
      this.value = Number(e.target.value);
    }
  };
}
function D(t = {}) {
  const e = JSON.parse(JSON.stringify(t.data ?? {}));
  return {
    data: t.data ? { ...t.data } : {},
    errors: t.errors ? { ...t.errors } : {},
    loading: !1,
    success: !1,
    // ── Error helpers ─────────────────────────────────────────────────────────
    setErrors(s) {
      const i = {};
      for (const [l, a] of Object.entries(s ?? {}))
        i[l] = Array.isArray(a) ? a : [a];
      this.errors = i;
    },
    hasError(s) {
      var i;
      return (((i = this.errors[s]) == null ? void 0 : i.length) ?? 0) > 0;
    },
    getError(s) {
      var i;
      return ((i = this.errors[s]) == null ? void 0 : i[0]) ?? "";
    },
    clearError(s) {
      if (this.errors[s]) {
        const i = { ...this.errors };
        delete i[s], this.errors = i;
      }
    },
    clearErrors() {
      this.errors = {};
    },
    // ── Submission ────────────────────────────────────────────────────────────
    async submit(s, i = {}) {
      if (this.loading) return { ok: !1 };
      this.loading = !0, this.success = !1;
      try {
        const l = (i.method ?? "POST").toUpperCase(), a = i.transform ? i.transform(this.data) : this.data, o = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...i.headers
        }, d = document.querySelector('meta[name="csrf-token"]');
        d && (o["X-CSRF-TOKEN"] = d.content);
        const c = await fetch(s, {
          method: l,
          headers: o,
          body: l !== "GET" ? JSON.stringify(a) : void 0,
          signal: i.signal
        });
        let h;
        try {
          h = await c.json();
        } catch {
          h = null;
        }
        return c.ok ? (this.errors = {}, this.success = !0, this.$dispatch("form:success", { status: c.status, data: h }), { ok: !0, status: c.status, data: h }) : (c.status === 422 && (h != null && h.errors) && this.setErrors(h.errors), this.$dispatch("form:error", { status: c.status, data: h }), { ok: !1, status: c.status, data: h });
      } catch (l) {
        return l.name !== "AbortError" && this.$dispatch("form:error", { status: 0, error: l.message }), { ok: !1, error: l.message };
      } finally {
        this.loading = !1;
      }
    },
    // ── Reset ─────────────────────────────────────────────────────────────────
    reset() {
      this.errors = {}, this.success = !1, this.data = JSON.parse(JSON.stringify(e));
    }
  };
}
const S = [
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷", digits: 9 },
  { code: "BE", name: "Belgique", dial: "+32", flag: "🇧🇪", digits: 9 },
  { code: "CH", name: "Suisse", dial: "+41", flag: "🇨🇭", digits: 9 },
  { code: "LU", name: "Luxembourg", dial: "+352", flag: "🇱🇺", digits: 9 },
  { code: "DE", name: "Allemagne", dial: "+49", flag: "🇩🇪", digits: 11 },
  { code: "GB", name: "Royaume-Uni", dial: "+44", flag: "🇬🇧", digits: 10 },
  { code: "ES", name: "Espagne", dial: "+34", flag: "🇪🇸", digits: 9 },
  { code: "IT", name: "Italie", dial: "+39", flag: "🇮🇹", digits: 10 },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹", digits: 9 },
  { code: "NL", name: "Pays-Bas", dial: "+31", flag: "🇳🇱", digits: 9 },
  { code: "US", name: "États-Unis", dial: "+1", flag: "🇺🇸", digits: 10 },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", digits: 10 },
  { code: "MA", name: "Maroc", dial: "+212", flag: "🇲🇦", digits: 9 },
  { code: "TN", name: "Tunisie", dial: "+216", flag: "🇹🇳", digits: 8 },
  { code: "SN", name: "Sénégal", dial: "+221", flag: "🇸🇳", digits: 9 }
];
function M(t, e = S) {
  return e.find((s) => s.code === t);
}
function O(t) {
  return String(t).replace(/[\u00a0\u202f]/g, " ");
}
function E(t) {
  return t.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function $(t, e = "fr-FR") {
  if (t == null || t === "") return "";
  const s = e === "fr-FR" ? "," : ".", i = String(t).replace(/\s/g, ""), l = Math.max(i.lastIndexOf(","), i.lastIndexOf("."));
  let a = "", o = "";
  if (l >= 0 ? (a = i.slice(0, l).replace(/[^\d]/g, ""), o = i.slice(l + 1).replace(/[^\d]/g, "").slice(0, 2)) : a = i.replace(/[^\d]/g, ""), !a && !o) return "";
  const d = a ? E(a) : "0";
  return o !== "" || l >= 0 && i.endsWith(s) ? `${d}${s}${o}` : d;
}
function P(t, e = "fr-FR") {
  const s = parseFloat(String(t).replace(/\s/g, "").replace(",", "."));
  if (isNaN(s)) return "";
  const i = new Intl.NumberFormat(e, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(s);
  return O(i);
}
const F = {
  "phone-fr": {
    inputmode: "tel",
    placeholder: "06 12 34 56 78",
    live: !0,
    format(t) {
      const e = t.replace(/\D/g, "").slice(0, 10);
      return e ? e.replace(
        /^(\d{1,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/,
        (s, i, l, a, o, d) => [i, l, a, o, d].filter(Boolean).join(" ")
      ) : "";
    },
    toRaw: (t) => t.replace(/\D/g, ""),
    validate: (t) => /^(0[67]|0[1-9])\d{8}$/.test(t) || /^\+33[1-9]\d{8}$/.test(t)
  },
  "phone-intl": {
    inputmode: "tel",
    placeholder: "+33 6 12 34 56 78",
    live: !0,
    format(t) {
      const e = t.trimStart().startsWith("+"), s = t.replace(/\D/g, "").slice(0, 15);
      if (!s) return e ? "+" : "";
      const i = s.replace(
        /^(\d{1,3})(\d{0,3})(\d{0,3})(\d{0,4})$/,
        (l, a, o, d, c) => [a, o, d, c].filter(Boolean).join(" ")
      );
      return (e ? "+" : "") + i;
    },
    toRaw: (t) => t.replace(/[\s]/g, ""),
    validate: (t) => /^\+?[1-9]\d{6,14}$/.test(t.replace(/[\s\-().]/g, ""))
  },
  "money-eur": {
    inputmode: "decimal",
    placeholder: "0,00",
    locale: "fr-FR",
    live: !0,
    format(t, e) {
      return t === "" || t == null ? "" : e ? $(t, "fr-FR") : P(t, "fr-FR");
    },
    focusDisplay(t) {
      return t ? $(String(t).replace(".", ","), "fr-FR") : "";
    },
    toRaw: (t) => String(t).replace(/\s/g, "").replace(",", "."),
    validate: (t) => t === "" || !isNaN(parseFloat(t))
  },
  "money-usd": {
    inputmode: "decimal",
    placeholder: "0.00",
    locale: "en-US",
    live: !0,
    format(t, e) {
      return t === "" || t == null ? "" : e ? $(t, "en-US") : P(t, "en-US");
    },
    focusDisplay(t) {
      return t ? $(String(t ?? ""), "en-US") : "";
    },
    toRaw: (t) => String(t).replace(/\s/g, "").replace(/,/g, ""),
    validate: (t) => t === "" || !isNaN(parseFloat(t))
  },
  card: {
    inputmode: "numeric",
    placeholder: "0000 0000 0000 0000",
    live: !0,
    format: (t) => t.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "),
    toRaw: (t) => t.replace(/\D/g, ""),
    validate: (t) => t.replace(/\D/g, "").length === 16
  },
  "date-fr": {
    inputmode: "numeric",
    placeholder: "JJ/MM/AAAA",
    live: !0,
    format(t) {
      const e = t.replace(/\D/g, "").slice(0, 8);
      return e.length <= 2 ? e : e.length <= 4 ? `${e.slice(0, 2)}/${e.slice(2)}` : `${e.slice(0, 2)}/${e.slice(2, 4)}/${e.slice(4)}`;
    },
    toRaw: (t) => t.replace(/\D/g, ""),
    validate(t) {
      const e = t.replace(/\D/g, "");
      if (e.length !== 8) return !1;
      const s = +e.slice(0, 2), i = +e.slice(2, 4), l = +e.slice(4);
      return s >= 1 && s <= 31 && i >= 1 && i <= 12 && l >= 1900;
    }
  },
  siret: {
    inputmode: "numeric",
    placeholder: "000 000 000 00000",
    live: !0,
    format(t) {
      const e = t.replace(/\D/g, "").slice(0, 14);
      return e.length <= 3 ? e : e.length <= 6 ? `${e.slice(0, 3)} ${e.slice(3)}` : e.length <= 9 ? `${e.slice(0, 3)} ${e.slice(3, 6)} ${e.slice(6)}` : `${e.slice(0, 3)} ${e.slice(3, 6)} ${e.slice(6, 9)} ${e.slice(9)}`;
    },
    toRaw: (t) => t.replace(/\D/g, ""),
    validate: (t) => t.replace(/\D/g, "").length === 14
  }
};
function v(t) {
  return t ? t.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : "";
}
function I(t = {}) {
  var h, m, y;
  const e = typeof t.mask == "string" ? t.mask : null, s = typeof t.mask == "object" && ((h = t.mask) != null && h.pattern) ? t.mask.pattern : null, i = typeof t.mask == "object" && ((m = t.mask) != null && m.regex) ? t.mask.regex : null, l = ((y = t.mask) == null ? void 0 : y.hint) ?? null, a = e && e !== "phone-country" ? F[e] : null, o = e === "phone-country", d = M(t.country ?? "FR") ?? S[0], c = {
    raw: String(t.value ?? ""),
    display: "",
    value: String(t.value ?? ""),
    placeholder: t.placeholder ?? (a == null ? void 0 : a.placeholder) ?? "",
    disabled: t.disabled ?? !1,
    prefix: t.prefix ?? null,
    suffix: t.suffix ?? null,
    focused: !1,
    rxHint: l,
    init() {
      if (o) {
        this._initPhoneCountry();
        return;
      }
      this.display = this._fmt(this.raw, !1), this.$watch("value", (n) => {
        const r = String(n ?? "");
        r !== this.raw && (this.raw = r, this.display = this._fmt(r, this.focused));
      });
    },
    get inputmode() {
      return o ? "tel" : (a == null ? void 0 : a.inputmode) ?? "text";
    },
    get isValid() {
      var n, r;
      if (o) {
        if (!this.phoneNumber) return !0;
        const u = this.phoneNumber.length;
        return u >= Math.min(6, ((n = this.country) == null ? void 0 : n.digits) ?? 9) && u <= (((r = this.country) == null ? void 0 : r.digits) ?? 15);
      }
      return this.raw ? a != null && a.validate ? a.validate(this.display) : i ? new RegExp(i).test(this.raw) : !0 : !0;
    },
    _fmt(n, r) {
      return a ? a.format(n, r) : s ? this._patternMask(n, s) : n;
    },
    _toRaw(n) {
      return a != null && a.toRaw ? a.toRaw(n) : s ? n.replace(/[^A-Z0-9]/gi, "") : n;
    },
    _patternMask(n, r) {
      const u = n.replace(/[^A-Z0-9]/gi, "");
      let p = "", f = 0;
      for (let b = 0; b < r.length && f < u.length; b++) {
        const w = r[b], g = u[f];
        if (w === "#") {
          if (!/\d/.test(g)) break;
          p += g, f++;
        } else if (w === "A") {
          if (!/[A-Za-z]/.test(g)) break;
          p += g.toUpperCase(), f++;
        } else w === "*" ? (p += g.toUpperCase(), f++) : (p += w, g === w && f++);
      }
      return p;
    },
    onFocus() {
      this.focused = !0, a != null && a.focusDisplay && (this.display = a.focusDisplay(this.raw), this.$nextTick(() => {
        var n;
        return (n = this.$refs.input) == null ? void 0 : n.select();
      }));
    },
    onInput(n) {
      const r = n.target, u = this.display.length;
      if (a && a.live === !1 ? (this.display = r.value, this.raw = this._toRaw(r.value)) : (this.raw = this._toRaw(r.value), this.display = this._fmt(this.raw, !0)), this.value = this.raw, this.$dispatch("input", this.raw), a != null && a.live || s) {
        const p = this.display.length - u;
        p > 0 && this.$nextTick(() => {
          if (!r.isConnected) return;
          const f = Math.min(r.selectionStart + p, this.display.length);
          r.setSelectionRange(f, f);
        });
      }
    },
    onBlur() {
      if (this.focused = !1, a != null && a.live) {
        if (e != null && e.startsWith("money-")) {
          const n = this._toRaw(this.display);
          if (!String(this.display).trim()) {
            this.raw = "", this.display = "", this.value = "", this.$dispatch("change", "");
            return;
          }
          const r = parseFloat(String(n).replace(",", "."));
          isNaN(r) || (this.raw = String(r), this.display = this._fmt(this.raw, !1), this.value = this.raw, this.$dispatch("input", this.raw), this.$dispatch("change", this.raw));
          return;
        }
        this.$dispatch("change", this.raw);
        return;
      }
      if (a && !a.live) {
        const n = this._toRaw(this.display), r = parseFloat(n.replace(",", "."));
        isNaN(r) ? (this.raw = "", this.display = "", this.value = "") : (this.raw = String(r), this.display = this._fmt(this.raw, !1), this.value = this.raw, this.$dispatch("input", this.raw), this.$dispatch("change", this.raw));
      } else
        this.$dispatch("change", this.raw);
    }
  };
  return o ? {
    ...c,
    countries: t.countries ?? S,
    countryCode: d.code,
    country: d,
    dialCode: d.dial,
    phoneNumber: "",
    fullPhone: "",
    countryOpen: !1,
    countryPanelStyle: {},
    /**
     * Initialise le mode téléphone avec sélecteur de pays.
     * @private
     */
    _initPhoneCountry() {
      const n = String(t.value ?? "").replace(/\D/g, "");
      if (n) {
        const r = this.country.dial.replace(/\D/g, "");
        n.startsWith(r) ? this.phoneNumber = n.slice(r.length) : this.phoneNumber = n;
      }
      this.display = v(this.phoneNumber), this._syncPhoneOutputs(), this.$watch("value", (r) => {
        const u = String(r ?? "").replace(/\s/g, "");
        u && u !== this.fullPhone && (this.fullPhone = u);
      });
    },
    /**
     * Pays actuellement sélectionné.
     * @returns {import('../data/phoneCountries.js').PhoneCountry}
     */
    get selectedCountry() {
      return this.country;
    },
    /**
     * Ouvre/ferme le sélecteur de pays.
     */
    toggleCountryPicker() {
      this.disabled || (this.countryOpen = !this.countryOpen, this.countryOpen && this.$nextTick(() => this._positionCountryPanel()));
    },
    /**
     * Ferme le sélecteur de pays.
     */
    closeCountryPicker() {
      this.countryOpen = !1;
    },
    /**
     * Sélectionne un pays et réémet les valeurs.
     *
     * @param {import('../data/phoneCountries.js').PhoneCountry} c
     */
    selectCountry(n) {
      this.country = n, this.countryCode = n.code, this.dialCode = n.dial, this.countryOpen = !1;
      const r = n.digits ?? 15;
      this.phoneNumber.length > r && (this.phoneNumber = this.phoneNumber.slice(0, r), this.display = v(this.phoneNumber)), this._syncPhoneOutputs(), this.$dispatch("country-change", {
        country: this.countryCode,
        dialCode: this.dialCode
      });
    },
    /**
     * Saisie du numéro national (sans indicatif).
     *
     * @param {Event} event
     */
    onPhoneInput(n) {
      var p;
      const r = ((p = this.country) == null ? void 0 : p.digits) ?? 15, u = n.target.value.replace(/\D/g, "").slice(0, r);
      this.phoneNumber = u, this.display = v(u), this._syncPhoneOutputs(), this.$dispatch("input", this.fullPhone);
    },
    onPhoneFocus() {
      this.focused = !0;
    },
    onPhoneBlur() {
      this.focused = !1, this.$dispatch("change", this.fullPhone);
    },
    /**
     * Met à jour fullPhone, value et émet phone-change.
     * @private
     */
    _syncPhoneOutputs() {
      const n = (this.dialCode ?? "").replace(/\s/g, ""), r = this.phoneNumber ?? "";
      this.fullPhone = r ? `${n}${r}` : n, this.raw = r, this.value = this.fullPhone, this.$dispatch("phone-change", {
        country: this.countryCode,
        dialCode: this.dialCode,
        number: r,
        full: this.fullPhone
      });
    },
    /**
     * Positionne le panneau pays pour rester visible (fixed).
     * @private
     */
    _positionCountryPanel() {
      const n = this.$refs.countryTrigger, r = this.$refs.countryPanel;
      if (!n || !r) return;
      const u = 4, p = n.getBoundingClientRect(), f = r.offsetHeight || 220, b = Math.max(r.offsetWidth || 220, 220), w = window.innerHeight;
      let g = p.bottom + u;
      g + f > w - 8 && (g = p.top - f - u), this.countryPanelStyle = {
        position: "fixed",
        top: `${Math.round(g)}px`,
        left: `${Math.round(p.left)}px`,
        width: `${Math.round(b)}px`,
        zIndex: 250
      };
    }
  } : c;
}
const x = 320;
function A(t) {
  t.store("toast", {
    items: [],
    _id: 0,
    transitionMs: x,
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
    add({ type: e = "info", title: s = "", message: i = "", duration: l = 4500, action: a = null }) {
      const o = ++this._id;
      return this.items.push({ id: o, type: e, title: s, message: i, action: a, visible: !0 }), l > 0 && setTimeout(() => this.dismiss(o), l), o;
    },
    /**
     * Masque puis retire un toast après la transition de sortie.
     *
     * @param {number} id
     */
    dismiss(e) {
      const s = this.items.find((i) => i.id === e);
      s && (s.visible = !1, setTimeout(() => {
        this.items = this.items.filter((i) => i.id !== e);
      }, x));
    },
    /** Retire tous les toasts avec animation. */
    clear() {
      this.items.forEach((e) => e.visible = !1), setTimeout(() => this.items = [], x);
    },
    /**
     * @param {string} message
     * @param {string} [title='Succès']
     * @param {Object} [opts]
     */
    success(e, s = "Succès", i = {}) {
      return this.add({ type: "success", title: s, message: e, ...i });
    },
    /**
     * @param {string} message
     * @param {string} [title='Erreur']
     * @param {Object} [opts]
     */
    error(e, s = "Erreur", i = {}) {
      return this.add({ type: "error", title: s, message: e, ...i });
    },
    /**
     * @param {string} message
     * @param {string} [title='Attention']
     * @param {Object} [opts]
     */
    warning(e, s = "Attention", i = {}) {
      return this.add({ type: "warning", title: s, message: e, ...i });
    },
    /**
     * @param {string} message
     * @param {string} [title='Info']
     * @param {Object} [opts]
     */
    info(e, s = "Info", i = {}) {
      return this.add({ type: "info", title: s, message: e, ...i });
    }
  }), window.$toast = t.store("toast");
}
function B(t) {
  A(t), t.data("apSelect", R), t.data("apDropdown", T), t.data("apInputText", k), t.data("apInputTags", C), t.data("apSwitch", _), t.data("apSlider", N), t.data("apForm", D), t.data("apInputMask", I);
}
export {
  x as TOAST_TRANSITION_MS,
  T as apDropdown,
  D as apForm,
  I as apInputMask,
  C as apInputTags,
  k as apInputText,
  R as apSelect,
  N as apSlider,
  _ as apSwitch,
  B as default,
  A as registerToastStore
};
