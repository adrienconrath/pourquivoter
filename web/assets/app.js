const board = document.querySelector(".compare-board");
const headers = document.querySelector(".candidate-columns");
const columns = new Map([...headers.children].map(button => [button.dataset.person, button]));
const themes = [...document.querySelectorAll(".theme-panel")].map(panel => ({
  id: panel.dataset.theme,
  panel,
  row: panel.querySelector(".positions"),
  cells: new Map([...panel.querySelectorAll(".position")].map(card => [card.dataset.person, card])),
}));
const themePicker = document.querySelector(".theme-picker");
const themeButtons = [...themePicker.querySelectorAll("button")];
const closeColumns = document.querySelector("#close-columns");
const dialog = document.querySelector("#position-dialog");
const resultCount = document.querySelector("#result-count");
const emptyThemes = document.querySelector("#empty-themes");

const defaultPeople = matchMedia("(max-width: 670px)").matches ? ["attal"] : ["attal", "glucksmann"];
let expanded = [];
let selected = new Set();

function readSelection() {
  const params = new URLSearchParams(location.search);
  const matched = document.getElementById(location.hash.slice(1));
  const linkedTheme = matched?.closest(".theme-panel")?.dataset.theme;
  const linkedPerson = matched?.classList.contains("position") ? matched.dataset.person : null;
  selected = new Set((params.get("themes") ?? linkedTheme ?? "dette").split(","));
  if (linkedTheme) selected.add(linkedTheme);
  expanded = params.has("profils")
    ? [...new Set(params.get("profils").split(",").filter(person => columns.has(person)))]
    : defaultPeople.filter(person => columns.has(person));
  if (linkedPerson && !expanded.includes(linkedPerson)) expanded.unshift(linkedPerson);
  updateBoard();
  if (matched?.classList.contains("position")) matched.scrollIntoView({block: "nearest", inline: "nearest"});
}

function saveSelection() {
  const url = new URL(location.href);
  url.searchParams.set("themes", [...selected].join(","));
  url.searchParams.set("profils", expanded.join(","));
  url.searchParams.delete("rubrique");
  url.searchParams.delete("sources");
  if (url.hash.startsWith("#position-") || url.hash.startsWith("#theme-")) url.hash = "#comparer";
  history.replaceState(null, "", url);
}

function updateBoard() {
  const open = new Set(expanded);
  const order = [...expanded, ...[...columns.keys()].filter(person => !open.has(person))];
  board.style.setProperty("--tracks", order.map(person => open.has(person) ? "var(--open-track)" : "var(--closed-track)").join(" "));
  for (const person of order) {
    const button = columns.get(person);
    const isOpen = open.has(person);
    const name = button.querySelector("strong").textContent;
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", (isOpen ? "Fermer la colonne de " : "Ouvrir la colonne de ") + name);
    button.title = name;
    button.querySelector(".column-toggle").textContent = isOpen ? "−" : "+";
    headers.append(button);
  }
  for (const {id, panel, row, cells} of themes) {
    panel.hidden = !selected.has(id);
    for (const person of order) {
      const cell = cells.get(person);
      const collapsed = !open.has(person);
      cell.toggleAttribute("data-collapsed", collapsed);
      if (collapsed) cell.setAttribute("aria-hidden", "true");
      else cell.removeAttribute("aria-hidden");
      const read = cell.querySelector(".read-position");
      if (read) read.hidden = collapsed;
      row.append(cell);
    }
  }
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(selected.has(button.dataset.themeToggle)));
  }
  const count = themes.filter(theme => selected.has(theme.id)).length;
  emptyThemes.hidden = count > 0;
  closeColumns.disabled = expanded.length === 0;
  resultCount.textContent = `${expanded.length} ${expanded.length === 1 ? "colonne ouverte" : "colonnes ouvertes"} · ${count} ${count === 1 ? "thème" : "thèmes"}`;
}

themePicker.addEventListener("click", event => {
  const button = event.target.closest("[data-theme-toggle]");
  if (!button) return;
  const theme = button.dataset.themeToggle;
  const opening = !selected.has(theme);
  if (opening) selected.add(theme);
  else selected.delete(theme);
  saveSelection();
  updateBoard();
  if (opening) {
    const panel = document.getElementById("theme-" + theme);
    board.scrollTop = panel.offsetTop - headers.offsetHeight;
  }
});

headers.addEventListener("click", event => {
  const button = event.target.closest(".column-header");
  if (!button) return;
  const person = button.dataset.person;
  const opening = !expanded.includes(person);
  expanded = opening ? [person, ...expanded] : expanded.filter(item => item !== person);
  saveSelection();
  updateBoard();
  if (opening) board.scrollLeft = 0;
  button.focus({preventScroll: true});
});

closeColumns.addEventListener("click", () => {
  expanded = [];
  saveSelection();
  updateBoard();
  board.scrollLeft = 0;
  headers.firstElementChild.focus({preventScroll: true});
});

board.addEventListener("click", event => {
  const read = event.target.closest(".read-position");
  if (!read) return;
  const article = read.closest(".position");
  const theme = article.closest(".theme-panel");
  dialog.querySelector("#dialog-theme").textContent = theme.querySelector("h3").textContent;
  dialog.querySelector("#dialog-title").textContent = article.querySelector("h4").textContent;
  dialog.querySelector(".dialog-content").replaceChildren(article.querySelector(".position-content").cloneNode(true));
  dialog.showModal();
  dialog.scrollTop = 0;
});

window.addEventListener("popstate", readSelection);
window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#theme-") || location.hash.startsWith("#position-")) readSelection();
});

board.classList.add("is-interactive");
readSelection();
headers.hidden = false;
themePicker.hidden = false;
document.querySelector(".compare-actions").hidden = false;

if (typeof HTMLElement.prototype.showPopover === "function") {
  const overlay = document.createElement("div");
  overlay.className = "source-overlay";
  overlay.id = "source-overlay";
  overlay.popover = "manual";
  document.body.append(overlay);

  let active;
  let pinned = false;
  let closeTimer;

  function stopClosing() {
    clearTimeout(closeTimer);
  }

  function closeSource() {
    stopClosing();
    if (!active) return;
    active.removeAttribute("aria-expanded");
    active.removeAttribute("aria-controls");
    overlay.hidePopover();
    active = null;
    pinned = false;
  }

  function queueClose() {
    stopClosing();
    if (!pinned) closeTimer = setTimeout(closeSource, 180);
  }

  function placeOverlay() {
    const anchor = active.getBoundingClientRect();
    const below = innerHeight - anchor.bottom - 8;
    const above = anchor.top - 8;
    overlay.style.maxHeight = `${Math.max(80, Math.max(above, below))}px`;
    const {width, height} = overlay.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.right - width + 10, innerWidth - width - 8));
    const top = height > below && above > below
      ? anchor.top - height + 1
      : Math.max(8, Math.min(anchor.bottom - 1, innerHeight - height - 8));
    overlay.style.left = `${left}px`;
    overlay.style.top = `${top}px`;
  }

  function openSource(trigger, keepOpen = false) {
    stopClosing();
    if (active !== trigger) {
      closeSource();
      active = trigger;
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-controls", overlay.id);
      (trigger.closest("dialog") ?? document.body).append(overlay);
      overlay.replaceChildren(...[...trigger.nextElementSibling.childNodes].map(node => node.cloneNode(true)));
      overlay.showPopover();
      placeOverlay();
    }
    pinned = keepOpen;
  }

  document.addEventListener("pointerover", event => {
    const trigger = event.target.closest(".citation summary");
    if (event.pointerType === "mouse" && trigger && !pinned) openSource(trigger);
  });
  document.addEventListener("pointerout", event => {
    if (active?.contains(event.target) && !active.contains(event.relatedTarget) && !overlay.contains(event.relatedTarget)) {
      queueClose();
    }
  });
  overlay.addEventListener("pointerenter", stopClosing);
  overlay.addEventListener("pointerleave", event => {
    if (!active?.contains(event.relatedTarget)) queueClose();
  });
  document.addEventListener("click", event => {
    const trigger = event.target.closest(".citation summary");
    if (!trigger) {
      if (!overlay.contains(event.target)) closeSource();
      return;
    }
    event.preventDefault();
    if (active === trigger && pinned) closeSource();
    else {
      openSource(trigger, true);
      if (event.detail === 0) overlay.querySelector("a")?.focus();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !active) return;
    event.preventDefault();
    const trigger = active;
    closeSource();
    trigger.focus({preventScroll: true});
  });
  window.addEventListener("resize", closeSource);
  document.addEventListener("scroll", event => {
    if (event.target !== overlay) closeSource();
  }, {capture: true});
  dialog.addEventListener("close", closeSource);
}
