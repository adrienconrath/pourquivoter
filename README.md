# Pour qui voter ?

Comparateur indépendant des propositions pour la présidentielle française de 2027. Les fiches se lisent en français et chaque affirmation éditoriale renvoie à ses sources. Le site est publié sur [pourquivoter.fyi](https://pourquivoter.fyi/) avec GitHub Pages.

## Générer le site

Prérequis local : Python 3.10 ou supérieur, avec les données de fuseaux horaires du système.

```sh
python3 scripts/build.py --check
python3 scripts/build.py
python3 -m http.server --directory dist 8000
```

Ouvrir [localhost:8000](http://localhost:8000). Le HTML contient le comparateur et les sources. JavaScript ouvre les colonnes des candidatures choisies, empile les thèmes et enregistre la sélection dans l’URL. Les portraits du bandeau ouvrent les fiches statiques individuelles dans `profils/`. Les ressources graphiques et les polices sont servies localement. Les crédits et licences des portraits figurent dans le volet Sources de chaque profil. Chaque case présente un résumé, puis deux volets indépendants, fermés au chargement : Détails et Sources. Les affirmations conservent leurs références dans les attributs HTML `data-sources`. La croix en haut à droite de chaque en-tête permet aussi de retirer une colonne. Chaque case propose un lien discret « Donner du feedback » qui ouvre le formulaire Google avec le candidat et le thème déjà sélectionnés. Un bouton « ◐ » dans le pied de page bascule entre mode clair et mode sombre ; le choix est mémorisé et le mode clair est appliqué par défaut.

## Export Markdown et llms.txt

Chaque build génère aussi une version texte du comparateur pour les agents IA : `dist/markdown/<candidat>/<theme>.md` (275 fichiers, non liés depuis les pages du site) et `dist/llms.txt`, qui les référence tous. Régénérable seul avec `python3 scripts/export_markdown.py`. Aucun changement visuel sur le site.

## Explication par ChatGPT

Quand au moins deux candidats et un thème sont sélectionnés, un lien de la barre d’actions ouvre ChatGPT avec un prompt pré-rempli (`web/assets/ia.js`). Le prompt demande une vulgarisation des visions du monde puis des plans, avec les liens vers les fichiers Markdown publiés de chaque candidat et thème (24 fichiers au plus).

## Mettre à jour une édition

Suivre le [skill d’actualisation](.agents/skills/actualiser-pour-qui-voter/SKILL.md). Les tables sont délimitées par le caractère `|`. Les identifiants sont stables et les références multiples prennent la forme `source-a,source-b`.

- `data/profils.tsv` contient l’identité, la date de naissance, le parcours, le statut et les liens officiels.
- `data/portraits.tsv` contient les crédits, les pages d’origine et les licences.
- `data/themes.tsv` contient l’ordre de lecture, les catégories et les questions de comparaison.
- `data/positions.tsv` contient une affirmation par ligne. Plusieurs affirmations peuvent alimenter la même rubrique avec des références distinctes. Chaque case comprend une proposition ou une déclaration et un seul `resume` sourcé de moins de 100 mots. Le résumé décrit uniquement les propositions de la personne concernée, sans comparaison avec une autre candidature ou son parti.
- `data/glossaire.tsv` contient les termes expliqués au survol : libellé, page de référence (Wikipédia en priorité), formes reconnues dans les textes et une phrase copiée de la page. Le générateur relie la première occurrence de chaque forme dans le résumé puis dans les détails de chaque case ; les exports Markdown restent en texte brut. À tenir à jour avec les textes (voir le skill).
- `data/sources.tsv` contient les identifiants, titres, types et URL des références.
- `data/edition.txt` indique la date d’arrêt des recherches. La date de génération est calculée au moment de la construction, dans le fuseau Europe/Paris.
- `data/audit-couverture.tsv` relève toutes les cases et leurs lacunes quantitatives ; régénérer avec `python3 scripts/audit_coverage.py`. Un texte long n'est pas automatiquement une recherche vérifiée.
- `data/recherches.tsv` suit les recherches effectivement relues, leurs supports et leurs limites. Les journaux détaillés disponibles sont dans `docs/recherches/`.

Le générateur vérifie que chaque candidat dispose d’une fiche pour chaque thème et que chaque fiche contient exactement un résumé de moins de 100 mots. Les ajouts sur `main` déclenchent le workflow GitHub Pages.

La [revue de cohérence des 275 résumés du 19 novembre 2026](docs/relectures/2026-11-19-resumes/README.md) contient les corrections, les relevés avant/après et les points à contrôler lors des prochaines réécritures.

La [vérification des affirmations contre leurs sources du 19 novembre 2026](docs/relectures/2026-11-19-verification-sources/README.md) liste les corrections de chiffres, d’attributions et de formulations non soutenues par les sources.

## Vidéo de présentation

Le [projet Instagram](video/instagram/README.md) contient le film vertical de trente secondes, les sources Hyperframes et GSAP, les captures du site, la narration, la musique ElevenLabs et les commandes de reproduction. La génération de nouveaux audios utilise une clé fournie par l’environnement ; les prises archivées permettent de refaire le rendu sans clé.
