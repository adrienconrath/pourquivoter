Case : retraites|melenchon. Relevé du 18 novembre 2026. Recherche et rédaction sous /tmp uniquement ; aucun fichier suivi modifié.

Instructions lues : agent-brief.md ; README.md et .agents/skills/actualiser-pour-qui-voter/SKILL.md ; lignes existantes de sources.tsv et positions.tsv, dont dette|melenchon et mel-dette-psbudget. Recherche des URLs dans le catalogue : réutilisation de mel-prix-besoins, mel-dette-psbudget et dixi-restos.

Requêtes réellement exécutées via web :
- Mélenchon retraite 60 ans 2027 9 milliards 62 2026
- Mélenchon retraite 60 ans financement Institut Montaigne 2022 85 milliards
- Mélenchon retraites 2027 40 annuités cotisation pénibilité
- Mélenchon retraites 60 ans 2026 site:tf1info.fr
- Mélenchon retraites 60 ans 2026 site:franceinfo.fr
- Mélenchon retraites 60 ans site:europe1.fr financement
- Mélenchon retraites 60 ans critique Michaël Zemmour 2022 financement
- site.lafranceinsoumise.fr 2023 contre projet retraite 60 55 milliards pénibilité
- site:service-public.gouv.fr retraite décote proratisation durée assurance taux plein
- site:pourquijevote.com/transcripts Mélenchon retraites 60 2026
- Mélenchon retraite 2027 60 ans 2026 financement BFMTV RTL Europe 1

URL effectivement ouvertes/lues : toutes les neuf nouvelles références du fichier .sources, plus :
https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
https://melenchon2027.fr/programme/plans-thematiques/
https://melenchon2027.fr/programme/plans-investissement/
https://www.publicsenat.fr/actualites/politique/presidentielle-2027-jean-luc-melenchon-table-sur-106-milliards-de-recettes-supplementaires-et-82-milliards-de-depenses-nouvelles-pour-2027
https://pourquijevote.com/transcripts
https://pourquijevote.com/transcripts?q=M%C3%A9lenchon+retraite
https://pourquijevote.com/transcripts?q=retraite&person=jean-luc-melenchon
https://pourquijevote.com/transcripts?q=%22retraite+%C3%A0+60%22
https://pourquijevote.com/transcripts/85fb60fa-3410-4286-942e-ac677bfd3ddf
https://pourquijevote.com/transcripts/72c7f18b-aa37-45fd-b9ff-26fb2c0c2a76
https://dixipolis.com/presidentielle-2027
https://dixipolis.com/politicien/jean-luc-melenchon
https://dixipolis.com/video/226548
https://lcp.fr/actualites/presidentielle-que-proposent-les-candidats-a-l-elysee-sur-les-retraites-441751 (ouverture web, texte partiel)
https://www.ledauphine.com/elections/2026/11/18/retraites-age-de-depart-repartition-ou-capitalisation-ce-que-proposent-les-candidats (comparatif régional lu via web)
https://www.europe1.fr/politique/le-pen-retailleau-attal-que-proposent-les-principaux-candidats-a-la-presidentielle-pour-les-retraites-1114199 (403 : non utilisé comme preuve)

Méthode : ouvertures web puis récupération requests/BeautifulSoup lorsque la réponse web limitait l'affichage aux menus. Programme, Public Sénat et Dixipolis ont été lus dans le texte intégral extrait. Dixipolis a d'abord échoué sur son encodage br, résolu en demandant gzip/deflate. Le Parisien a refusé requests mais web a fourni le chapeau et les paragraphes 221–224 ; seule cette portion ouverte est utilisée.

Contrôles sensibles :
- Programme actuel section « Garantir une retraite digne » : séquence abrogation64 puis60/40, minima carrière complète/SMIC versus minimumvieillesse/seuilpauvreté, RSA, décote, compensation exonérations, niches capitalisation. Pas de retour confirmé aux dix meilleures années ni d'indexation générale sur salaires dans cette section : pas d'import automatique du programme2022.
- Public Sénat/AFP 14oct2026 : 9Md attachés au retour62 dans premierbudget2027, 60ans ensuite pendantmandat ; 106,4 recettes/81,7 dépenses sont agrégats globaux. Ne pas additionner taxeZucman/ISF/etc comme financement exclusif de retraite. Chiffrage complet annoncé début2027.
- TF1 17nov2026 21h20 : exempleMekki début24ans, départ60 possible,40annuités atteintes64. Aucune pension personnalisée calculée.
- Décote : Service Public vérifié1jan2026 distingue réduction du taux et calcul selon trimestres. Archive Parisien13mai2022 restitue les réponses de Mélenchon à Sotto ; pas de confusion sansdécote/pensionidentique.
- CFDT PDF : questions22–23 cotisation+0,25point/an, assiettes intéressement/participation/épargne et revenusfinanciers ; question24 prévention ; statut2022 explicite. Le PDF dit « semestres » pour RSA à la question23, alors que programme2027 dit trimestres ; pas de reprise de cette anomalie d'archive.
- Contreprojet LFI-Nupes février2023 : pages imprimées19–20 (PDF pages20–21), quatrecritères exclus en2017 ; document parlementaire, pas déclarationpersonnelle2027.
- InstitutMontaigne : 85,8Md/an horizon2027 du programme2022 ;fourchette36–112,8 ;régimesretraiteseuls ; campagne71,5 coût/71,8ressources. Ce n'est PAS l'estimation du programme2027 ni celle du seul âge60. Analyse macroemploi distincte. Synthèse attribuée cumulée <200mots pour cette source.
- LeMonde tchat14avril2022 : réponses de11h24 et11h36 de Michaël Zemmour, expert et non porte-parole du candidat ; possibilitétechnique et arbitrages. Synthèse <100mots attribués à cetarticle.
- AFPFactuel mars2022 : citationRMC10mars sur espérancedevie contredite par donnéesDrees/Insee ; nonincluse faute de place. TF114mars : les4,5Md chômage allégués ne correspondent pas aux1,3Md ARE/AREF et3,6Md autresprestations chiffrés sur un autre périmètre ; pas de réponse entourage à l'AFP. La fiche retient incertitude chiffrage, ne déclare pas inexistants les transferts.
- Dixipolis226548 passage2:26:14–2:29:43 réponse Mélenchon richesse/productivité et minima ;2:29:55–2:30:28 critiqueRetailleau ;2:30:28–2:31:05 réponseMélenchon ;2:31:15–2:33:57 critiqueAttal et réponses. Les toursincluent des interruptions. Pas de citation longue reproduite. Chiffres manifestement faux de transcription (minimumretraite «2000» dans témoignage au lieu1000 rappelé ensuite, «pigné») exclus. Propos«pasaugmentationcotisationsdepuis1990» non repris commefait. La promesseoraleSMICpourtous est présentée comme écart au programme, pas harmonisée artificiellement.
- Pourquijevote85fb60 : passage2h18–2h19 est une interventionGlucksmann, pasMélenchon (Dixipolis permet contrôle) ; exclusion. Les horaires varient de quelquessecondes entre transcriptions : fiche horairesDixipolis.
- Pourquijevote72c7 : date affichée29août2026 etchapitresautomatiques incohérents avec durée3min («8:01»), début sarcastique deMélenchon classé parIA en propositionspersonnelles de suppressioncotisations/ISF. Lecture texte entier démontre qu'il caricature des adversaires. NONutilisé en fiche, horodatage incertain. Cette erreur est signalée pour éviter propagation.

Limites : pas de calendrier générationnel60ans, barème départsanticipés2027, règle opérationnelle tousrégimes de proratisation après suppressiondécote, articulation minimaoral/écrit ni chiffrage2027 complet retrouvés. Aucun chiffreancien requalifié en promesse2027. Franceinfo accèsdirect robots ; Europe1 403 ; analysesRMC/TF1 passées accessibles viaAFP et LeParisien. Diversité réelle : officiel2027 et archives2022/2023, TF1, RTL, PublicSénat/AFP, pressequotidienne/régionale, institut et économiste, débatcontradictoire. Douze blocs, 991mots utiles, quatre axes critiques attribués. Validation format sixchamps/lignes, référencesexistantes contrôlées.
