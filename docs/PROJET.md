# Game Engine : moteur de jeux pédagogiques en HTML

> Document vivant. Dernière mise à jour : 2026-11-19. Statut : prototype fonctionnel (V1), cadrage en cours.
> Les sections 13 et 14 sont faites pour recevoir les notes en vrac, qu'on structurera ensuite.

## 1. Objectif

Simplifier le travail des équipes métiers et des équipes de création de contenu pédagogique, avec un **moteur de création de jeux en HTML** :

1. la personne saisit ou importe son contenu (Excel/CSV), règle l'habillage, joue l'aperçu en direct ;
2. elle exporte **un fichier HTML autonome**, qui s'héberge facilement (SharePoint, Rise, Posit Connect sur GCP en dernier recours) ;
3. un **assistant IA**, hébergé dans l'outil IA du client pour la sécurité, joue le rôle d'ingénieur pédagogique : il aide à choisir le bon format, à construire le sujet, puis à remplir le jeu à partir des données du client.

## 2. Trois chantiers

| | Chantier | Contenu | Statut |
|---|---|---|---|
| A | **Moteur et jeux** | Atelier d'édition, lecteurs de jeux, import Excel, export autonome | V1 faite (2 jeux), à valider sur le terrain |
| B | **Assistant IA « ingénieur pédagogique »** | Conseil de format, construction du sujet, remplissage du jeu depuis les données client | À cadrer (section 6) |
| C | **Hébergement et intégration** | SharePoint, Rise, Posit Connect, LMS (SCORM), suivi | SharePoint fonctionne, le reste à clarifier (section 7) |

## 3. Principes directeurs (décisions prises)

1. **Statique et autonome.** HTML/JS sans serveur ni base de données. Un jeu exporté est un fichier unique.
2. **Contenu séparé du jeu.** L'édition (`.json`) est la source de vérité ; l'export HTML est un instantané.
3. **Excel/CSV comme langue commune.** Les formateurs travaillent dans un tableur, et l'assistant IA produira ce même format.
4. **Jeu en autonomie, sur PC d'abord.** Pas de faux adversaire : la compétition se fait contre soi-même.
5. **La pédagogie d'abord.** Rappel actif, feedback expliqué (l'info clé s'affiche toujours), erreurs reposées plus tard, pas de mort subite par défaut.
6. **Sons facultatifs.** Avertissement avant de commencer, choix « avec » ou « sans », bouton pour couper à tout moment.
7. **Aucune donnée ne sort du navigateur** dans la V1.
8. **Compétition en option**, jamais une dépendance structurelle.
9. **Marques et sons tiers : usage interne uniquement.** À remplacer avant toute diffusion externe.

## 4. État d'avancement

**Fait**
- Atelier : éditeur à onglets, aperçu jouable en direct, enregistrement et reprise d'une édition (`.json`), brouillon automatique.
- Identité visuelle : couleurs (codes hex, palettes de marque), 12 polices Office plus génériques plus nom libre, logo (2 Mo max, taille réglable), arrondis.
- Import/export Excel et CSV : modèle à deux feuilles, erreurs signalées ligne par ligne.
- **Jeu 1, Quiz à paliers** : paliers et gains, paliers de sécurité, jokers (50/50, indice, passer), comportement en cas d'erreur, chrono, info clé, fiche mémo, rejouer.
- **Jeu 2, Champion solo** : Sprint, La série, Trouve avant la fin ; questions ratées reposées ; records ; maîtrise par thème et thèmes à retravailler.
- Sons facultatifs (avertissement, choix avec/sans, bouton Son, fondus, suspense plafonné).
- Export HTML autonome pour chaque jeu ; la page de l'atelier fonctionne aussi sur SharePoint (retour du porteur du projet).
- Prototype publié comme artefact Claude privé : <https://claude.ai/artifact/VBqX5XoBfA5EUToyUmoR9A>.

**Limites connues**
- Aucun suivi des apprenants : pas de SCORM, pas de xAPI. Records et maîtrise restent dans le navigateur du joueur.
- Les jeux exportés recopient le code du lecteur : une correction du moteur ne se propage pas aux jeux déjà exportés.
- Un fichier Excel par jeu : pas de banque de contenus partagée entre les jeux.
- Interface en français uniquement ; accessibilité (clavier, lecteurs d'écran, chrono) non auditée.
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
| `atelier/atelier.src.html` | Modèle de l'atelier : éditeur, lecteur du quiz, styles. Sans audio. |
| `atelier/src/commun.js` | Briques partagées : thème visuel, création d'éléments, moteur de sons |
| `atelier/src/champion.js` | Lecteur du Champion solo et sa feuille de style |
| `atelier/sons/` | Fichiers audio (non versionnés) et `packs.json` (correspondance événement, fichier) |
| `atelier/construire.py` | Assemble le modèle, `src/` et `sons/` dans `atelier/dist/` |
| `atelier/dist/` | Fichiers générés (non versionnés) : `atelier-jeux.html` (page complète) et `atelier-artefact.html` |
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
1. **Conseiller sur le choix du dispositif** : séminaire, hackathon, module en ligne, vidéo, serious game, quiz, accompagnement terrain, aide-mémoire. Cela couvre les outils de l'atelier, les outils hors atelier, et ceux pour lesquels le client a des licences (Rise, Kahoot).
2. **Construire le sujet** une fois le format choisi : objectifs, plan, découpage, activités, évaluation.
3. **Remplir le jeu à partir des données du client** : si un serious game de l'atelier est choisi, produire le contenu (questions, indices, scénarios) dans le format d'import.

### 6.2 Principes de conception (propositions)
- **Hébergé dans l'outil IA du client** : les documents et données du client n'arrivent jamais chez nous.
- **Portable** : un prompt système modulaire et une base de connaissances en fichiers, adaptables à l'outil cible.
- **La sortie est un fichier d'import** (le modèle Excel de l'atelier) : la boucle assistant, fichier, atelier fonctionne sans API.
- **Un humain valide** le contenu avant publication.
- **Il pose des questions avant de recommander** : un format ne se choisit qu'après le besoin.

### 6.3 Livrables prévus
- [ ] Prompt système modulaire (rôle, méthode, garde-fous, formats de sortie).
- [ ] Grille de décision des formats (6.4).
- [ ] Fiche des outils et de leurs capacités (atelier, Rise, Kahoot), datée et relue régulièrement.
- [ ] Gabarits : brief de besoin, plan de module, Excel d'import.
- [ ] Jeu d'évaluation : une dizaine de briefs réels avec la réponse attendue, pour mesurer chaque version du prompt.
- [ ] Procédure de mise à jour et de versionnage du prompt.

### 6.4 Grille de décision (ébauche à compléter)
Critères à instruire avant tout choix de format :

| Critère | Questions |
|---|---|
| Nature de l'objectif | Savoir (retenir), savoir-faire (appliquer), savoir-être (se comporter) ? |
| Écart à combler | Quel comportement doit changer au travail ? Mesurable comment ? |
| Public | Effectif, niveau initial, disponibilité, accès aux outils |
| Criticité | Réglementaire ou sécurité (preuve de complétion requise) ou facultatif ? |
| Rythme | Besoin d'un rappel dans le temps (J2, J7, J30) ? |
| Contraintes | Délai, budget, outils et licences disponibles, hébergement |
| Contenu source | Existe-t-il, est-il à jour, qui le valide ? |

### 6.5 Points d'attention
- Taille maximale des instructions et des fichiers de connaissance selon l'outil du client : à vérifier tôt.
- Risque que l'assistant affirme des capacités d'outils qui ont changé.
- Risque de contenu faux ou de distracteurs faibles : chaque question générée doit citer le passage source.
- Confidentialité des documents source et propriété de leur contenu.

## 7. Chantier C : hébergement et intégration

| Cible | Statut | Notes |
|---|---|---|
| Fichier local | Fonctionne | Le fichier s'ouvre dans un navigateur sans serveur |
| **SharePoint** | Fonctionne (retour du porteur) | **À documenter** : comment exactement (page, composant d'intégration, réglage du site) |
| **Rise** | À clarifier | Comment intégrer un jeu : bloc d'intégration, lien, SCORM ? Les résultats remontent-ils ? |
| **Posit Connect (GCP)** | Dernier recours | Publication d'un HTML statique possible ; contrôle d'accès à régler dans le tableau de bord |
| **LMS / SCORM** | Non fait | Le jeu appelle déjà une fonction `suivi()` vide : c'est le point d'accroche |

## 8. Feuille de route proposée

| Phase | Contenu | Critère de réussite |
|---|---|---|
| 0. Socle | Atelier, 2 jeux, sons, export, import Excel | **Fait** |
| 1. Valider sur le terrain | Une équipe métier crée seule un module avec son contenu ; tester l'hébergement SharePoint et Rise | Un module de 10 questions créé sans aide en moins de 30 minutes |
| 2. Assistant IA V0 | Prompt et grille de décision testés sur 3 briefs réels dans l'outil du client | Recommandations jugées pertinentes par un pédagogue |
| 3. Mécaniques suivantes | Tri, Ordre, Association, puis Decision Path (scénario à choix) ; extraction du socle commun | Une mécanique de plus par itération, sans dupliquer le code |
| 4. Mesure et accessibilité | SCORM 1.2 (puis xAPI si besoin) ; audit WCAG 2.2 ; options de temps | Complétion et score remontent dans un LMS ; parcours clavier complet |
| 5. Banque de contenus et parcours | Un contenu, plusieurs jeux ; rappels espacés J2, J7, J30 | Un même fichier de règles alimente deux jeux |

## 9. À faire

**Projet et dépôt**
- [x] Installer le projet dans ce dépôt (atelier, sources, build, recherche).
- [ ] Choisir une licence et définir les règles de contribution.
- [ ] Mettre en place l'intégration continue (build, tests de navigateur).
- [ ] Nettoyer les scripts de test (`atelier/tests/e2e-brouillons/`).

**Atelier et jeux**
- [ ] Numéro de version du moteur dans chaque export, et re-export depuis l'édition `.json`.
- [ ] Embarquer SheetJS et les polices pour les réseaux restreints.
- [ ] Champs « conséquence » et « règle à retenir » dans le contenu (feedback à 4 niveaux).
- [ ] Option de temps supplémentaire ou de désactivation du chrono (accessibilité).
- [ ] Interface multilingue.
- [ ] Mécaniques : Tri, Ordre, Association, Spot the Risk, Decision Path.

**Assistant IA**
- [ ] Choisir l'outil IA cible et relever ses limites (instructions, fichiers, outils).
- [ ] Rédiger la première version du prompt et la grille de décision.
- [ ] Constituer le jeu d'évaluation à partir de 3 à 10 briefs réels.

**Hébergement et intégration**
- [ ] Documenter la procédure SharePoint qui fonctionne.
- [ ] Tester l'intégration dans Rise.
- [ ] Prototype d'enveloppe SCORM 1.2.

**Qualité**
- [ ] Audit d'accessibilité (clavier, lecteurs d'écran, contrastes).
- [ ] Remplacer les sons et les noms de marques avant toute diffusion externe.

## 10. Écueils et risques

| Risque | Pourquoi | Parade |
|---|---|---|
| **Pas de mesure** | Les responsables formation demandent preuve de complétion et scores ; ici tout reste dans le navigateur | Clarifier le besoin tôt ; enveloppe SCORM en phase 4 |
| **Dérive de périmètre** | Trois chantiers et une trentaine de mécaniques possibles | Une mécanique à la fois, pilotée par un cas réel |
| **Droits d'auteur** | Sons, noms de jeux télévisés, images, documents source du client | Packs non versionnés ; noms génériques ; validation avant diffusion externe |
| **Contenu généré faux** | Erreurs factuelles, distracteurs faibles | Validation humaine ; passage source cité ; jeu d'évaluation |
| **Capacités d'outils périmées** | Rise et Kahoot évoluent | Fiche datée, relue chaque trimestre |
| **Limites de l'outil IA du client** | Taille des instructions, fichiers, absence d'outils | Prompt modulaire ; test sur l'outil cible dès la phase 2 |
| **Jeux exportés figés** | Le code du lecteur est recopié dans chaque export | Version dans l'export ; conserver l'édition `.json` |
| **Accessibilité** | Chrono, clavier, lecteurs d'écran, contrastes ; exigences WCAG/RGAA chez les grands comptes | Audit ; options de temps ; exigence du moteur commun |
| **Hébergement fragile** | Restrictions SharePoint, contenu intégré dans Rise, stockage partagé par origine | Documenter ce qui marche ; clés de stockage par édition (fait) |
| **Adoption** | Les auteurs ne sont pas techniques | Test d'usage en autonomie dès la phase 1 |
| **Gouvernance du contenu** | Qui valide, quand une règle métier expire | Champs propriétaire et date de revue |
| **Données personnelles** | Dès qu'on trace des apprenants | RGPD, consultation du DPO, durée de conservation |
| **Dépendances externes** | cdnjs et Google Fonts peuvent être bloqués chez le client | Embarquer les bibliothèques |

## 11. Questions ouvertes

1. Le moteur est-il un **outil interne** (les « clients » sont des entités de votre organisation) ou un **produit vendu** à des entreprises ? Cela change la licence, le support, les droits et le modèle économique.
2. Quel est **l'outil IA des clients** (Copilot, Gemini, ChatGPT Entreprise, autre) ? Chacun a des limites différentes.
3. **Comment l'HTML fonctionne-t-il sur SharePoint** (page, composant d'intégration, réglage du site) ?
4. **Rise** : le jeu doit-il s'y intégrer comme bloc, comme lien, ou comme paquet SCORM ? Les résultats doivent-ils remonter ?
5. Quel **suivi** est exigé (complétion, score, rapports) et par qui ?
6. Qui **crée** les jeux : formateurs, équipes de création, métiers non spécialistes ?
7. **Langues** : français seul, ou plusieurs ?
8. Peut-on envoyer les données des clients à **un outil IA externe**, ou uniquement à celui du client ?
9. A-t-on **deux ou trois équipes** prêtes à tester (design partners) ?
10. Quelle **licence** pour le code, et à qui appartient-il ?

## 12. Ce que la recherche change, et ce qu'elle ne change pas

Rapport complet : [`recherche/deep-research-serious-games-b2b.md`](recherche/deep-research-serious-games-b2b.md).

**À retenir**
- Raisonner en **intention pédagogique** (mémoriser, comprendre, pratiquer, collaborer, évaluer) plutôt qu'en types de jeux.
- Séparer **contenu, mécanique, thème et runtime** ; déclarer des « actions d'apprentissage » par mécanique.
- Feedback à quatre niveaux : résultat, explication, conséquence, règle transférable (nous couvrons les deux premiers).
- Parcours espacés plutôt qu'un événement unique (J0, J2, J7, J21, J60).
- L'accessibilité comme contrainte du moteur commun, pas comme correction a posteriori.
- Le **scénario à choix (Decision Path)** comme mécanique centrale du serious game professionnel.
- Ne pas viser la 3D, les avatars complexes ni le multijoueur temps réel au début.

**À ajuster dans nos plans**
- Le plateau (jeu de l'oie, Trivial Pursuit) était la suite envisagée. Il a peu de valeur pédagogique par minute de jeu : Tri, Ordre, Association et Decision Path passent avant.
- Le noyau commun ne doit pas être refondu trop tôt : extraire le socle partagé à partir de la troisième mécanique.

**Réserves sur le rapport**
- Les références apparaissent sous forme de marqueurs (`citeturn…`) sans lien exploitable dans le fichier : les chiffres cités (nombre d'études, de participants) sont à re-sourcer avant d'être repris dans un document client.
- Les notes de complexité et d'accessibilité sont des estimations de conception, comme le rapport le dit lui-même.
- Le positionnement « entre Kahoot/Genially et Attensi » n'a pas été testé auprès de clients.

## 13. Notes en vrac (à structurer)

<!-- Déposez ici vos pensées, sans ordre. -->

## 14. Journal des décisions

| Date | Décision |
|---|---|
| 2026-11-13 | Cadrage : moteur de jeux en HTML, sans serveur ; contenu séparé du jeu ; premier jeu = quiz à paliers ; mode autonomie sur PC |
| 2026-11-14 | Prototype de l'atelier publié ; identité visuelle personnalisable ; import Excel |
| 2026-11-16 | Sons facultatifs avec avertissement ; second jeu = Champion solo, adapté au solo ; l'erreur ne termine plus la partie par défaut |
| 2026-11-19 | Projet hébergé dans le dépôt `Polokrik/Game-engine` ; ajout du chantier « assistant IA ingénieur pédagogique » ; recherche intégrée |
