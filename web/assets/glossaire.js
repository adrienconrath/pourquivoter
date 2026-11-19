// Glossaire : les termes soulignés en pointillés ouvrent une bulle avec une phrase de la page de référence.
// Sans JavaScript, chaque terme reste un lien ordinaire vers cette page.
(() => {
  const dataNode = document.getElementById("glossaire-data");
  if (!dataNode) return;
  let data = {};
  try { data = JSON.parse(dataNode.textContent); } catch (error) { return; }

  const hoverQuery = matchMedia("(hover: hover) and (pointer: fine)");
  const icon = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
    '<path d="M9 2h5v5M14 2 7.5 8.5M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5" ' +
    'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const pop = document.createElement("div");
  pop.id = "gl-pop";
  pop.className = "gl-pop";
  pop.setAttribute("role", "tooltip");
  pop.hidden = true;
  pop.innerHTML = '<p class="gl-text"><span class="gl-sentence"></span> ' +
    '<a class="gl-open" target="_blank" rel="noopener">' + icon + '<span class="gl-sr"></span></a></p>' +
    '<small class="gl-source"></small>';
  document.body.append(pop);
  const sentence = pop.querySelector(".gl-sentence");
  const open = pop.querySelector(".gl-open");
  const openLabel = pop.querySelector(".gl-sr");
  const source = pop.querySelector(".gl-source");

  let current = null;
  let pinned = false;
  let showTimer = 0;
  let hideTimer = 0;
  let restoringFocus = false;

  function place() {
    if (!current) return;
    const rects = current.getClientRects();
    const rect = rects.length ? rects[0] : current.getBoundingClientRect();
    const margin = 12;
    pop.style.left = "0px";
    pop.style.top = "0px";
    const width = pop.offsetWidth;
    const height = pop.offsetHeight;
    let top = rect.bottom + 8;
    if (top + height > innerHeight - margin && rect.top - height - 8 > margin) top = rect.top - height - 8;
    const left = Math.max(margin, Math.min(rect.left, innerWidth - width - margin));
    pop.style.left = left + "px";
    pop.style.top = Math.max(margin, top) + "px";
  }

  function show(link, pin) {
    const entry = data[link.dataset.gl];
    if (!entry) return;
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (current && current !== link) current.removeAttribute("aria-describedby");
    current = link;
    pinned = pin;
    sentence.textContent = entry.sentence;
    open.href = entry.url;
    openLabel.textContent = "Ouvrir la page « " + entry.label + " » (" + entry.source + ", nouvel onglet)";
    source.textContent = "Source : " + entry.source;
    link.setAttribute("aria-describedby", pop.id);
    pop.hidden = false;
    place();
  }

  function hide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (current) current.removeAttribute("aria-describedby");
    pop.hidden = true;
    current = null;
    pinned = false;
  }

  function scheduleHide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (!pinned) hideTimer = setTimeout(hide, 220);
  }

  document.addEventListener("mouseover", event => {
    if (!hoverQuery.matches) return;
    const link = event.target.closest?.(".gl");
    if (link) {
      clearTimeout(hideTimer);
      if (link !== current) {
        clearTimeout(showTimer);
        showTimer = setTimeout(() => show(link, false), 130);
      }
    } else if (event.target.closest?.("#gl-pop")) {
      clearTimeout(hideTimer);
    }
  });

  document.addEventListener("mouseout", event => {
    if (!hoverQuery.matches) return;
    if (event.target.closest?.(".gl") || event.target.closest?.("#gl-pop")) {
      const next = event.relatedTarget;
      if (next?.closest?.(".gl") === current || next?.closest?.("#gl-pop")) return;
      scheduleHide();
    }
  });

  document.addEventListener("focusin", event => {
    if (restoringFocus) return;
    const link = event.target.closest?.(".gl");
    if (link && link !== current) show(link, false);
  });

  document.addEventListener("focusout", event => {
    if (pinned) return;
    const next = event.relatedTarget;
    if (next?.closest?.("#gl-pop") || next?.closest?.(".gl")) return;
    if (event.target.closest?.(".gl") || event.target.closest?.("#gl-pop")) hide();
  });

  document.addEventListener("click", event => {
    const link = event.target.closest?.(".gl");
    if (link) {
      event.preventDefault();
      if (current === link && !pop.hidden && pinned) {
        hide();
      } else {
        show(link, true);
        if (event.detail === 0) open.focus();
      }
      return;
    }
    if (!event.target.closest?.("#gl-pop")) hide();
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || pop.hidden) return;
    const back = current;
    hide();
    restoringFocus = true;
    back?.focus({preventScroll: true});
    restoringFocus = false;
  });

  addEventListener("resize", () => { if (!pop.hidden) place(); });
  addEventListener("scroll", () => {
    if (pop.hidden) return;
    if (hoverQuery.matches) place(); else hide();
  }, {passive: true, capture: true});
})();
