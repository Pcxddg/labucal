/* ============================================================
   LABUCAL — scroll-driven scenes
   1) Anatomia (layer assembly)  2) Processo (journey)
   3) Controle (scan + checklist) 4) Rede (network draw-in)
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // progress 0..1 through a pinned track (track is taller than the viewport)
  const pinProgress = (track) => {
    const r = track.getBoundingClientRect();
    const total = track.offsetHeight - innerHeight;
    return clamp(-r.top / (total || 1), 0, 1);
  };

  /* ---------- 1. ANATOMIA — layer assembly ---------- */
  const hero = $(".hero");
  const heroTeeth = $("#heroTeeth");
  function heroProsthesis() {
    if (!hero || !heroTeeth) return;
    const vh = innerHeight || document.documentElement.clientHeight;
    const raw = scrollY / Math.min(760, vh * 0.82);
    const p = clamp(raw, 0, 1);
    const eased = p * p * (3 - (2 * p));
    const upperY = -150 + (eased * 110);
    const lowerY = 170 - (eased * 115);
    const scale = 0.86 + (eased * 0.12);
    heroTeeth.style.setProperty("--teeth-upper-y", `${upperY.toFixed(1)}px`);
    heroTeeth.style.setProperty("--teeth-lower-y", `${lowerY.toFixed(1)}px`);
    heroTeeth.style.setProperty("--teeth-scale", scale.toFixed(3));
  }

  const aTrack = $(".assembly-track");
  const layers = $$("#layerStack .layer");
  const legend = $$("#assemblyLegend li");
  const scrub = $("#assemblyScrub");
  const hint = $("#assemblyHint");
  const N = layers.length;
  function anatomia() {
    if (!aTrack) return;
    const p = pinProgress(aTrack);
    if (scrub) scrub.style.height = (p * 100) + "%";
    if (hint) hint.style.opacity = p > 0.05 ? "0" : "1";
    layers.forEach((el, i) => {
      const start = i === 0 ? -0.32 : 0.08 + (i - 1) * 0.18;
      const end = start + 0.44;
      const t = easeInOutCubic(clamp((p - start) / (end - start), 0, 1));
      const fromY = -190 - (N - i) * 34;
      el.style.transform = `translateY(${((1 - t) * fromY).toFixed(1)}px) scale(${(.96 + t * .04).toFixed(3)})`;
      el.style.opacity = (.04 + .96 * t).toFixed(3);
      const lit = t > 0.55;
      el.classList.toggle("lit", lit);
      if (legend[i]) legend[i].classList.toggle("active", lit);
    });
  }

  /* ---------- 2. PROCESSO — journey ---------- */
  const pTrack = $(".proc-track");
  const procFill = $("#procFill");
  const procToken = $("#procToken");
  let pSteps = [];
  function processo() {
    if (!pTrack) return;
    if (!pSteps.length) pSteps = $$("#steps .step");
    if (!pSteps.length) return;
    const p = pinProgress(pTrack);
    // ease the token along, hold a beat at each end
    const tp = clamp((p - 0.06) / 0.88, 0, 1);
    if (procFill) procFill.style.width = (tp * 100) + "%";
    if (procToken) procToken.style.left = (tp * 100) + "%";
    pSteps.forEach((s, i) => {
      const thresh = i / Math.max(1, pSteps.length - 1);
      s.classList.toggle("lit", tp >= thresh - 0.04);
    });
  }

  /* ---------- 3. CONTROLE — scan + checklist ---------- */
  const cTrack = $(".ctrl-track");
  const scan = $("#ctrlScan");
  const checks = $$("#ctrlChecklist li");
  const marks = [$("#mark0"), $("#mark1"), $("#mark2")];
  const stamp = $("#ctrlStamp");
  const CHECK_AT = [0.30, 0.55, 0.80];
  function controle() {
    if (!cTrack) return;
    const p = pinProgress(cTrack);
    if (scan) {
      const sweep = clamp((p - 0.08) / 0.82, 0, 1);
      scan.style.top = (8 + sweep * 84) + "%";
      scan.classList.toggle("active", p > 0.06 && p < 0.96);
    }
    checks.forEach((li, i) => {
      const done = p >= CHECK_AT[i];
      li.classList.toggle("done", done);
      if (marks[i]) marks[i].classList.toggle("on", done);
    });
    if (stamp) stamp.classList.toggle("show", p >= 0.92);
  }

  /* ---------- 4. REDE — network draw-in ---------- */
  const netSvg = $("#netSvg");
  if (netSvg) {
    $$("line", netSvg).forEach(l => {
      try { l.style.setProperty("--len", Math.ceil(l.getTotalLength()) + "px"); } catch (e) {}
    });
    const drawIO = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          $$("line", netSvg).forEach((l, i) => { l.style.transitionDelay = (i * 70) + "ms"; });
          $$(".node", netSvg).forEach((n, i) => { n.style.transitionDelay = (200 + i * 80) + "ms"; });
          netSvg.classList.add("drawn");
          drawIO.disconnect();
        }
      });
    }, { threshold: 0.2 });
    drawIO.observe(netSvg);
  }

  /* ---------- 5. FOOTER — subtle prosthesis reveal ---------- */
  const footer = $("#footer");
  function footerReveal() {
    if (!footer) return;
    footer.classList.toggle("in", footer.getBoundingClientRect().top < innerHeight * 0.86);
  }
  if (footer) {
    const footerIO = new IntersectionObserver((entries) => {
      entries.forEach(en => footer.classList.toggle("in", en.isIntersecting));
    }, { threshold: 0.18 });
    footerIO.observe(footer);
  }

  /* ---------- reduced motion: jump to final states ---------- */
  if (reduce) {
    if (heroTeeth) {
      heroTeeth.style.setProperty("--teeth-upper-y", "-40px");
      heroTeeth.style.setProperty("--teeth-lower-y", "55px");
      heroTeeth.style.setProperty("--teeth-scale", ".98");
    }
    layers.forEach(el => { el.classList.add("lit"); el.style.transform = "none"; el.style.opacity = "1"; });
    legend.forEach(l => l.classList.add("active"));
    $$("#steps .step").forEach(s => s.classList.add("lit"));
    if (procFill) procFill.style.width = "100%";
    if (procToken) procToken.style.left = "100%";
    checks.forEach((li, i) => { li.classList.add("done"); if (marks[i]) marks[i].classList.add("on"); });
    if (stamp) stamp.classList.add("show");
    return;
  }

  /* ---------- rAF loop ---------- */
  let ticking = false;
  function frame() { heroProsthesis(); anatomia(); processo(); controle(); footerReveal(); ticking = false; }
  function onScroll() { if (!ticking) { requestAnimationFrame(frame); ticking = true; } }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", frame);
  frame();
})();
