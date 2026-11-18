Audit culture|retailleau, 18 novembre 2026. Aucun fichier suivi modifié. Lecture intégrale du brief /tmp/pqv-audit/agent-brief.md et du skill .agents/skills/actualiser-pour-qui-voter/SKILL.md, README, recherche de la case (vide), catalogue des sources.

Requêtes réellement exécutées, moteur web (guillemets conservés lorsque utilisés) :
- Bruno Retailleau culture patrimoine audiovisuel programme 2026
- Bruno Retailleau culture artistes financement 2026 programme
- "Retailleau" "culture" "2026" patrimoine artistes audiovisuel -site:voteren2027.fr -site:programmes-2027.fr -site:cpromis.fr -site:lesprogrammes.org
- "Retailleau" "culture" "2026" "23" milliards
- "Retailleau" "culture" "2026" "transmission"
- site:avecretailleau.fr "culture" "classe"
- site:republicains.fr "2026" "Classe Culture"
- "Retailleau" "2026" "artistes" culture
- "Retailleau" "2026" "Pass Culture"
- site:republicains.fr/actualites/2026/09 "cour suprême"
- site:republicains.fr "Classe" "Culture" éducation 2026
- site:avecretailleau.fr/projet/mesure "culture"
- "Retailleau" "2026" "audiovisuel" fusion privatisation
- "Retailleau" "Classe Culture"
- "Retailleau" "Hellfest" "2026"
- "Retailleau" "culture" "2026" site:franceinfo.fr
- "Retailleau" "culture" "2026" site:rtl.fr
- "Retailleau" culture "2026" site:liberation.fr
- "Retailleau" audiovisuel "2026" site:publicsenat.fr
- "Retailleau" "culture" "2026" "suppression"
- "Retailleau" "Classe Culture" budget septembre
- site:republicains.fr/wp-content/uploads/2026 "Éducation" "Culture"
- site:avecretailleau.fr/wp-content/uploads/2026 "Culture"
- "Retailleau" "France Télévisions" 2026
- "Retailleau" "culture" "2026" site:tf1info.fr
- "Retailleau" fusion audiovisuel "2024" franceinfo
- Conseil Etat crèches Noël bâtiments publics 2016 caractère culturel
- Cour des comptes pass Culture 2026 condition ressources 65 millions
- audiovisuel public 2026 baisse budget création producteurs USPA critique
- "Bruno Retailleau" "fusion" "audiovisuel public" "2024"
- "Retailleau" "2026" "patrimoine" "Figaro"
- "Retailleau" "2026" "culture" site:ouest-france.fr

Sources effectivement consultées et contrôle des passages :
1. https://www.avecretailleau.fr/projet : rubrique Culture, toujours À venir, seule orientation patrimoine/langue/œuvres. Réutiliser lr-projet. Page d'accueil https://www.avecretailleau.fr/ également lue : ambition fierté française.
2. https://www.avecretailleau.fr/projet/theme/education : lecture page et extraction des liens HTML avec requests/BeautifulSoup. Le lien « Téléchargez le livret » conduit à https://www.avecretailleau.fr/api/media/file/LR_Ecole_vF.pdf . Téléchargement requests HTTP200 application/pdf, pdftotext -layout, passages pages imprimées/PDF14,15,16 : quinze minutes lecture p14 ; Classe Culture budget propre et artistes p15 ; cours 50minutes et ateliers culturels p16. Recherche budget/artiste/culture dans l'ensemble du texte. Le PDF porte le titre « Nos propositions pour la France », hébergé et lié dans le programme personnel. Ne pas l'assimiler à un programme municipal ni inventer un budget Classe Culture. La date septembre2026 est contextualisée par présentation du volet école ; le PDF ne fournit pas un jour sûr de publication.
3. https://republicains.fr/wp-content/uploads/2026/10/20261011_Fiches_presse_comptes_publics_mise_en_page.pdf : dossier daté 12 10 26, fiche4 page6 (index PDF5). Tableau Md€2032 : Culture et médias2,6 ; base dotation audiovisuel ≈4Md€, Pass Culture programme361. Réutiliser lr-fin. C'est une ligne du candidat lui-même, pas seulement la phrase du journaliste. Documents locaux /tmp/pqv-docs/lr.txt et lr.pdf utilisés pour repérage puis source ouverte en web.
4. https://www.publicsenat.fr/actualites/economie/presidentielle-2027-bruno-retailleau-sengage-sur-un-plan-deconomies-de-pres-de-200-milliards-deuros-sil-est-elu : ouvert et passage culture relu. Les « gros efforts » sont les mots de la synthèse journalistique, pas une citation directe. Résumé23Md€ agrège plusieurs politiques et ne remplace pas la fiche4.
5. https://www.avecretailleau.fr/projet/mesure/faire-moins-perimetre-revu-politiques-au-tamis-dispositifs : fiche119, mise à jour12novembre, agrégat32Md€ ; toujours sans ventilation culture/médias.
6. https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/ : entretien Figaro, 2septembre. Propos Retailleau identifiés : charte, racines judéo-chrétiennes, crèche en mairie, réponse sur souveraineté. Première URL tentée sans suffixe « je-lui-donnerai-le-dernier-mot » inaccessible, corrigée via recherche.
7. https://pourquijevote.com/transcripts ouvert effectivement. Recherche a identifié https://pourquijevote.com/transcripts/8f835977-d826-428f-9745-708832b0c8e8 : Sud Radio13mai2026, source originale https://www.youtube.com/watch?v=zNDOSitLtuY . Transcription intégrale lue et passage école/culture puis Canon français. Index annonce chapitre17:01, mais ce repère n'a pas été pris pour un horodatage exact de chaque phrase. Pas de minute précise ajoutée dans la fiche ; pas de citation brute de l'ASR qui écorche les noms. Maxime Lledo pose la question des saluts nazis ; Retailleau répond sanctions individuelles/refus d'interdiction. Ce ne sont ni une enquête constatant les incidents ni un propos de l'auditeur attribué au candidat. Synthèse totale sous200mots de cette transcription.
8. https://dixipolis.com/presidentielle-2027 ouvert effectivement puis https://dixipolis.com/video/226252 Grand oral12novembre. Séquence Retailleau identifiée, env4h11–4h46, débat agents publics/école/santé/justice. Ne pas lui attribuer les pratiques artistiques de l'après-midi d'Édouard Philippe vers autre section du grand oral. Double vérification https://pourquijevote.com/transcripts/b79e2b18-20d7-479e-967d-41a89bd5784b : pas de volet culture distinct dans cet entretien.
9. https://www.conseil-etat.fr/actualites/installation-de-creches-de-noel-par-les-personnes-publiques : décision9novembre2016, exceptions dans bâtiments publics, neutralité et appréciation du contexte. Contrepoint juridique précis à l'affirmation générale du candidat, pas avis sur sa future charte.
10. https://www.ccomptes.fr/sites/default/files/2026-11/20261109-Contribution-retablissement-finances-publiques.pdf : pages23 et90, Pass Culture critique diversification/démocratisation,18M€2027/65M€ année pleine, ciblage ressources. URL déjà af-cdc-du dans catalogue : réutilisé malgré titre existant centré Dutreil ; élargir son titre au besoin lors intégration sans créer doublon. Ne pas lui attribuer ce ciblage à Retailleau.
11. https://www.cbnews.fr/medias/secteur-production-audiovisuelle-est-crise-structurelle : AFP20septembre2026. Lecture intégrale, DegeorgesUSPA/FregoneseGuilde, commandes/producteurs. Objection sectorielle préexistante, pas audit Retailleau.
12. https://www.lemonde.fr/economie/article/2026/09/18/delphine-ernotte-cunci-presidente-de-france-televisions-je-tire-la-sonnette-d-alarme-sur-la-sauvegarde-de-notre-modele-culturel_6776670_3234.html : entretien ouvert, passages missions/recettes/programmes disponibles. Moins100mots en synthèse finale (une seule phrase attribuée ; le bloc partagé93mots reste sous100).
13. https://www.mind.eu.com/media/article/lecosysteme-audiovisuel-francais-fustige-la-baisse-de-budget-de-laudiovisuel-public/ : ouvert ; seul extrait public communiquéARP/UPC/SPI/SRF accessible. Non retenu pour éviter répétition et développement au-delà du passage disponible.

Pistes ouvertes/accessibilité et faux rapprochements évités : TF1Info interviewLCI20avril2026 URL https://www.tf1info.fr/politique/en-bref-election-presidentielle-2027-projet-ce-qu-il-faut-retenir-de-l-interview-de-bruno-retailleau-les-republicains-sur-lci-2437145.html : résultat pertinent défenseculture, ouverture403 donc pas utilisé. Franceinfo, Libération, Ouest-France restrictions robots. BoursoramaAFP18septembre renvoie410 ; préférer AFP–CBNews lu. Les programmes comparateurs Cpromis/Programmes2027/Déchiffrer/Voteren2027 sont apparus comme pistes, pas utilisés comme preuves ; erreurs possibles relevées : « pas de chiffre culture » contredit PDF2,6Md€, ClasseCulture doit remonter PDF, fusion2024 ne prouve pas privatisation2027. Hellfest résultats2026 parlent surtout polémique ancienne/archives, pas nouvelle mesure2027. Les coupes PaysdelaLoire2025 de Christelle Morançais ne sont pas des propositionsRetailleau.

Limites restantes : pas de montant ClasseCulture, bénéficiaires détaillés Pass, ventilation2,6Md€, sociétés audiovisuelles visées, gains de gestion séparés des coupes de missions, économies nettes de coûts de transition ; pas d'enveloppe restauration patrimoine ni création contemporaine, statut artistes-auteurs/intermittents, réformeCNC, droit d'auteur ou éducation artistique horsécole établis dans les sources personnelles2026 examinées. Pas de réponse personnelle détaillée trouvée aux avertissements audiovisuels ; ne pas inventer. Aucune promesse2027 déduite de son étiquette ni d'archives.

Livraison : 12blocs, environ860mots, au moins3 objections distinctes documentées (crèches juridique ; banquets question journalistique/réponse ; création audiovisuelle professionnels ; PassCulture expertise générale). Les contrepoints ne sont pas présentés comme des études du candidat. Nouvelle case, aucune ancienne assertion à corriger ; deux erreurs de sources secondaires explicitement évitées : absence de chiffrage et privatisation présumée.
