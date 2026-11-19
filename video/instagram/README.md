# Pour qui voter — vidéo Instagram V002

<a href="deliveries/v002/pourquivoter-instagram-v002.mp4"><img src="deliveries/v002/poster.jpg" alt="Lire la vidéo de présentation, trente secondes" width="320"></a>

[MP4 vertical](deliveries/v002/pourquivoter-instagram-v002.mp4) · [Sous-titres](deliveries/v002/narration.srt) · [Crédits](CREDITS.md)

Film de 30 secondes, 1080 × 1920, 30 images/s, H.264 / AAC stéréo. Le texte est raconté à la première personne par le créateur du site. Le montage montre la sélection des thèmes, celle des candidats, deux résumés sur le même thème, puis les volets Détails et Sources. Il se termine par l’adresse du site. Les captures viennent du vrai HTML du dépôt ; les colonnes sont recadrées et empilées pour rester lisibles sur un téléphone. Les portraits choisis servent à démontrer les commandes, sans soutien à une candidature.

La voix retenue est **Dorian — Parisian**, voix française conversationnelle de la bibliothèque ElevenLabs, identifiant `R2zfCl7xyI0UyX6zoGu4`. Il s’agit d’une voix de synthèse de bibliothèque, pas d’un clonage de la voix du créateur. Le modèle est `eleven_multilingual_v2`. La musique instrumentale a été créée avec **Eleven Music**, modèle `music_v1`, puis mixée sous la narration. Les originaux, les paramètres des requêtes sans clé API, les horodatages et les empreintes sont archivés dans `assets/audio/`.

La V002 affiche `pourquivoter.fyi` dans la scène d’introduction, agrandit le site avec deux candidats sélectionnés et ajoute des marges aux volets Détails et Sources. La voix prononce seulement « Pour qui voter ». L’adresse n’est plus répétée dans un pied de page permanent. La [V001](deliveries/v001/pourquivoter-instagram-v001.mp4) reste archivée.

## Refaire le rendu avec les mêmes médias

Prérequis : Node.js 22 ou supérieur, Python 3.10 ou supérieur et FFmpeg/FFprobe. Depuis ce dossier :

```sh
npm ci
npx playwright install chromium
npm run build
npm run check
npm run render -- v010
```

Le MP4 sort dans `renders/v010/`. Choisir un identifiant libre : les exports existants ne sont pas écrasés. Pour créer une livraison avec son affiche, ses sous-titres et ses empreintes :

```sh
node scripts/hyperframes.mjs check --json > renders/v010/check.json
npm run deliver -- --render v010 --delivery v010 --check-report renders/v010/check.json
```

Les fichiers sont alors dans `deliveries/v010/`. Cette reproduction utilise les fichiers audio et les captures archivés et ne demande aucune clé API. Le navigateur est résolu à partir de Playwright ; `HYPERFRAMES_BROWSER_PATH` permet de choisir explicitement un autre Chromium.

Pour lire la version livrée dans un navigateur :

```sh
python3 -m http.server 4326
```

Ouvrir `http://localhost:4326/preview.html`. `npm run preview` ouvre aussi le studio Hyperframes sur le port 4327.

## Modifier le film

- `composition.html.in` : textes, images et structure des scènes.
- `film.css` : direction graphique, tailles et zones de sécurité verticales.
- `film.js` : timeline GSAP de trente secondes, clics et surlignage des mots.
- `scripts/build.mjs` : composition Hyperframes et sous-titres intégrés, alignés sur la narration.
- `scripts/capture.mjs` : construit le site, réalise de vraies sélections dans Playwright et archive les captures. `npm run capture -- v005` crée un nouveau jeu ; mettre ensuite à jour les chemins des images dans le modèle.
- `scripts/capture-references.mjs` : capture les titres et images de vraies pages publiques. `node scripts/capture-references.mjs v002` crée une nouvelle archive ; vérifier visuellement les captures avant de les intégrer.
- `scripts/revise-audio.py` : fabrique l’edit V002 à partir de la voix V001 en retirant « point F Y I », sans nouvelle synthèse. Les mots conservés restent aux mêmes instants et la musique est réutilisée.
- `scripts/master.py` : rythme des phrases, pauses et mixage de la musique. Avant de refaire cet edit, choisir un nouveau dossier de version dans le script et mettre à jour les chemins du mix et de la timeline dans le modèle et le build.
- `prompts/` : texte prononcé et direction musicale exacte.
- `deliveries/v002/manifest.json` : empreintes des médias, configuration et contrôle de la livraison.

Le collage d’ouverture montre de vraies captures de YouTube/LCI et TF1 Info déjà référencés par le site. La capture YouTube du débat des Restos du Cœur a été fournie par le créateur. Les URLs, provenances et empreintes figurent dans les manifestes de `assets/references/`. La capture YouTube du débat des Restos du Cœur est fournie par le créateur et documentée dans `assets/references/user-v001/manifest.json`. Ces extraits ne signifient aucun soutien des médias ou personnes représentés. Les autres images sont des captures du site, pas des maquettes de propositions. Les sous-titres sont déjà intégrés dans le MP4 ; le SRT est fourni séparément pour l’édition.

## Générer de nouveaux audios ElevenLabs

Définir `ELEVENLABS_API_KEY` dans l’environnement du terminal, hors du dépôt. La génération est facturée par le fournisseur. Les commandes suivantes créent de nouvelles prises, sans remplacer celles livrées :

```sh
npm run audio -- voice --take v002
npm run audio -- music --take v002
```

La voix doit être accessible dans la bibliothèque du compte ElevenLabs. `--voice-id` permet d’en sélectionner une autre. Aucun secret n’est enregistré dans les requêtes ou les métadonnées. Les fichiers `.env*` sont ignorés par Git, à l’exception de l’exemple vide. Une nouvelle génération peut différer, même avec le même texte et les mêmes réglages ; les MP3 archivés permettent de conserver la prise exacte.

Documentation : [Hyperframes](https://hyperframes.app/docs/5-packages/cli), [voix avec horodatages](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps), [Eleven Music](https://elevenlabs.io/docs/api-reference/music/compose).
