# Pour qui voter ?

Comparateur indépendant des propositions pour la présidentielle française de 2027. Les fiches se lisent en français et chaque affirmation éditoriale renvoie à ses sources. Le site est publié sur [pourquivoter.fyi](https://pourquivoter.fyi/) avec GitHub Pages.

## Générer le site

Prérequis local : Python 3.10 ou supérieur, avec les données de fuseaux horaires du système.

```sh
python3 scripts/build.py --check
python3 scripts/build.py
python3 -m http.server --directory dist 8000
```

Ouvrir [localhost:8000](http://localhost:8000). Le HTML contient le comparateur et les sources. JavaScript ouvre les colonnes des candidatures choisies, empile les thèmes et enregistre la sélection dans l’URL. Les portraits du bandeau ouvrent les fiches statiques individuelles dans `profils/`. Les ressources graphiques et les polices sont servies localement. Les crédits et licences des portraits figurent dans le volet Sources de chaque profil. Chaque case présente un résumé, puis deux volets indépendants, fermés au chargement : Détails et Sources. Les affirmations conservent leurs références dans les attributs HTML `data-sources`. La croix en haut à droite de chaque en-tête permet aussi de retirer une colonne.

## Mettre à jour une édition

Suivre le [skill d’actualisation](.agents/skills/actualiser-pour-qui-voter/SKILL.md). Les tables sont délimitées par le caractère `|`. Les identifiants sont stables et les références multiples prennent la forme `source-a,source-b`.

- `data/profils.tsv` contient l’identité, la date de naissance, le parcours, le statut et les liens officiels.
- `data/portraits.tsv` contient les crédits, les pages d’origine et les licences.
- `data/themes.tsv` contient l’ordre de lecture, les catégories et les questions de comparaison.
- `data/positions.tsv` contient une affirmation par ligne. Plusieurs affirmations peuvent alimenter la même rubrique avec des références distinctes. Chaque case comprend une proposition ou une déclaration et un seul `resume` sourcé de moins de 100 mots. Les références du résumé couvrent aussi les différences mentionnées avec les autres candidats.
- `data/sources.tsv` contient les identifiants, titres, types et URL des références.
- `data/edition.txt` indique la date d’arrêt des recherches. La date de génération est calculée au moment de la construction, dans le fuseau Europe/Paris.
- `data/audit-couverture.tsv` relève toutes les cases et leurs lacunes quantitatives ; régénérer avec `python3 scripts/audit_coverage.py`. Un texte long n'est pas automatiquement une recherche vérifiée.
- `data/recherches.tsv` suit les recherches effectivement relues, leurs supports et leurs limites. Les journaux détaillés disponibles sont dans `docs/recherches/`.

Le générateur vérifie que chaque candidat dispose d’une fiche pour chaque thème et que chaque fiche contient exactement un résumé de moins de 100 mots. Les ajouts sur `main` déclenchent le workflow GitHub Pages.
