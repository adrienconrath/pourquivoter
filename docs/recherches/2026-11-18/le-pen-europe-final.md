Audit europe|le-pen, 18 novembre 2026. Travail seulement sous /tmp/pqv-audit, aucun fichier suivi modifié.
Lecture du brief /tmp/pqv-audit/agent-brief.md, de .agents/skills/actualiser-pour-qui-voter/SKILL.md, de la case actuelle et de data/sources.tsv dans /home/adrienconrath/Desktop/Projects/pourquivoter. Réemploi des IDs existants. Les cinq nouvelles URLs ont été recherchées dans le catalogue et n'y étaient pas présentes.

Requêtes réellement exécutées (web.search_query) :
- Marine Le Pen 2026 Mercosur euro sortie Union européenne octobre Bruxelles
- Marine Le Pen contribution européenne 5 milliards 2026 Maillard critiques
- "Marine Le Pen" "Mercosur" "2026" novembre
- "Marine Le Pen" "euro" "2026" sortie monnaie
- "Marine Le Pen" "CEDH" "2026" octobre
- site:pourquijevote.com/transcripts "Marine Le Pen" "Bruxelles" "14 octobre 2026"
- site:pourquijevote.com/transcripts "Marine Le Pen" "Cournon" "2026"
- site:marinelepen.com "7 octobre 2026" "Mercosur"
- site.consilium.europa.eu Schengen ressortissants pays tiers voyager 90 jours 180
- site:coe.int Union européenne Cour européenne droits homme institutions différentes

URLs effectivement ouvertes/lues :
https://pourquijevote.com/transcripts (index, avertissement sur transcription automatique)
https://dixipolis.com/presidentielle-2027 (index, rôle de comparateur/transcriptions identifié)
https://dixipolis.com/video/226548 (outil web inaccessible ; pas utilisé pour une affirmation finale)
https://www.marinelepen.com/index.php/actualites/deplacement-a-bruxelles-pour-une-renaissance-europeenne (web ouvert mais erreur ; requests HTTP200, texte complet lu ; copie locale lep-eu-brux.txt et ancienne copie le-pen-industrie-brux.txt)
https://pourquijevote.com/transcripts/6c1e036c-2210-4570-bfbb-4bf84a94287a (web et requests HTTP200, lep-eu-cnews.txt)
https://pourquijevote.com/transcripts/67e581f1-cd26-4bd0-b7c8-b0d45150997f (requests HTTP200, lep-eu-lci.txt)
https://www.tf1info.fr/politique/direct-video-objectif-2027-marine-le-pen-candidate-du-rassemblement-national-invitee-de-lci-suivez-l-emission-live-streaming-mercredi-16-septembre-2026-2464561.html (web résultats/lecture compte rendu diffuseur)
https://pourquijevote.com/transcripts/95c99855-6bcd-415e-b285-f1f05b67dadd (requests HTTP200, lep-eu-fin.txt, extrait brut relu au-delà du résumé automatique)
https://questions.assemblee-nationale.fr/dyn/17/comptes-rendus/seance/session-ordinaire-de-2026-2027/premiere-seance-du-mercredi-14-octobre-2026 (requests HTTP200, lep-eu-an.txt ; interventions Haddad, Pfeffer, Verny, Coggia distinguées)
https://back.deputes-rn.fr/wp-content/uploads/2026/10/GRN-CONTRE-BUDGET-2027-DOSSIER.pdf (requests HTTP200, pdftotext -layout ; pages PDF 11–12 contiennent 8,897 ; tableau d'impact budgétaire annuel 2027, pas plafond net)
https://www.lemonde.fr/international/article/2026/10/15/a-bruxelles-marine-le-pen-bien-isolee-apres-avoir-menace-l-europe-d-un-bras-de-fer_6794068_3210.html (texte des paragraphes 345–368 relu, critique Maillard conservée, <100 mots de synthèse)
https://www.lemonde.fr/les-decodeurs/article/2026/11/06/donner-moins-d-argent-a-l-europe-la-proposition-de-marine-le-pen-est-elle-realiste_6807742_4355770.html (paragraphes 527–602, différences méthodes 2025 et avis Rubio/Le Cacheux ; 70 mots de synthèse au total)
https://www.lefigaro.fr/international/a-bruxelles-marine-le-pen-denonce-le-scandale-democratique-du-budget-europeen-20261014 (ouvert, borne25 mots ; aucune synthèse spécifique conservée dans livrable)
https://lcp.fr/actualites/budget-2027-qu-est-ce-que-la-contribution-francaise-au-budget-de-l-union-europeenne-qui (Maxence Kagni,13 octobre, lu ; repère de contrôle, pas source finale ajoutée)
https://fr.euronews.com/2026/10/17/moins-de-fonds-pour-lukraine-et-budget-de-lue-en-baisse-que-changerait-une-victoire-de-le- (Estelle Nilsson-Julien, lu 272–300 ; critique Tenenbaum sur architecture aide Ukraine pertinente mais non retenue pour éviter débordement défense)
https://www.consilium.europa.eu/fr/policies/eu-long-term-budget/ (procédure unanimité Conseil + approbation Parlement)
https://www.consilium.europa.eu/fr/meetings/european-council/2026/10/15-16/ (conclusions, §budget 115–118 : accord fin2026 pour législation2027 et paiements2028 ; non conservé pour réduire charge du seul article Bruxelles)
https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A12016M%2FTXT (traité UE, articles16–17)
https://eur-lex.europa.eu/eli/treaty/tfeu_2016/art_123/oj?locale=fr (interdictions précises, ne pas interdire par extrapolation toute politique BCE favorable à investissement)
https://factuel.afp.com/doc.afp.com.9XV2UM (Alexis Orsini,8 février2022, texte complet lu ; Lévy/Calvès/Tanguy distingués ; critique explicitement archivée, ne pas en faire un jugement sur texte2027)
https://marinelepen.com/deplacements (section7octobre Cournon contient explicitement rejet Mercosur prioritaire prochain quinquennat ; ne pas réutiliser archive2022 comme engagement actuel)
https://www.marinelepen.com/actualites/sommet-de-lelevage-a-cournon-dauvergne (essai URL, inaccessible, aucun fait tiré de cette URL)
https://www.lemonde.fr/les-decodeurs/article/2026/05/15/comment-le-rassemblement-national-remodele-son-programme-economique-depuis-quinze-ans_6689438_4355770.html (Maad/Vaudano, renoncement euro et déclaration Tanguy, statut analyse historique et propos de collègue préservés)
https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/already-eu_fr (403 ; remplacé par autorité Schengen suisse)
https://www.sem.admin.ch/fr/faq-entree (sections2.2 visaC,2.10 titres séjour,5.1 durée ; attention séjour ≠ autorisation de travail)
https://www.coe.int/fr/web/portal/eu-accession-echr-questions-and-answers (document2020, utilisé seulement pour distinction stable ConseilEurope/UE et objet convention, pas pour composition actuelle)
https://pourquijevote.com/transcripts/3a8f83f3-e52c-463a-9faf-02d003289ab8 (transcription réelle 41:33–42:07, propos Philippot et non LePen ; opinion souverainiste explicitement identifiée)
https://www.lemonde.fr/les-decodeurs/article/2026/10/10/qu-est-ce-que-le-marche-europeen-de-l-electricite-dont-plusieurs-candidats-a-la-presidentielle-veulent-sortir_6790978_4355770.html (interconnexions et compensation pointes ligne348, distinction prix/échanges, synthèse73 mots environ)

Contrôles sensibles :
CNEWS 15oct : le passage30:43 est archive2016. Réponse contemporaine31:27 et refus explicite référendum33:32–34:14. Nombre de grandes élections volontairement non repris : calendrier Espagne diffère entre présentation campagne Bruxelles et phrase dans entretien. PAC préservée32:48–33:32. Le terme Pâque est erreur ASR, compris PAC au contexte.
LCI16sept : lire21:19–22:42, question sur unilatéralisme appartenant journaliste ; réponse LePen renvoie contrôles existants, ne promet pas explicitement dans ce passage une nouvelle désobéissance unilatérale.
Fin6oct : lire le texte brut autour de « La 4e grande réforme », taxation tabac alcool transférée essentiellement à UE33:19. Ne pas décrire toutes recettes comme « supplémentaires » sans assiette publiée. BCE n'est pas établie dans cet extrait6oct ; rattachement corrigé au compte rendu Bruxelles14oct, qui parle investissements technologiques/climatiques.
Solde net, versement brut et contre-budget : trois métriques gardées séparées. Le montant30,9 correspond PSR proposé2027 et non contribution nette ; pas de soustraction de retours2025 à versements2027. Les chiffres6,4/9,5 ont même année2025 et méthodes clairement séparées. Aucune revendication de rabais obtenus par Italie/Espagne.
Critiques : Maillard négociation/PAC ; Rubio et LeCacheux portée indicateur ; Lévy limite du bouclier national (archive2022) ; Philippot critique souverainiste adverse ; Décodeurs électricité mécanisme interconnexions. Ne pas transformer absence d'instrument détaillé en avis d'expert. Aucun faux droit de réponse personnel à un article postérieur.

Limites : pas de projet juridique2027 complet de révision des traités identifié dans les documents lus ; pas de rendement net/taux harmonisation tabac-alcool, ni clé intensité carbone ou instrumentation BCE ; statut exact de la procédure de rejet/retrait Mercosur non détaillé dans compte rendu campagne consulté. Schengen : exceptions voyageurs et titres séjour non précisées dans la séquence, sans conclure qu'elle n'en aurait jamais parlé ailleurs. Le financement de toutes les baisses TVA n'est pas traité ici comme absence globale : le thème pouvoir d'achat/fiscalité possède d'autres documents.

Droits : compte conservateur de tous les paragraphes citant Bruxelles <200mots, CNEWS150, conférence6oct168, AN157 ; chaque Monde <100, aucune synthèse Figaro ni miroir supplémentaire. Les autres nouvelles sources <200. Citations textuelles très courtes uniquement (« Europe des nations »). Environ1090mots/15blocs. Contrôle format6champs, références existantes+5nouvelles et unicité des URLs effectué avant remise.
