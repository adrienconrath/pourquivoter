# Aperçu des liens partagés

L’accueil et les profils déclarent une image commune avec `og:image` et `twitter:image`. Elle est hébergée dans `web/assets/partage-presidentielle-2027-v1.png` (1 200 × 630 pixels), mais n’est pas affichée dans les pages. Les URL des métadonnées sont absolues et utilisent le domaine public `https://pourquivoter.fyi/`.

Chaque profil conserve son propre titre, sa description et son URL canonique. L’image reste sans candidat pour représenter le comparateur.

Pour remplacer l’illustration, créer un nouveau fichier versionné et mettre à jour les deux modèles HTML, y compris les dimensions et le texte alternatif. Construire le site avec `python3 scripts/build.py`. Les plateformes peuvent conserver un ancien aperçu en cache ; un déploiement ne garantit pas le rafraîchissement immédiat des messages déjà partagés.

L’illustration a été générée avec l’outil intégré de génération d’images, puis redimensionnée pour le partage. Aucun portrait ni logo de parti n’a été utilisé.

## Prompt de génération

```text
Use case: ads-marketing
Asset type: social sharing Open Graph cover for the French independent political programme comparison website pourquivoter.fyi, landscape aspect 1200:630.
Create an exceptionally beautiful, restrained editorial cover, premium French newspaper design meets contemporary civic digital product. Warm ivory paper #f7f5f0, charcoal #24231f, muted taupe, no partisan colours. Crisp readable elegant serif headline, restrained sans serif supporting typography, generous whitespace, sophisticated composition.
Exact text, with accents, and no additional text:
"PRÉSIDENTIELLE 2027"
"Pour qui voter ?"
"Comparez les propositions."
"Consultez les sources."
"pourquivoter.fyi"
Main headline large and instantly legible at thumbnail size. Refined sculptural paper illustration of three overlapping comparison cards and a folded ballot paper in the right-hand third, subtle debossed horizontal lines and soft natural shadows. Illustration supports the headline, not a fake screenshot. All key text within the central 80% with large margins; ensure also a square central crop retains main headline. Balanced composition, editorial quiet confidence, tasteful tangible paper texture. No people, no portraits, no political parties, no party logos, no flags, no red or blue, no polls or vote percentages, no endorsement. Flat full bleed finished design, not a photo of a poster, no outer frame or watermark.
```
