const board = document.querySelector(".compare-board");
const columnScroll = document.querySelector(".column-scroll");
const headers = document.querySelector(".candidate-columns");
const candidatePicker = document.querySelector(".candidate-picker");
const candidateChoices = [...candidatePicker.querySelectorAll(".candidate-choice")];
const columns = new Map([...headers.children].map(button => [button.dataset.person, button]));
const themes = [...document.querySelectorAll(".theme-panel")].map(panel => ({
  id: panel.dataset.theme,
  panel,
  row: panel.querySelector(".positions"),
  cells: new Map([...panel.querySelectorAll(".position")].map(card => [card.dataset.person, card])),
}));
const themePicker = document.querySelector(".theme-picker");
const themeButtons = [...themePicker.querySelectorAll("button")];
const clearThemes = document.querySelector("#clear-themes");
const closeColumns = document.querySelector("#close-columns");
const dialog = document.querySelector("#position-dialog");
const resultCount = document.querySelector("#result-count");
const emptyThemes = document.querySelector("#empty-themes");

const defaultPeople = [];
let expanded = [];
let selected = new Set();

function readSelection() {
  const params = new URLSearchParams(location.search);
  const matched = document.getElementById(location.hash.slice(1));
  const linkedTheme = matched?.closest(".theme-panel")?.dataset.theme;
  const linkedPerson = matched?.classList.contains("position") ? matched.dataset.person : null;
  selected = new Set((params.get("themes") ?? linkedTheme ?? "dette").split(","));
  if (linkedTheme) selected.add(linkedTheme);
  selected = new Set(themes.filter(({id}) => selected.has(id)).map(({id}) => id));
  expanded = params.has("profils")
    ? [...new Set(params.get("profils").split(",").filter(person => columns.has(person)))]
    : defaultPeople.filter(person => columns.has(person));
  if (linkedPerson && !expanded.includes(linkedPerson)) expanded.unshift(linkedPerson);
  updateBoard();
  if (linkedTheme) matched.scrollIntoView({block: "start", inline: "nearest"});
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
  board.parentElement.style.setProperty("--tracks", expanded.map(() => "var(--open-track)").join(" "));
  for (const person of order) {
    const header = columns.get(person);
    header.hidden = !open.has(person);
    headers.append(header);
  }
  for (const button of candidateChoices) {
    button.setAttribute("aria-pressed", String(open.has(button.dataset.person)));
  }
  for (const {id, panel, row, cells} of themes) {
    panel.hidden = !selected.has(id);
    for (const person of order) {
      const cell = cells.get(person);
      const collapsed = !open.has(person);
      cell.hidden = collapsed;
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
  board.hidden = columnScroll.hidden = count === 0 || expanded.length === 0;
  clearThemes.disabled = count === 0;
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
});

clearThemes.addEventListener("click", () => {
  selected.clear();
  saveSelection();
  updateBoard();
  themeButtons[0].focus({preventScroll: true});
});

function syncHorizontalScroll(from, to) {
  from.addEventListener("scroll", () => {
    if (to.scrollLeft !== from.scrollLeft) to.scrollLeft = from.scrollLeft;
  });
}

syncHorizontalScroll(board, columnScroll);
syncHorizontalScroll(columnScroll, board);

candidatePicker.addEventListener("click", event => {
  const button = event.target.closest(".candidate-choice");
  if (!button) return;
  const person = button.dataset.person;
  const opening = !expanded.includes(person);
  expanded = opening ? [person, ...expanded] : expanded.filter(item => item !== person);
  saveSelection();
  updateBoard();
  if (opening) board.scrollLeft = columnScroll.scrollLeft = 0;
  button.focus({preventScroll: true});
});

closeColumns.addEventListener("click", () => {
  expanded = [];
  saveSelection();
  updateBoard();
  board.scrollLeft = columnScroll.scrollLeft = 0;
  candidateChoices[0].focus({preventScroll: true});
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
themePicker.hidden = false;
candidatePicker.hidden = false;
document.querySelector(".compare-actions").hidden = false;
