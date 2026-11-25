# Fiche des formats et outils

Version 0.1 · 2026-11-19 · source : porteur du projet. **À relire chaque trimestre.** Les éléments marqués `[à compléter]` ne sont pas confirmés : l'assistant ne doit pas les affirmer.

## 1. Atelier de jeux (outil interne)

Atelier d'édition de jeux de connaissances en HTML. Les auteurs saisissent ou importent leur contenu (Excel), règlent l'habillage, jouent l'aperçu, puis exportent un fichier HTML autonome, hébergé dans Rise ou sur SharePoint.

**Disponible aujourd'hui**

| Jeu | Principe | Pour quoi faire | Durée et volume | Contenu à fournir |
|---|---|---|---|---|
| **Quiz à paliers** | Questions à choix, montée de paliers, jokers, info clé après chaque réponse | Retrouver et reconnaître des connaissances | 5 à 10 min ; 10 à 20 questions | Questions avec 2 à 4 réponses, une info clé, un thème |
| **Champion solo** | 3 manches : Sprint (atteindre un nombre de points), La série (enchaîner 4 bonnes réponses sur un thème), Trouve avant la fin (deviner un concept avec 4 indices, plus tôt = plus de points) | Retrouver, consolider, déduire à partir d'indices | 5 à 10 min ; 12 à 20 questions | Questions avec thème et niveau (1 à 3 points) ; concepts avec 4 indices, une réponse et 3 fausses propositions |

**Points communs.** Chrono facultatif. Sons facultatifs. Fiche mémo en fin de partie. Tableau des scores local façon arcade (3 initiales, pseudo généré ou pseudo libre filtré), propre à chaque poste. Les questions ratées sont reposées plus tard dans le Champion solo. Un thème doit contenir au moins 8 questions pour que la série de 4 fonctionne bien.

**Limites à connaître**
- Le score reste dans le navigateur du joueur : **il ne remonte pas au LMS**.
- Les jeux travaillent la **récupération en mémoire** ; ils ne suffisent pas pour apprendre seul une compétence complexe.
- Pas d'accessibilité complète pour l'instant (clavier partiel, lecteurs d'écran non testés).
- Interface en français uniquement.

**Pas encore disponibles : ne pas les proposer comme disponibles.** Tri de cartes, ordonnancement, association, détection d'erreurs sur image, scénario à choix, dialogue.

## 2. Rise (outil auteur du client)

- Permet de **construire un module de formation complet**.
- Permet d'**héberger les sorties HTML des jeux** de l'Atelier : un jeu peut être une partie du module.
- Le module s'**exporte en SCORM vers le LMS** du client ; le SCORM se **met à jour depuis Rise**, y compris s'il est déjà hébergé dans le LMS.
- Le **suivi** est tenu au niveau du **module**.
- `[à compléter]` Blocs disponibles dans la version des clients (scénario, tri, chronologie, quiz, vidéo…).
- `[à compléter]` Ce qui déclenche l'état « complété » d'un module.
- `[à compléter]` Limites de poids et de taille des fichiers intégrés.

## 3. Formats hors outil

| Format | Quand l'envisager | Quand l'éviter | Effort de production | Mesure possible |
|---|---|---|---|---|
| **Vidéo courte** (2 à 5 min) | Montrer un geste, un témoignage, sensibiliser | Contenu qui change souvent ; savoir-faire à pratiquer | Moyen | Visionnage, quiz après |
| **Aide-mémoire** (fiche, page) | Procédure à consulter au moment de faire ; information qui change | Besoin de pratique | Faible | Usage, erreurs constatées |
| **Séminaire, classe virtuelle** | Sensibiliser, créer de l'adhésion, présenter un changement | Mémorisation de détails ; grand nombre de sites | Moyen | Présence, évaluation à chaud |
| **Atelier de pratique** | S'entraîner à une situation, échanger entre pairs | Très grand nombre de personnes ; peu de temps | Moyen à élevé | Observation, mise en situation |
| **Hackathon** | Résoudre un problème réel en équipe, innover | Apprendre une base ; public débutant | Élevé | Livrables produits |
| **Accompagnement terrain** (compagnonnage, tutorat) | Savoir-faire tacite, gestes, culture d'équipe | Grand nombre d'apprenants à former vite | Élevé (temps des experts) | Observation, grille de compétences |
| **Retour d'expérience entre pairs** | Capitaliser sur des cas vécus | Absence de culture de partage | Faible à moyen | Cas documentés |
| **Module en ligne** (Rise) | Contenu structuré, large audience, preuve de complétion | Compétence à pratiquer en situation | Moyen | Progression, évaluation intégrée |
| **Jeu de rôle** | Communication, posture, entretien | Public réticent sans animateur formé | Moyen | Observation avec grille |
