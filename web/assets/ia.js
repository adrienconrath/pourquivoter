// Panneau « Demander à une IA » : construit un prompt à partir des thèmes et candidats
// sélectionnés, avec les liens vers les fichiers Markdown publiés (un par candidat et par thème).
const SITE = "https://pourquivoter.fyi";
const MAX_FILES = 24;
const panel = document.querySelector("#ia-panel");
const link = panel.querySelector("#ia-open");
const label = panel.querySelector("#ia-label");

function selection() {
  const people = [...document.querySelectorAll(".candidate-choice[aria-pressed=true]")].map(button => ({
    id: button.dataset.person,
    name: button.title,
    party: document.querySelector(`.column-header[data-person="${button.dataset.person}"] small`)?.textContent ?? "",
  }));
  const themes = [...document.querySelectorAll("[data-theme-toggle][aria-pressed=true]")].map(button => ({
    id: button.dataset.themeToggle,
    name: button.textContent.trim(),
  }));
  return {people, themes};
}

function buildPrompt({people, themes}) {
  const names = people.map(p => `${p.name} (${p.party})`).join(", ");
  const themeNames = themes.map(t => t.name).join(", ");
  const files = people.map(p =>
    `${p.name} :\n` + themes.map(t => `- ${t.name} : ${SITE}/markdown/${p.id}/${t.id}.md`).join("\n")
  ).join("\n\n");
  return `Tu es un enseignant brillant qui fait de la vulgarisation politique. Je suis un citoyen français qui n'est pas spécialiste de politique ni d'économie : explique comme à quelqu'un d'intelligent qui découvre le sujet, sans rien présupposer de mon âge ni de mon parcours. Je veux comprendre ce qui différencie vraiment des candidats à la présidentielle française de 2027, sans jargon et sans qu'on me dise pour qui voter.

Candidats à comparer : ${names}.
Thèmes : ${themeNames}.

SOURCES. Ouvre chacun de ces fichiers (du texte brut, sourcé, une page par candidat et par thème) et appuie-toi dessus en priorité. Ne les résume pas un par un : croise-les.

${files}

Si un fichier ne s'ouvre pas, dis-le explicitement et n'invente rien à sa place. Quand tu avances un chiffre ou une mesure, indique le numéro de la source du fichier [n] et le nom du candidat. Ce qui ne figure pas dans les fichiers, signale-le comme tel (« non précisé dans le programme ») au lieu de combler.

CE QUE J'ATTENDS, dans cet ordre :

1. L'essentiel en 5 lignes : la principale ligne de fracture entre ces candidats.

2. Leur vision du monde. Pour chaque candidat, en 4 à 6 lignes : comment il voit la société et ce qui, selon lui, ne va pas ; les valeurs et l'idéologie qui guident ses choix (ex. libéralisme, étatisme, écologie, souverainisme, conservatisme…, en expliquant chaque mot en une phrase) ; ce qu'il place en priorité. Déduis-le d'abord des fichiers, et si tu t'appuies sur des positions publiques connues de son parti, précise-le.

3. Pour chaque thème, le plan concret :
   - ce que fait chaque candidat, en 2 ou 3 mesures claires avec les chiffres et le financement quand ils existent ;
   - les points communs ;
   - les vraies différences, et pourquoi elles découlent de leur vision du monde ;
   - un petit tableau comparatif (une ligne par candidat).

4. Ce que ça changerait concrètement dans la vie de tous les jours, avec un exemple chiffré ou un cas simple par thème quand c'est possible (en l'adaptant à ce que tu sais de moi, voir plus bas).

5. Les points à vérifier : désaccords entre experts, mesures peu chiffrées ou difficiles à financer, ce qui exigerait une réforme constitutionnelle ou l'accord de l'Europe (reprends la rubrique « Points à vérifier » des fichiers).

6. En conclusion : 3 questions ou axes de réflexion qui m'aideraient à savoir quelles propositions comptent le plus pour moi, en tenant compte de ce que tu sais de moi.

PERSONNALISATION. N'hésite pas à adapter tes explications à ce que tu sais de moi (ma situation, mon âge, mon métier ou mes études, où j'habite, mes centres d'intérêt, ce qui semble compter pour moi). Mets en avant les mesures qui me concernent le plus directement et propose-moi des axes de réflexion adaptés à ma situation. Si tu ne sais presque rien de moi, ne fais aucune supposition et pose-moi à la fin 2 ou 3 questions courtes pour pouvoir affiner. Cette personnalisation porte sur ce qui est pertinent pour moi, jamais sur la conclusion : elle ne doit pas te faire pencher pour un candidat.

STYLE ET NEUTRALITÉ.
- Français simple, phrases courtes, titres clairs. Définis chaque terme technique (déficit, dette, cotisations, niveau de vie, quotient familial…) la première fois qu'il apparaît, avec une image ou un exemple.
- Strictement équilibré : même place, même niveau d'exigence et même ton pour chaque candidat. Décris leurs propositions telles qu'ils les présentent, puis les points de discussion, sans jugement de valeur.
- Ne dis jamais pour qui voter et ne classe pas les candidats.
- Termine en me proposant d'approfondir un thème ou un candidat.`;
}

function chatgptUrl(prompt) {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

function refresh() {
  const sel = selection();
  const count = sel.people.length * sel.themes.length;
  panel.hidden = sel.people.length < 2 || sel.themes.length === 0 || count > MAX_FILES;
  if (panel.hidden) return;
  label.textContent = `Demandez à ChatGPT d'expliquer ${plural(sel.themes.length, "thème", "thèmes")} et ${plural(sel.people.length, "candidat", "candidats")}`;
  link.href = chatgptUrl(buildPrompt(sel));
}

window.addEventListener("pqv:selection", refresh);
refresh();
