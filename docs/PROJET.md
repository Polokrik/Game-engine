# Game Engine : moteur de jeux pédagogiques en HTML

> Document vivant. Dernière mise à jour : 2026-11-19. Statut : prototype fonctionnel (V1), cadrage en cours.
> **Produit interne, à usage interne uniquement.**
> La section 13 est faite pour recevoir les notes en vrac, qu'on structurera ensuite.

## 1. Objectif

Simplifier le travail des équipes métiers et des équipes de création de contenu pédagogique, avec un **moteur de création de jeux en HTML** :

1. la personne saisit ou importe son contenu (Excel/CSV), règle l'habillage, joue l'aperçu en direct ;
2. elle exporte **un fichier HTML autonome**, hébergé sur **SharePoint** ou dans **Rise** (Posit Connect sur GCP en dernier recours) ;
3. dans Rise, le jeu peut être **une partie d'un module complet** : l'ensemble s'exporte en SCORM vers le LMS du client ;
4. un **assistant IA**, hébergé dans l'outil IA du client pour la sécurité, joue le rôle d'ingénieur pédagogique : il aide à choisir le bon format, à construire le sujet, puis à remplir le jeu à partir des documents du client.

## 2. Trois chantiers

| | Chantier | Contenu | Statut |
|---|---|---|---|
| A | **Moteur et jeux** | Atelier d'édition, lecteurs de jeux, import Excel, export autonome | V1 faite (2 jeux), à valider dans les équipes |
| B | **Assistant IA « ingénieur pédagogique »** | Conseil de format, construction du sujet, remplissage du jeu | Première version de la documentation rédigée (`assistant/`) |
| C | **Hébergement et intégration** | SharePoint, Rise, LMS | SharePoint fonctionne ; à tester : jeu dans Rise (section 7) |

## 3. Principes directeurs (décisions prises)

1. **Statique et autonome.** HTML/JS sans serveur ni base de données. Un jeu exporté est un fichier unique.
2. **Contenu séparé du jeu.** L'édition (`.json`) est la source de vérité ; l'export HTML est un instantané.
3. **Excel/CSV comme langue commune.** Les auteurs travaillent dans un tableur, et l'assistant IA produit ce même format.
4. **Jeu en autonomie, sur PC d'abord.** Pas de faux adversaire : la compétition se fait contre soi-même.
5. **La pédagogie d'abord.** Rappel actif, feedback expliqué (l'info clé s'affiche toujours), erreurs reposées plus tard, pas de mort subite par défaut.
6. **Garder un côté fun.** Sons, animations, tableau des scores : le plaisir est une exigence, pas un bonus.
7. **Sons facultatifs.** Avertissement avant de commencer, choix « avec » ou « sans », bouton pour couper à tout moment. Chrono activable ou désactivable.
8. **Les auteurs sont experts de leurs outils, pas pédagogues.** C'est l'atelier et l'assistant qui portent la pédagogie : garde-fous et conseils intégrés plutôt que réglages à comprendre.
9. **Produit interne.** Pas de multi-clients, pas de licence commerciale. Les « clients » sont les entités de l'organisation.
10. **Aucune donnée ne sort du navigateur** pour l'instant. Le suivi des apprenants est tenu par Rise au niveau du module.
11. **Les auteurs sont responsables de leurs jeux exportés** (contenu, info clé, mise à jour). Un jeu hébergé dans Rise se modifie depuis Rise, même une fois publié dans le LMS.
12. **Kahoot est écarté** du périmètre (usage événementiel, bootcamps en présentiel).

## 4. État d'avancement

**Fait**
- Atelier : éditeur à onglets, aperçu jouable en direct, enregistrement et reprise d'une édition (`.json`), brouillon automatique.
- Identité visuelle : couleurs (codes hex, palettes de marque), 12 polices Office plus génériques plus nom libre, logo (2 Mo max, taille réglable), arrondis.
- Import/export Excel et CSV : modèle à deux feuilles, erreurs signalées ligne par ligne.
- **Jeu 1, Quiz à paliers** : paliers et gains, paliers de sécurité, jokers (50/50, indice, passer), comportement en cas d'erreur, chrono facultatif, info clé, fiche mémo, rejouer.
- **Jeu 2, Champion solo** : Sprint, La série, Trouve avant la fin ; questions ratées reposées ; records ; maîtrise par thème et thèmes à retravailler ; chrono facultatif.
- Sons facultatifs (avertissement, choix avec/sans, bouton Son, fondus, suspense plafonné).
- **Tableau des scores local façon arcade**, dans les deux jeux et dans le HTML exporté : 3 initiales, pseudo généré ou pseudo libre filtré ; filtre des insultes et mots interdits ajoutés par l'auteur ; top 5, 10 ou 20 ; gardé dans le navigateur du joueur.
- Export HTML autonome pour chaque jeu ; l'atelier et ses exports fonctionnent sur SharePoint.
- Prototype publié comme artefact Claude privé : <https://claude.ai/artifact/VBqX5XoBfA5EUToyUmoR9A>.

**Limites connues**
- Les scores des jeux ne remontent pas au LMS : records et maîtrise restent dans le navigateur du joueur.
- **Sur SharePoint, le stockage du navigateur est bloqué** : scores, records et maîtrise par thème ne durent que le temps d'une visite. La « progression par thème » du Champion solo n'y est donc pas conservée.
- Les jeux exportés recopient le code du lecteur : une correction du moteur ne se propage pas aux jeux déjà exportés (mitigé par la décision 11).
- Un fichier Excel par jeu : pas de banque de contenus partagée entre les jeux.
- Interface en français uniquement ; accessibilité (clavier, lecteurs d'écran) non auditée, à prévoir plus tard.
- L'import Excel et les polices de l'éditeur dépendent de cdnjs et de Google Fonts.
- Les polices Office ne s'affichent que si elles sont installées sur le poste du joueur.
- Les sons du pack du prototype sont des extraits d'émissions de télévision.
- Les tests sont des scripts de navigateur bruts (`atelier/tests/e2e-brouillons/`), sans intégration continue.

## 5. Architecture actuelle

```
Atelier (éditeur)  --écrit-->  Édition (.json)  --lue par-->  Lecteur du jeu
       |                                                          ^
       +------ aperçu = le vrai lecteur, monté en direct ---------+
       |
       +--> Export : un .html avec CONFIG + code du lecteur + sons embarqués
```

| Chemin | Rôle |
|---|---|
| `atelier/atelier-jeux.html` | **Le fichier à ouvrir** : page complète avec les sons par défaut, générée et versionnée |
| `atelier/atelier.src.html` | Modèle de construction : éditeur, lecteur du quiz, styles. Ne s'ouvre pas seul |
| `atelier/src/commun.js` | Briques partagées : thème visuel, création d'éléments, moteur de sons |
| `atelier/src/champion.js` | Lecteur du Champion solo et sa feuille de style |
| `atelier/sons/` | Fichiers audio du pack par défaut (usage interne), `packs.json` et `durees.json` |
| `atelier/construire.py` | Assemble le modèle, `src/` et `sons/` (options `--sans-sons`, `--sortie`) |
| `atelier/dist/` | Fichiers générés, non versionnés : `atelier-artefact.html` |
| `.github/workflows/pages.yml` | Publication de la page de l'atelier sur GitHub Pages (avec sons par défaut) |
| `assistant/` | Documentation de l'assistant IA : prompt système, connaissances, gabarits, jeu d'évaluation |
| `docs/` | Ce document et la recherche |

**Modèle de données d'une édition** (simplifié) :

```json
{
  "jeu": "quiz | champion",
  "meta": { "titre": "", "id": "", "sousTitre": "", "messageFin": "" },
  "theme": { "fond": "", "carte": "", "texte": "", "accent": "", "police": "", "logo": null },
  "regles": { },
  "champion": { "manches": [], "sprint": {}, "serie": {}, "trouve": {} },
  "sons": { "actif": true, "volume": 70, "pistes": { } },
  "questions": [ { "enonce": "", "reponses": [], "bonne": 0, "infoCle": "", "theme": "", "niveau": "1" } ],
  "trouve": [ { "theme": "", "indices": [], "reponse": "", "faux": [], "infoCle": "" } ]
}
```

**Jeux existants et actions d'apprentissage** (voir la recherche, section « Du jeu à l'apprentissage ») :

| Jeu | Actions d'apprentissage |
|---|---|
| Quiz à paliers | retrouver, reconnaître |
| Sprint | retrouver, reconnaître (sous contrainte de temps) |
| La série | retrouver, consolider |
| Trouve avant la fin | déduire à partir d'indices, décider quand répondre |

## 6. Chantier B : l'assistant IA « ingénieur pédagogique »

### 6.1 Trois fonctions
1. **Conseiller sur le choix du dispositif.** Il propose **toujours 2 ou 3 formats**, avec pour chacun les avantages, les limites, l'effort et la mesure, puis une recommandation motivée. Formats couverts : l'atelier de jeux, Rise (module complet), et les formats hors outil (vidéo, séminaire, atelier, hackathon, accompagnement terrain, aide-mémoire…).
2. **Construire le sujet** une fois le format choisi : objectifs observables, plan, activités, évaluation, rappels.
3. **Remplir un jeu de l'atelier** à partir des documents du client : produire le contenu dans le format d'import (Excel).

### 6.2 Contexte d'exécution (réponses du 2026-11-19)
- Les clients disposent de **Copilot**, d'un **outil maison** (plusieurs modèles, interface et fonctions environ un an en retard sur les IA grand public) et, par exception, de **GCP**. Ni ChatGPT Entreprise, ni Gemini, ni Claude.
- **Conséquence de conception** : un prompt court, des étapes numérotées, des gabarits de sortie, et le gros de la connaissance dans des fichiers séparés. Il doit fonctionner avec des modèles moins performants, sans outils ni recherche web.
- Les auteurs sont experts de leurs outils, pas pédagogues : l'assistant doit poser les questions qu'un pédagogue poserait.

### 6.3 Principes de conception
- **Hébergé dans l'outil IA du client** : les documents du client n'arrivent jamais chez nous.
- **Il pose des questions avant de recommander** : un format ne se choisit qu'après le besoin.
- **Il ne s'appuie que sur la fiche des formats et outils.** Une capacité non écrite n'existe pas : il le dit et renvoie vers l'équipe learning.
- **La sortie est un fichier d'import** (le modèle Excel de l'atelier) : la boucle assistant, fichier, atelier fonctionne sans API.
- **Chaque question générée cite son passage source** ; un humain valide avant publication.

### 6.4 Livrables (version 0.2 dans `assistant/`)
Les premiers retours des testeurs sont positifs. La version 0.2 répond aux critiques : prompt trop court et peu précis, pas d'instruction pour explorer les fichiers, fichiers trop vagues.
- [x] Prompt système de 5 500 caractères environ (limite de Copilot : 8 000) : identité, procédure de consultation des fichiers, 10 règles absolues, déroulé en 3 étapes, situations fréquentes.
- [x] `00-index` : porte d'entrée qui indique la section à consulter selon la question.
- [x] `01-diagnostic-et-choix`, `02-formats-et-outils`, `03-construire-par-format`, `04-remplir-un-jeu`, `05-guide-atelier`, `06-gabarits`, `07-exemples` : 51 sections codées, qui se comprennent seules.
- [x] Jeu d'évaluation : 20 critères et 8 cas (`assistant/evaluation/jeu-evaluation.md`).
- [x] Outils : `verifier.py` (cohérence), `construire-connaissances.py` (conversion en Word pour Copilot).
- [x] Liste de ce qu'il manque (`assistant/a-completer.md`, 18 points).
- [ ] Compléter les éléments `[à compléter]` avec les équipes Rise, SharePoint, learning.
- [ ] Évaluer avec la grille sur Copilot et sur l'outil maison, avec 3 à 10 vrais briefs.
- [ ] Procédure de mise à jour et de versionnage.

### 6.5 Points d'attention
- Limites d'instructions et de fichiers de connaissance de chaque outil : à vérifier.
- Risque que l'assistant affirme des capacités d'outils qui ont changé : fiche datée, relue régulièrement.
- Risque de contenu faux ou de distracteurs faibles : validation par l'expert métier.
- Confidentialité des documents source : ils restent dans l'outil IA du client.

## 7. Chantier C : hébergement et intégration

| Cible | Statut | Notes |
|---|---|---|
| Fichier local | Fonctionne | S'ouvre dans un navigateur sans serveur |
| **SharePoint** | **Fonctionne** | Une mise à jour permet les dossiers SharePoint et les pages HTML classiques, accessibles et modifiables directement dans SharePoint |
| **Rise** | **Fonctionne (hébergement)** | Rise héberge les sorties HTML des jeux et permet de construire un module complet autour. Export SCORM vers le LMS. Le suivi est tenu par le module |
| **LMS** | Via Rise | Le SCORM de Rise se met à jour depuis Rise, y compris quand il est déjà hébergé dans le LMS |
| Posit Connect (GCP) | Dernier recours | Publication d'un HTML statique possible ; contrôle d'accès à régler dans le tableau de bord |
| **GitHub Pages** | **En ligne** : <https://polokrik.github.io/Game-engine/> | Publie l'**éditeur seul**, sur une adresse **publique**, avec les sons. Pratique pour partager l'outil ; les jeux d'entreprise restent sur SharePoint ou dans Rise |

**À tester avant de généraliser** (dans Rise, puis dans le LMS) :
- les records et le futur tableau des scores, qui reposent sur le stockage du navigateur : un jeu intégré dans une fenêtre imbriquée peut le voir bloqué ou vidé ;
- le son (lancement par clic) et le plein écran ;
- l'affichage à la taille du bloc Rise ;
- ce que Rise considère comme « complété » : la navigation dans le module, ou aussi le jeu ?

## 8. Feuille de route proposée

| Phase | Contenu | Critère de réussite |
|---|---|---|
| 0. Socle | Atelier, 2 jeux, sons, export, import Excel | **Fait** |
| 1. Terrain | Un jeu hébergé dans Rise puis dans le LMS ; une personne des équipes (experte de son outil) crée seule un module avec son contenu | Un module de 10 questions créé sans aide en moins de 30 minutes |
| 2. Assistant IA V0 | Tester le prompt sur Copilot et l'outil maison avec 3 briefs réels | Au moins 2 options crédibles par brief, jugées pertinentes par un pédagogue |
| 3. Fun et garde-fous | Tableau des scores façon arcade, animations ; contrôles de qualité dans l'atelier pour les auteurs non pédagogues | Les testeurs rejouent d'eux-mêmes ; les contenus faibles sont signalés avant l'export |
| 4. Mécaniques suivantes | Tri, Ordre, Association, puis scénario à choix ; extraction du socle commun à la troisième mécanique | Une mécanique de plus par itération, sans dupliquer le code |
| 5. Accessibilité | Audit WCAG 2.2, parcours clavier, lecteurs d'écran | Parcours complet au clavier |
| 6. Banque de contenus et rappels | Un contenu, plusieurs jeux ; rappels espacés | Un même fichier de règles alimente deux jeux |

Le SCORM propre au jeu n'est plus une priorité : Rise assure le suivi du module. Il ne redevient utile que si on veut faire remonter le **score** d'un jeu au LMS.

## 9. À faire

**Projet et dépôt**
- [x] Installer le projet dans ce dépôt (atelier, sources, build, recherche).
- [ ] Mettre en place l'intégration continue (build, tests de navigateur).
- [x] Activer GitHub Pages (source : GitHub Actions).
- [x] Fusionner la branche dans `main` ; adresse publique testée (page, sons, Champion solo, import Excel).
- [ ] Relire le contenu du dépôt, devenu public : `docs/PROJET.md` décrit le contexte interne (outils IA, Rise, SharePoint) et `assistant/` le prompt de l'assistant.
- [ ] Nettoyer les scripts de test (`atelier/tests/e2e-brouillons/`).

**Terrain (phase 1)**
- [ ] Choisir 3 vrais besoins de formation, avec leur contenu source.
- [ ] Publier un jeu dans Rise, puis dans le LMS, et dérouler la liste de tests de la section 7.
- [ ] Faire créer un module à un auteur des équipes, sans aide, et chronométrer.

**Assistant IA (phase 2)**
- [x] Limites de Copilot relevées : 8 000 caractères d'instructions, fichiers de connaissance en Word, Excel, PowerPoint ou PDF (pas Markdown), 20 fichiers au maximum dans Agent Builder.
- [ ] Relever les limites de l'outil maison.
- [ ] Remplacer les cas fictifs du jeu d'évaluation par des briefs réels.
- [ ] Compléter les 18 informations de `assistant/a-completer.md`, en commençant par les procédures SharePoint et Rise.

**Atelier et jeux**
- [x] Tableau des scores local (option A de la section 11).
- [x] Tableau des scores sur SharePoint : testé en page HTML et en dossier, le stockage est bloqué dans les deux cas. **Décision : pas de persistance des scores sur SharePoint** ; le tableau tient le temps d'une visite.
- [ ] Classement commun (option B, liste SharePoint) : à construire seulement si une équipe le demande.
- [ ] Animations et micro-effets (le côté fun).
- [ ] Contrôles de qualité pour les auteurs : info clé manquante, thème de moins de 8 questions, réponses trop longues ou trop proches, etc.
- [ ] Numéro de version du moteur dans chaque export.
- [ ] Embarquer SheetJS et les polices pour les réseaux restreints.
- [ ] Champs « conséquence » et « règle à retenir » dans le contenu (feedback à 4 niveaux).
- [ ] Interface multilingue (si besoin confirmé).
- [ ] Mécaniques : Tri, Ordre, Association, Spot the Risk, scénario à choix.

**Qualité et droits**
- [ ] Faire valider par le juridique interne l'usage des sons du prototype, ou les remplacer par des sons libres de droits.
- [ ] Audit d'accessibilité (clavier, lecteurs d'écran, contrastes).

## 10. Écueils et risques

| Risque | Pourquoi | Parade |
|---|---|---|
| **Le suivi s'arrête au module** | Rise remonte la progression du module ; le score d'un jeu n'y figure pas | Décider si c'est acceptable ; sinon, passerelle SCORM du jeu |
| **Le jeu se comporte autrement dans Rise ou le LMS** | Fenêtre imbriquée : stockage, son, plein écran, taille | Liste de tests de la section 7, dès la phase 1 |
| **Auteurs non pédagogues** | Experts de leurs outils, ils ne repèrent pas un mauvais distracteur ni un format inadapté | Assistant IA, contrôles de qualité dans l'atelier, relecture par l'équipe learning |
| **Dérive de périmètre** | Trois chantiers et une trentaine de mécaniques possibles | Une mécanique à la fois, pilotée par un besoin réel |
| **Contenu généré faux** | Erreurs factuelles, distracteurs faibles, surtout avec des modèles moins performants | Passage source cité ; validation par l'expert métier ; jeu d'évaluation |
| **Assistant IA limité par l'outil** | Copilot et l'outil maison ont des limites de taille et de fonctions | Prompt compact ; connaissance en fichiers ; test sur les deux outils |
| **Capacités d'outils périmées** | Rise évolue | Fiche datée, relue régulièrement |
| **Droits d'auteur des sons** | Extraits d'émissions de télévision, désormais **publics** : fichiers du dépôt public et page GitHub Pages | Décision du porteur (2026-11-25) ; validation juridique ou sons libres de droits ; `PUBLIER_SONS=false` retire les sons de la page |
| **Tableau des scores et records** | **Sur SharePoint (page HTML ou dossier), le stockage du navigateur est bloqué** : scores, records et maîtrise par thème disparaissent à l'actualisation (constaté) ; noms saisis librement | Décision : pas de persistance sur SharePoint ; le jeu l'annonce ; voir la section 11 |
| **Accessibilité** | Clavier, lecteurs d'écran, contrastes ; à prévoir plus tard | Phase 5 ; chrono déjà désactivable |
| **Jeux exportés figés** | Le code du lecteur est recopié dans chaque export | Risque assumé : modifiable depuis Rise ; numéro de version à ajouter |
| **Dépendances externes** | cdnjs et Google Fonts peuvent être bloqués sur le réseau | Embarquer les bibliothèques |

## 11. Le tableau des scores façon arcade

**État (2026-11-25) : l'option A est construite, désactivée par défaut, et destinée aux jeux hébergés sur SharePoint** (inutile dans Rise ou un LMS). **Limite constatée le 2026-11-27 : avec l'envoi d'une page HTML sur SharePoint, le stockage du navigateur est bloqué et les scores disparaissent à l'actualisation** (ils tiennent le temps de la visite). Le dossier SharePoint n'y change rien (testé) : **pas de persistance des scores sur SharePoint**, décision prise. Un classement partagé demanderait une brique côté serveur (par exemple Microsoft Forms ou Power Automate), non retenue pour l'instant (classement local, dans les deux jeux et dans les HTML exportés). L'auteur choisit dans l'onglet **Scores** : activer ou non, le mode de nom (3 initiales, pseudo généré, pseudo libre filtré), le nombre de scores gardés et des mots interdits en plus. Le filtre est un filtre de base : il refuse les insultes courantes même écrites avec des chiffres ou des points, mais ne remplace pas une modération. Les options B et C restent à décider.

L'idée : le joueur inscrit son nom à la fin de la partie, comme sur une borne d'arcade. Elle sert le côté fun. Les travaux sur la gamification suggèrent que classements et points ajoutés en surface ne suffisent pas à motiver sur la durée (source 7 de `recherche/sources.md`, obtenue sur des élèves en mathématiques) : c'est une **couche de plaisir**, à relier à la progression personnelle (« votre meilleur score »).

**Trois niveaux possibles**

| Option | Principe | Avantages | Limites |
|---|---|---|---|
| **A. Local** | Les 10 meilleurs scores **sur ce poste**, dans le navigateur | Aucune infrastructure ; aucune donnée personnelle partagée | Pas de classement commun ; stockage à tester dans Rise et le LMS |
| **B. Partagé via SharePoint** | Les scores écrits dans une liste SharePoint par le jeu hébergé sur SharePoint | Un vrai classement d'équipe | Droits d'accès, identité, données personnelles ; ne fonctionne pas pour un jeu hébergé dans Rise |
| **C. Service externe** | Un serveur dédié | Classement global | **Exclu** (usage interne, aucune donnée à l'extérieur) |

**Recommandation** : commencer par l'option A, puis décider de B si le besoin d'un classement commun se confirme.

**Censure des noms**
- Choix recommandé : **3 initiales** (l'esprit arcade) **ou un pseudo généré** (adjectif plus animal, par exemple « Panda Fougueux ») sans saisie libre : c'est le plus sûr.
- Si saisie libre : liste de mots interdits en français, normalisée (accents, majuscules, chiffres à la place de lettres, espaces et répétitions), modifiable par l'auteur du jeu, avec un message neutre en cas de refus.
- Un nom étant une donnée personnelle, l'option B demande de consulter le DPO.

## 12. Ce que la recherche change, et ce qu'elle ne change pas

Rapport complet : [`recherche/deep-research-serious-games-b2b.md`](recherche/deep-research-serious-games-b2b.md). Sources vérifiées : [`recherche/sources.md`](recherche/sources.md).

**À retenir**
- Raisonner en **intention pédagogique** (mémoriser, comprendre, pratiquer, collaborer, évaluer) plutôt qu'en types de jeux.
- Séparer **contenu, mécanique, thème et runtime** ; déclarer des « actions d'apprentissage » par mécanique.
- Feedback à quatre niveaux : résultat, explication, conséquence, règle transférable (nous couvrons les deux premiers).
- Parcours espacés plutôt qu'un événement unique (J0, J2, J7, J21, J60).
- L'accessibilité comme contrainte du moteur commun.
- Le **scénario à choix** comme mécanique centrale du serious game professionnel.
- Ne pas viser la 3D, les avatars complexes ni le multijoueur temps réel au début.

**À ajuster dans nos plans**
- Le plateau (jeu de l'oie, Trivial Pursuit) était la suite envisagée. Genially le propose déjà et sa valeur pédagogique par minute de jeu est faible : Tri, Ordre, Association et scénario à choix passent avant.
- Le noyau commun ne doit pas être refondu trop tôt : extraire le socle partagé à partir de la troisième mécanique.

**Réserves**
- Les chiffres clés du rapport (10 514 personnes, 435 études) sont **confirmés** par leurs sources.
- La phrase du rapport sur la simulation et le débriefing est **plus forte que sa source** (étudiants infirmiers, « peuvent favoriser ») : à reformuler avec prudence.
- Les notes de complexité et d'accessibilité sont des estimations de conception.
- Le positionnement de marché du rapport concerne un produit vendu : il est **sans objet** pour un outil interne.

## 13. Notes en vrac (à structurer)

<!-- Déposez ici vos pensées, sans ordre. -->

## 14. Journal des décisions

| Date | Décision |
|---|---|
| 2026-11-13 | Cadrage : moteur de jeux en HTML, sans serveur ; contenu séparé du jeu ; premier jeu = quiz à paliers ; mode autonomie sur PC |
| 2026-11-14 | Prototype de l'atelier publié ; identité visuelle personnalisable ; import Excel |
| 2026-11-16 | Sons facultatifs avec avertissement ; second jeu = Champion solo, adapté au solo ; l'erreur ne termine plus la partie par défaut |
| 2026-11-19 | Projet hébergé dans le dépôt `Polokrik/Game-engine` ; ajout du chantier « assistant IA ingénieur pédagogique » ; recherche intégrée |
| 2026-11-19 | **Produit interne, usage interne uniquement.** Outils IA des clients : Copilot, outil maison, GCP en exception. SharePoint et Rise hébergent les jeux ; suivi tenu par Rise ; SCORM via Rise. Kahoot écarté. L'assistant propose toujours 2 ou 3 formats avec avantages et limites. Les auteurs sont responsables de leurs jeux exportés. Chrono activable ou désactivable. L'accessibilité vient plus tard. Garder un côté fun. Tableau des scores façon arcade à cadrer |
| 2026-11-25 | Sons par défaut remis dans le build et versionnés dans le dépôt privé (usage interne). Publication sur GitHub Pages préparée : outil seul, public, **sans sons par défaut** ; les sons peuvent être publiés avec la variable `PUBLIER_SONS=true` |
| 2026-11-25 (suite) | Le dépôt est passé en **public** et GitHub Pages est activé. Décision du porteur : **les sons sont publiés** sur la page (par défaut, `PUBLIER_SONS=false` pour les retirer) |
| 2026-11-25 (fin) | **La page est en ligne** sur GitHub Pages, avec les sons : <https://polokrik.github.io/Game-engine/> |
| 2026-11-25 (soir) | **Tableau des scores local** construit (option A) : initiales, pseudo généré ou libre filtré ; scores gardés dans le navigateur du joueur. Correction d'un défaut de l'éditeur : quitter un champ de texte relançait l'aperçu |
| 2026-11-26 | Le tableau des scores devient une **option désactivée par défaut**, réservée aux jeux hébergés sur SharePoint ; pas de besoin pour Rise ou le LMS |
| 2026-11-26 (assistant) | **Assistant IA, version 0.2** : prompt plus précis avec procédure pour explorer les fichiers, base de connaissances restructurée en 8 fichiers et 51 sections, exemples, guide de l'Atelier, liste de ce qui manque. Constat : les fichiers Markdown ne sont pas acceptés comme connaissance par Copilot Studio, d'où une conversion en Word |
| 2026-11-27 | Le réglage du tableau des scores, introuvable en bas de l'onglet Règles, passe dans un **onglet « Scores » dédié** (avec son état dans le libellé), et le jeu affiche dès l'accueil « Aucun score pour l'instant : soyez le premier ! » quand il est activé. Le message d'export rappelle l'état de l'option |
| 2026-11-27 (scores) | **Limite constatée** : sur SharePoint, une page HTML envoyée est affichée dans un cadre isolé qui bloque le stockage du navigateur, donc le tableau des scores ne survit pas à l'actualisation. Reproduit avec un cadre isolé. Décision : tester l'hébergement en dossier ; si le stockage y est aussi bloqué, tant pis pour la persistance des scores. Message du jeu rendu explicite |
| 2026-11-27 (suite) | Test de l'envoi en dossier sur SharePoint : même blocage du stockage. **Décision : on renonce à la persistance des scores et records sur SharePoint** ; le jeu garde un tableau valable le temps d'une visite. On passe au sujet suivant |
