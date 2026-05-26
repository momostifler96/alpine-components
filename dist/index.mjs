function k(t = {}) {
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
        (i) => String(i.label ?? i.value).toLowerCase().includes(e)
      );
    },
    get selectedOption() {
      return this.multiple ? null : this.options.find((e) => e.value === this.value) ?? null;
    },
    get selectedOptions() {
      return this.multiple ? (this.value ?? []).map((e) => this.options.find((i) => i.value === e)).filter(Boolean) : [];
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
          const i = this.value ?? [];
          this.value = i.includes(e.value) ? i.filter((s) => s !== e.value) : this.canAddMore ? [...i, e.value] : i;
        } else
          this.value = e.value, this.open = !1, this.search = "";
    },
    removeTag(e, i) {
      i == null || i.stopPropagation(), this.value = (this.value ?? []).filter((s) => s !== e);
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
    renderItem(e, i = "sm") {
      if (!e) return "";
      const s = { xs: 14, sm: 16, md: 20 }[i] ?? 16;
      switch (e.type) {
        case "image":
          return `<img src="${e.src}" alt="${e.alt ?? ""}" width="${s}" height="${s}" class="rounded object-cover shrink-0 inline-block" style="min-width:${s}px;height:${s}px">`;
        case "icon":
          return `<span class="inline-flex items-center justify-center shrink-0" style="width:${s}px;height:${s}px">${e.svg}</span>`;
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
function C(t = {}) {
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
      const e = this.$refs.trigger ?? this.$el.querySelector("[data-dropdown-trigger]"), i = this.$refs.panel ?? this.$el.querySelector("[data-dropdown-panel]");
      if (!e || !i) return;
      const s = 6, l = e.getBoundingClientRect(), o = i.offsetWidth || i.scrollWidth || 192, h = i.offsetHeight || i.scrollHeight || 120, p = window.innerWidth, r = window.innerHeight, u = 8;
      let m = this.placement.startsWith("top") ? "top" : "bottom", y = this.placement.endsWith("end") ? "end" : "start";
      m === "bottom" && l.bottom + h + s > r - u && (m = "top"), m === "top" && l.top - h - s < u && (m = "bottom"), y === "start" && l.left + o > p - u && (y = "end"), y === "end" && l.right - o < u && (y = "start"), this.resolvedPlacement = `${m}-${y}`;
      let w, b;
      m === "bottom" ? w = l.bottom + s : w = l.top - h - s, y === "start" ? b = l.left : b = l.right - o, b = Math.max(u, Math.min(b, p - o - u)), w = Math.max(u, Math.min(w, r - h - u));
      const a = {
        top: `${Math.round(w)}px`,
        left: `${Math.round(b)}px`
      };
      this.widthMode === "trigger" && (a.width = `${Math.round(l.width)}px`), this.panelStyle = a;
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
function _(t = {}) {
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
    renderAddon(e, i = "prefix") {
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
function N(t = {}) {
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
      const i = String(e ?? "").trim();
      if (!(!i || !this.canAdd)) {
        if (!this.allowDuplicates && this.tags.includes(i)) {
          this.input = "";
          return;
        }
        this.tags = [...this.tags, i], this.input = "";
      }
    },
    removeTag(e) {
      this.tags = this.tags.filter((i, s) => s !== e);
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
      const s = (((l = e.clipboardData) == null ? void 0 : l.getData("text")) ?? "").split(/[,\n\t]+/).map((o) => o.trim()).filter(Boolean);
      s.length > 1 && (e.preventDefault(), s.forEach((o) => this.addTag(o)));
    }
  };
}
function D(t = {}) {
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
function M(t = {}) {
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
function O(t = {}) {
  const e = JSON.parse(JSON.stringify(t.data ?? {}));
  return {
    data: t.data ? { ...t.data } : {},
    errors: t.errors ? { ...t.errors } : {},
    loading: !1,
    success: !1,
    // ── Error helpers ─────────────────────────────────────────────────────────
    setErrors(i) {
      const s = {};
      for (const [l, o] of Object.entries(i ?? {}))
        s[l] = Array.isArray(o) ? o : [o];
      this.errors = s;
    },
    hasError(i) {
      var s;
      return (((s = this.errors[i]) == null ? void 0 : s.length) ?? 0) > 0;
    },
    getError(i) {
      var s;
      return ((s = this.errors[i]) == null ? void 0 : s[0]) ?? "";
    },
    clearError(i) {
      if (this.errors[i]) {
        const s = { ...this.errors };
        delete s[i], this.errors = s;
      }
    },
    clearErrors() {
      this.errors = {};
    },
    // ── Submission ────────────────────────────────────────────────────────────
    async submit(i, s = {}) {
      if (this.loading) return { ok: !1 };
      this.loading = !0, this.success = !1;
      try {
        const l = (s.method ?? "POST").toUpperCase(), o = s.transform ? s.transform(this.data) : this.data, h = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...s.headers
        }, p = document.querySelector('meta[name="csrf-token"]');
        p && (h["X-CSRF-TOKEN"] = p.content);
        const r = await fetch(i, {
          method: l,
          headers: h,
          body: l !== "GET" ? JSON.stringify(o) : void 0,
          signal: s.signal
        });
        let u;
        try {
          u = await r.json();
        } catch {
          u = null;
        }
        return r.ok ? (this.errors = {}, this.success = !0, this.$dispatch("form:success", { status: r.status, data: u }), { ok: !0, status: r.status, data: u }) : (r.status === 422 && (u != null && u.errors) && this.setErrors(u.errors), this.$dispatch("form:error", { status: r.status, data: u }), { ok: !1, status: r.status, data: u });
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
const R = [
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
function E(t, e = R) {
  return e.find((i) => i.code === t);
}
function F(t) {
  return String(t).replace(/[\u00a0\u202f]/g, " ");
}
function I(t) {
  return t.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function v(t, e = "fr-FR") {
  if (t == null || t === "") return "";
  const i = e === "fr-FR" ? "," : ".", s = String(t).replace(/\s/g, ""), l = Math.max(s.lastIndexOf(","), s.lastIndexOf("."));
  let o = "", h = "";
  if (l >= 0 ? (o = s.slice(0, l).replace(/[^\d]/g, ""), h = s.slice(l + 1).replace(/[^\d]/g, "").slice(0, 2)) : o = s.replace(/[^\d]/g, ""), !o && !h) return "";
  const p = o ? I(o) : "0";
  return h !== "" || l >= 0 && (s.endsWith(",") || s.endsWith(".")) ? `${p}${i}${h}` : p;
}
function T(t, e = "fr-FR") {
  const i = parseFloat(String(t).replace(/\s/g, "").replace(",", "."));
  if (isNaN(i)) return "";
  const s = new Intl.NumberFormat(e, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(i);
  return F(s);
}
const A = {
  "phone-fr": {
    inputmode: "tel",
    placeholder: "06 12 34 56 78",
    live: !0,
    format(t) {
      const e = t.replace(/\D/g, "").slice(0, 10);
      return e ? e.replace(
        /^(\d{1,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/,
        (i, s, l, o, h, p) => [s, l, o, h, p].filter(Boolean).join(" ")
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
      const e = t.trimStart().startsWith("+"), i = t.replace(/\D/g, "").slice(0, 15);
      if (!i) return e ? "+" : "";
      const s = i.replace(
        /^(\d{1,3})(\d{0,3})(\d{0,3})(\d{0,4})$/,
        (l, o, h, p, r) => [o, h, p, r].filter(Boolean).join(" ")
      );
      return (e ? "+" : "") + s;
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
      return t === "" || t == null ? "" : e ? v(t, "fr-FR") : T(t, "fr-FR");
    },
    focusDisplay(t) {
      return t ? v(String(t).replace(".", ","), "fr-FR") : "";
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
      return t === "" || t == null ? "" : e ? v(t, "en-US") : T(t, "en-US");
    },
    focusDisplay(t) {
      return t ? v(String(t ?? ""), "en-US") : "";
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
      const i = +e.slice(0, 2), s = +e.slice(2, 4), l = +e.slice(4);
      return i >= 1 && i <= 31 && s >= 1 && s <= 12 && l >= 1900;
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
function S(t) {
  return t ? t.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : "";
}
function B(t = {}) {
  var y, w, b;
  const e = typeof t.mask == "string" ? t.mask : null, i = typeof t.mask == "object" && ((y = t.mask) != null && y.pattern) ? t.mask.pattern : null, s = typeof t.mask == "object" && ((w = t.mask) != null && w.regex) ? t.mask.regex : null, l = ((b = t.mask) == null ? void 0 : b.hint) ?? null, o = e === "phone-country", h = t.maxDigits ?? 8, p = e === "number" ? {
    inputmode: "numeric",
    placeholder: t.placeholder ?? "",
    live: !0,
    format: (a) => a.replace(/\D/g, "").slice(0, h),
    toRaw: (a) => a.replace(/\D/g, ""),
    validate: (a) => !a || a.length <= h
  } : null, r = e && !o ? p ?? A[e] : null, u = E(t.country ?? "FR") ?? R[0], m = {
    raw: String(t.value ?? ""),
    display: "",
    value: String(t.value ?? ""),
    placeholder: t.placeholder ?? (r == null ? void 0 : r.placeholder) ?? "",
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
      this.display = this._fmt(this.raw, !1), this.$watch("value", (a) => {
        const n = String(a ?? "");
        n !== this.raw && (this.raw = n, this.display = this._fmt(n, this.focused));
      });
    },
    get inputmode() {
      return o ? "tel" : (r == null ? void 0 : r.inputmode) ?? "text";
    },
    get isValid() {
      var a, n;
      if (o) {
        if (!this.phoneNumber) return !0;
        const d = this.phoneNumber.length;
        return d >= Math.min(6, ((a = this.country) == null ? void 0 : a.digits) ?? 9) && d <= (((n = this.country) == null ? void 0 : n.digits) ?? 15);
      }
      return this.raw ? r != null && r.validate ? r.validate(this.display) : s ? new RegExp(s).test(this.raw) : !0 : !0;
    },
    _fmt(a, n) {
      return r ? r.format(a, n) : i ? this._patternMask(a, i) : a;
    },
    _toRaw(a) {
      return r != null && r.toRaw ? r.toRaw(a) : i ? a.replace(/[^A-Z0-9]/gi, "") : a;
    },
    _patternMask(a, n) {
      const d = a.replace(/[^A-Z0-9]/gi, "");
      let c = "", f = 0;
      for (let x = 0; x < n.length && f < d.length; x++) {
        const $ = n[x], g = d[f];
        if ($ === "#") {
          if (!/\d/.test(g)) break;
          c += g, f++;
        } else if ($ === "A") {
          if (!/[A-Za-z]/.test(g)) break;
          c += g.toUpperCase(), f++;
        } else $ === "*" ? (c += g.toUpperCase(), f++) : (c += $, g === $ && f++);
      }
      return c;
    },
    onFocus() {
      this.focused = !0, r != null && r.focusDisplay && (this.display = r.focusDisplay(this.raw), this.$nextTick(() => {
        var a;
        return (a = this.$refs.input) == null ? void 0 : a.select();
      }));
    },
    onInput(a) {
      const n = a.target, d = this.display.length;
      if (r && r.live === !1 ? (this.display = n.value, this.raw = this._toRaw(n.value)) : (this.raw = this._toRaw(n.value), this.display = this._fmt(this.raw, !0)), this.value = this.raw, this.$dispatch("input", this.raw), r != null && r.live || i) {
        const c = this.display.length - d;
        c > 0 && this.$nextTick(() => {
          if (!n.isConnected) return;
          const f = Math.min(n.selectionStart + c, this.display.length);
          n.setSelectionRange(f, f);
        });
      }
    },
    onBlur() {
      if (this.focused = !1, r != null && r.live) {
        if (e != null && e.startsWith("money-")) {
          const a = this._toRaw(this.display);
          if (!String(this.display).trim()) {
            this.raw = "", this.display = "", this.value = "", this.$dispatch("change", "");
            return;
          }
          const n = parseFloat(String(a).replace(",", "."));
          isNaN(n) || (this.raw = String(n), this.display = this._fmt(this.raw, !1), this.value = this.raw, this.$dispatch("input", this.raw), this.$dispatch("change", this.raw));
          return;
        }
        this.$dispatch("change", this.raw);
        return;
      }
      if (r && !r.live) {
        const a = this._toRaw(this.display), n = parseFloat(a.replace(",", "."));
        isNaN(n) ? (this.raw = "", this.display = "", this.value = "") : (this.raw = String(n), this.display = this._fmt(this.raw, !1), this.value = this.raw, this.$dispatch("input", this.raw), this.$dispatch("change", this.raw));
      } else
        this.$dispatch("change", this.raw);
    }
  };
  return o ? {
    ...m,
    countries: t.countries ?? R,
    countryCode: u.code,
    country: u,
    dialCode: u.dial,
    phoneNumber: "",
    fullPhone: "",
    countryOpen: !1,
    countryPanelStyle: {},
    /**
     * Initialise le mode téléphone avec sélecteur de pays.
     * @private
     */
    _initPhoneCountry() {
      const a = String(t.value ?? "").replace(/\D/g, "");
      if (a) {
        const n = this.country.dial.replace(/\D/g, "");
        a.startsWith(n) ? this.phoneNumber = a.slice(n.length) : this.phoneNumber = a;
      }
      this.display = S(this.phoneNumber), this._syncPhoneOutputs(), this.$watch("value", (n) => {
        const d = String(n ?? "").replace(/\s/g, "");
        d && d !== this.fullPhone && (this.fullPhone = d);
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
    selectCountry(a) {
      this.country = a, this.countryCode = a.code, this.dialCode = a.dial, this.countryOpen = !1;
      const n = a.digits ?? 15;
      this.phoneNumber.length > n && (this.phoneNumber = this.phoneNumber.slice(0, n), this.display = S(this.phoneNumber)), this._syncPhoneOutputs(), this.$dispatch("country-change", {
        country: this.countryCode,
        dialCode: this.dialCode
      });
    },
    /**
     * Saisie du numéro national (sans indicatif).
     *
     * @param {Event} event
     */
    onPhoneInput(a) {
      var c;
      const n = ((c = this.country) == null ? void 0 : c.digits) ?? 15, d = a.target.value.replace(/\D/g, "").slice(0, n);
      this.phoneNumber = d, this.display = S(d), this._syncPhoneOutputs(), this.$dispatch("input", this.fullPhone);
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
      const a = (this.dialCode ?? "").replace(/\s/g, ""), n = this.phoneNumber ?? "";
      this.fullPhone = n ? `${a}${n}` : a, this.raw = n, this.value = this.fullPhone, this.$dispatch("phone-change", {
        country: this.countryCode,
        dialCode: this.dialCode,
        number: n,
        full: this.fullPhone
      });
    },
    /**
     * Positionne le panneau pays pour rester visible (fixed).
     * @private
     */
    _positionCountryPanel() {
      const a = this.$refs.countryTrigger, n = this.$refs.countryPanel;
      if (!a || !n) return;
      const d = 4, c = a.getBoundingClientRect(), f = n.offsetHeight || 220, x = Math.max(n.offsetWidth || 220, 220), $ = window.innerHeight;
      let g = c.bottom + d;
      g + f > $ - 8 && (g = c.top - f - d), this.countryPanelStyle = {
        position: "fixed",
        top: `${Math.round(g)}px`,
        left: `${Math.round(c.left)}px`,
        width: `${Math.round(x)}px`,
        zIndex: 250
      };
    }
  } : m;
}
const P = 320;
function j(t) {
  t.store("toast", {
    items: [],
    _id: 0,
    transitionMs: P,
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
    add({ type: e = "info", title: i = "", message: s = "", duration: l = 4500, action: o = null }) {
      const h = ++this._id;
      return this.items.push({ id: h, type: e, title: i, message: s, action: o, visible: !0 }), l > 0 && setTimeout(() => this.dismiss(h), l), h;
    },
    /**
     * Masque puis retire un toast après la transition de sortie.
     *
     * @param {number} id
     */
    dismiss(e) {
      const i = this.items.find((s) => s.id === e);
      i && (i.visible = !1, setTimeout(() => {
        this.items = this.items.filter((s) => s.id !== e);
      }, P));
    },
    /** Retire tous les toasts avec animation. */
    clear() {
      this.items.forEach((e) => e.visible = !1), setTimeout(() => this.items = [], P);
    },
    /**
     * @param {string} message
     * @param {string} [title='Succès']
     * @param {Object} [opts]
     */
    success(e, i = "Succès", s = {}) {
      return this.add({ type: "success", title: i, message: e, ...s });
    },
    /**
     * @param {string} message
     * @param {string} [title='Erreur']
     * @param {Object} [opts]
     */
    error(e, i = "Erreur", s = {}) {
      return this.add({ type: "error", title: i, message: e, ...s });
    },
    /**
     * @param {string} message
     * @param {string} [title='Attention']
     * @param {Object} [opts]
     */
    warning(e, i = "Attention", s = {}) {
      return this.add({ type: "warning", title: i, message: e, ...s });
    },
    /**
     * @param {string} message
     * @param {string} [title='Info']
     * @param {Object} [opts]
     */
    info(e, i = "Info", s = {}) {
      return this.add({ type: "info", title: i, message: e, ...s });
    }
  }), window.$toast = t.store("toast");
}
function U(t) {
  j(t), t.data("apSelect", k), t.data("apDropdown", C), t.data("apInputText", _), t.data("apInputTags", N), t.data("apSwitch", D), t.data("apSlider", M), t.data("apForm", O), t.data("apInputMask", B);
}
export {
  P as TOAST_TRANSITION_MS,
  C as apDropdown,
  O as apForm,
  B as apInputMask,
  N as apInputTags,
  _ as apInputText,
  k as apSelect,
  M as apSlider,
  D as apSwitch,
  U as default,
  j as registerToastStore
};
