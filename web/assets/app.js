const filters = document.querySelector("#filters");
const themeInputs = [...filters.querySelectorAll('[name="theme"]')];
const personInputs = [...filters.querySelectorAll('[name="person"]')];
const panels = [...document.querySelectorAll(".theme-panel")];
const documented = document.querySelector("#documented");
const search = document.querySelector("#theme-search");
const resultCount = document.querySelector("#result-count");
const personCount = document.querySelector("#people-count");
const empty = document.querySelector("#empty-results");

function normalize(text) {
  return text.toLocaleLowerCase("fr").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function checkedValues(inputs) {
  return inputs.filter(input => input.checked).map(input => input.value);
}

function restore() {
  const params = new URLSearchParams(location.search);
  const themes = (params.get("themes") ?? "dette").split(",");
  const people = params.has("profils") ? params.get("profils").split(",") : null;
  const direct = location.hash.slice(7);
  for (const input of themeInputs) {
    input.checked = themes.includes(input.value) || (location.hash.startsWith("#theme-") && direct === input.value);
  }
  for (const input of personInputs) input.checked = people === null || people.includes(input.value);
  documented.checked = params.get("sources") === "1";
  render();
}

function render() {
  const themes = checkedValues(themeInputs);
  const people = checkedValues(personInputs);
  let visible = 0;
  for (const panel of panels) {
    let matches = 0;
    for (const article of panel.querySelectorAll(".position")) {
      const show = people.includes(article.dataset.person) && (!documented.checked || !article.hasAttribute("data-empty"));
      article.hidden = !show;
      if (show) matches++;
    }
    panel.hidden = !themes.includes(panel.dataset.theme) || matches === 0;
    if (!panel.hidden) visible += matches;
  }
  empty.hidden = visible !== 0;
  resultCount.textContent = `${visible} ${visible === 1 ? "résultat" : "résultats"} · ${themes.length} ${themes.length === 1 ? "thème" : "thèmes"}`;
  personCount.textContent = `(${people.length}/${personInputs.length})`;
}

function save() {
  const url = new URL(location.href);
  const themes = checkedValues(themeInputs);
  const people = checkedValues(personInputs);
  url.searchParams.set("themes", themes.join(","));
  if (people.length === personInputs.length) url.searchParams.delete("profils");
  else url.searchParams.set("profils", people.join(","));
  if (documented.checked) url.searchParams.set("sources", "1");
  else url.searchParams.delete("sources");
  if (url.hash.startsWith("#theme-")) url.hash = "#comparer";
  history.replaceState(null, "", url);
  render();
}

filters.addEventListener("submit", event => event.preventDefault());
filters.addEventListener("change", event => {
  if (event.target.matches('[name="theme"], [name="person"]')) save();
});
documented.addEventListener("change", save);
search.addEventListener("input", () => {
  const query = normalize(search.value.trim());
  for (const fieldset of document.querySelectorAll(".theme-filters fieldset")) {
    let matches = 0;
    for (const label of fieldset.querySelectorAll("label")) {
      label.hidden = !normalize(label.textContent).includes(query);
      if (!label.hidden) matches++;
    }
    fieldset.hidden = matches === 0;
  }
});
filters.addEventListener("click", event => {
  const select = event.target.dataset.select;
  if (!select) return;
  for (const input of personInputs) input.checked = select === "all";
  save();
});
document.querySelector("#reset-filters").addEventListener("click", () => {
  history.replaceState(null, "", location.pathname + "#comparer");
  search.value = "";
  search.dispatchEvent(new Event("input"));
  restore();
});
window.addEventListener("popstate", restore);
window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#theme-")) restore();
});

document.addEventListener("pointerover", event => {
  const citation = event.target.closest(".citation");
  if (!citation || citation.contains(event.relatedTarget)) return;
  const {left} = citation.getBoundingClientRect();
  citation.style.setProperty("--citation-offset", `${Math.max(12 - left, -250)}px`);
});
document.addEventListener("pointerout", event => {
  const citation = event.target.closest(".citation");
  if (!citation || citation.contains(event.relatedTarget)) return;
  citation.removeAttribute("data-dismissed");
});
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  for (const citation of document.querySelectorAll(".citation[open], .citation:hover")) {
    if (citation.contains(document.activeElement)) citation.querySelector("summary").focus();
    citation.open = false;
    citation.dataset.dismissed = "";
  }
});

restore();
document.querySelector(".filters").hidden = false;
document.querySelector(".result-toolbar").hidden = false;
