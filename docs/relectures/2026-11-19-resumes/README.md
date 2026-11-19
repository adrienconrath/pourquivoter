# Audit de cohérence des résumés — 19 novembre 2026

## Résultat

**275 résumés relus : 213 corrigés ou clarifiés, 62 conservés.** Les changements vont d’une ambiguïté de vocabulaire à une rupture de raisonnement. Ces 213 modifications ne désignent donc pas 213 erreurs factuelles. Chaque résumé final compte moins de 100 mots ; le maximum est de 83 mots.

Les 275 résumés ont été confrontés à leur fiche détaillée, puis les propositions de réécriture ont fait l’objet d’une seconde lecture. Le relevé contient 137 URL distinctes effectivement rouvertes pour les passages utiles aux corrections. Il distingue ces lectures de la seule confrontation aux données du dépôt et indique les limites d’accès. Ce nombre n’est pas une certification de toutes les affirmations de toutes les sources.

| Candidature | Résumés relus | Corrigés ou clarifiés | Conservés | Relevé avant/après |
| --- | ---: | ---: | ---: | --- |
| Jean-Luc Mélenchon | 25 | 17 | 8 | [Relevé](melenchon-ruffin-roussel.json) |
| François Ruffin | 25 | 20 | 5 | [Relevé](melenchon-ruffin-roussel.json) |
| Fabien Roussel | 25 | 16 | 9 | [Relevé](melenchon-ruffin-roussel.json) |
| Marine Tondelier | 25 | 20 | 5 | [Relevé](attal-glucksmann-philippe-tondelier.json) |
| Raphaël Glucksmann | 25 | 14 | 11 | [Relevé](attal-glucksmann-philippe-tondelier.json) |
| Gabriel Attal | 25 | 20 | 5 | [Relevé](attal-glucksmann-philippe-tondelier.json) |
| Édouard Philippe | 25 | 21 | 4 | [Relevé](attal-glucksmann-philippe-tondelier.json) |
| David Lisnard | 25 | 21 | 4 | [Relevé](le-pen-lisnard-retailleau-zemmour.json) |
| Bruno Retailleau | 25 | 21 | 4 | [Relevé](le-pen-lisnard-retailleau-zemmour.json) |
| Marine Le Pen | 25 | 21 | 4 | [Relevé](le-pen-lisnard-retailleau-zemmour.json) |
| Éric Zemmour | 25 | 22 | 3 | [Relevé](le-pen-lisnard-retailleau-zemmour.json) |

## Exemples de corrections

- **Glucksmann, coût de la vie** : présenter la priorité en crèche avant sa critique, puis attribuer celle-ci au Courrier des Stratèges. Le résumé ne transforme plus cette objection en contestation générale des mesures salariales.
- **Ruffin, climat** : supprimer du résumé la réserve sur « les deux objectifs de flotte anti-incendie », dont aucun n’était présenté. Distinguer la réduction des émissions de la protection face aux incendies et aux chaleurs.
- **Tondelier, coût de la vie et climat** : retirer les réserves sur un calendrier automobile non présenté. Le thème transports garde l’écart entre ses deux calendriers, en indiquant clairement qu’ils concernent le même parc de véhicules.
- **Philippe, transports** : retirer la réserve sur les prêts du tramway havrais, absents du résumé ; séparer le budget de l’aide au carburant de celui du rail.
- **Lisnard, transports et numérique** : retirer les mentions isolées des bus à hydrogène de Cannes et des économies municipales, qui n’éclairaient pas les mesures nationales résumées.
- **Roussel, agriculture** : remplacer « blocage temporaire du fourrage » par le blocage temporaire de son prix et expliquer qu’il s’agit de la nourriture destinée au bétail.
- **Le Pen, retraites et institutions** : expliquer les droits à pension visés et les étapes d’une révision constitutionnelle, plutôt que juxtaposer des termes techniques.
- **Retailleau, numérique** : distinguer les 23 milliards d’euros d’effort annoncé des 11,6 milliards d’investissements nouveaux, sans présenter les capitaux privés comme une composante directe de ce tableau budgétaire public.

Les détails restent présents dans les fiches : une proposition ou une critique retirée du résumé n’a pas été supprimée de la documentation.

## Vérifications de livraison

- Données et construction validées par `python3 scripts/build.py --check` puis `python3 scripts/build.py`.
- 275 résumés uniques, références existantes et aucun autre candidat nommé dans un résumé ; aucun changement aux 4 325 notes de détail, aux profils ni à la date d’arrêt de l’édition.
- Correspondance des 275 résumés avec le HTML et les 275 exports Markdown ; références présentes dans le volet Sources de chaque case.
- Vérification navigateur à 1 440 et 390 pixels, puis sur mobile sans JavaScript : résumés présents, volets fermés au chargement, ouverture indépendante de Détails et Sources, aucun débordement horizontal de page ni erreur JavaScript.
- Relevés de longueur régénérés, sans assimiler longueur et qualité.

Les sources qui n’ont pas pu être rouvertes sont signalées dans les relevés. L’objectif climatique de Mélenchon de −65 % en 2033 ne donne pas son année de comparaison dans les documents relus : le résumé l’indique, sans inventer une référence à 1990. Cette passe ne renouvelle pas l’ensemble des recherches sur les programmes.

## Périmètre et méthode

Cette passe porte sur les 275 résumés du comparateur publié : 11 candidatures et 25 thèmes. Elle examine leur lisibilité et leur cohérence avec les détails de chaque fiche. Elle ne remplace pas une nouvelle recherche exhaustive sur les programmes et ne valide pas à nouveau les 4 325 notes de détail.

Chaque résumé est relu en entier, puis confronté aux propositions, financements et critiques de sa fiche. Les sources externes utiles aux corrections sont rouvertes ; le relevé distingue ces lectures des vérifications fondées sur les détails déjà présents. Les synthèses automatiques des sites de transcription ne remplacent pas le passage mot pour mot.

Les contrôles éditoriaux sont les suivants :

- Chaque réserve porte sur une mesure effectivement présentée dans le résumé. Une objection à une priorité en crèche ne peut pas suivre un résumé qui ne parle que de salaires et de voitures.
- Les phrases se suivent avec un lien explicite. Un exemple local, un calendrier, un financement ou une technologie n’apparaît pas uniquement dans la dernière réserve.
- Une critique attribuée dans les détails ne devient pas un consensus anonyme dans le résumé. Une proposition incertaine ne devient pas un résultat acquis.
- Les termes techniques sont expliqués ou remplacés : impôt successoral, complémentaire santé, durée de cotisation, règles d’accès au logement social, etc.
- Les propositions personnelles, projets de parti, archives et mesures déjà en vigueur conservent leur statut. Un crédit annuel, une dépense cumulée, un prêt et une économie ne sont pas interchangeables.
- Le résumé reste centré sur la personne concernée, en moins de 100 mots. Il peut sélectionner les principales mesures ; les détails conservent les autres propositions et les critiques développées.

Une réserve est supprimée du résumé lorsqu’elle n’y est pas intelligible sans une longue digression. Cela ne la supprime pas de la fiche : elle reste dans « Détails », avec son attribution et ses sources.

## Traçabilité

Le relevé joint énumère toutes les cases, y compris les résumés conservés. Il indique les motifs de correction ou de conservation, les références avant et après, les sources externes relues et les limites de vérification. Le diff de `data/positions.tsv` permet de revoir les textes exacts.

Les notes de détail, les profils et les programmes ne sont pas réécrits dans cette passe. La date d’arrêt de l’édition n’est donc pas avancée artificiellement.
