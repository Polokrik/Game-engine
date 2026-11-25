# Fiche des formats et outils

Version 0.2 · 2026-11-26 · **À consulter pour savoir ce que les outils font ou ne font pas.** Source : porteur du projet. À relire chaque trimestre. Les éléments `[à compléter]` ne sont pas confirmés : ne les affirme pas.

## [FORM-1] L'Atelier de jeux : vue d'ensemble
**À retenir : un outil interne qui transforme un contenu en jeu HTML, sans compétence technique.**

- L'auteur choisit un type de jeu, saisit ou importe son contenu (modèle Excel), règle l'habillage, joue l'aperçu, puis **exporte un fichier HTML autonome**.
- Ce fichier se dépose sur **SharePoint** ou dans **Rise**. Il fonctionne sans serveur.
- L'auteur peut enregistrer son travail dans un fichier d'édition `.json` pour le reprendre plus tard.
- Personnalisable : titre, couleurs (codes hexadécimaux, palettes de marque), police, logo, sons.
- Les auteurs sont **responsables de leurs jeux** : contenu, info clé, mise à jour.
- Adresse officielle de l'Atelier pour les équipes : `[à compléter]`.

## [FORM-2] Les deux jeux disponibles

**Quiz à paliers**
- Principe : questions à choix dans l'ordre donné, une échelle de gains qui monte à chaque bonne réponse, une info clé après chaque réponse.
- Sert à : retrouver et reconnaître des connaissances.
- Durée et volume : 5 à 10 minutes ; 10 à 20 questions.
- Réglages : paliers de sécurité, comportement en cas d'erreur (redescendre d'un palier, revenir au dernier palier de sécurité, rien perdre, ou terminer la partie), jokers (50/50, indice, passer), chrono par question, unité des gains.
- Fin de partie : fiche mémo qui reprend toutes les infos clés ; bouton pour rejouer.
- Contenu à fournir : questions à 2 à 4 réponses, la bonne réponse, une info clé, éventuellement un indice et un thème.

**Champion solo**
- Principe : une partie enchaîne jusqu'à trois manches.
  - *Sprint* : atteindre un nombre de points (9 par défaut) ; une bonne réponse rapporte 1, 2 ou 3 points selon le niveau de la question ; chrono par question facultatif.
  - *La série* : le joueur choisit un thème et doit enchaîner 4 bonnes réponses (réglable) ; une erreur remet la série à zéro ; une série réussie rapporte 5 points de bonus.
  - *Trouve avant la fin* : un concept à deviner avec 4 indices, du plus difficile au plus facile ; « JE SAIS ! » ouvre un choix de réponses ; répondre dès l'indice 1 rapporte 4 points, à l'indice 4 un seul ; une mauvaise réponse coûte 1 point (réglable).
- Les questions ratées sont reposées plus tard dans la partie.
- Le jeu garde, sur le poste du joueur : meilleur score, meilleure série, record du Sprint, maîtrise par thème et thèmes à retravailler.
- Durée et volume : 5 à 10 minutes ; 24 à 40 questions au total réparties en thèmes de 8 questions au moins, et 5 concepts ou plus pour « Trouve avant la fin ».
- Contenu à fournir : questions avec thème et niveau (1 à 3) ; concepts avec 4 indices, la réponse, 2 à 3 fausses propositions, une info clé.

**Points communs aux deux jeux**
- Sons facultatifs : le joueur est prévenu et choisit de jouer avec ou sans ; un bouton permet de les couper.
- Chrono facultatif.
- **Tableau des scores façon arcade : une option**, désactivée par défaut, à activer pour un jeu hébergé sur SharePoint. Le joueur entre 3 initiales ou un pseudo généré, selon le réglage ; un filtre refuse les insultes courantes. Les scores restent dans le navigateur du joueur : ils ne sont pas partagés entre les joueurs. Inutile dans Rise ou le LMS.

## [FORM-3] Rise, SharePoint et LMS : hébergement et suivi
**À retenir : le suivi des personnes est tenu par Rise au niveau du module, pas au niveau du jeu.**

- **Rise** (outil auteur du client)
  - Construit un **module de formation complet**.
  - **Héberge les sorties HTML des jeux** : un jeu peut être une partie du module.
  - Le module s'**exporte en SCORM** vers le LMS.
  - Le SCORM se **met à jour depuis Rise**, même une fois hébergé dans le LMS : un jeu hébergé dans Rise est donc modifiable après publication.
  - `[à compléter]` Blocs disponibles dans la version des clients (scénario, tri, chronologie, quiz, vidéo…).
  - `[à compléter]` Ce qui déclenche l'état « complété » d'un module.
  - `[à compléter]` Limites de poids et de taille des fichiers intégrés.
- **SharePoint** : peut héberger le fichier HTML d'un jeu, avec les dossiers SharePoint et les pages HTML classiques, accessibles et modifiables directement dans SharePoint.
- **LMS** : reçoit le module Rise en SCORM et suit sa progression.
- **Le score d'un jeu ne remonte ni à Rise ni au LMS.** Le suivi remonte la progression du module.

## [FORM-4] Formats hors outil

| Format | Quand l'envisager | Quand l'éviter | Effort de production | Mesure possible |
|---|---|---|---|---|
| **Vidéo courte** (2 à 5 min) | Montrer un geste, un témoignage, sensibiliser | Contenu qui change souvent ; savoir-faire à pratiquer | Moyen | Visionnage, quiz après |
| **Aide-mémoire** (fiche, page) | Procédure à consulter au moment de faire ; information qui change | Besoin de pratique | Faible | Usage, erreurs constatées |
| **Séminaire, classe virtuelle** | Sensibiliser, créer de l'adhésion, présenter un changement | Mémorisation de détails ; nombreux sites | Moyen | Présence, évaluation à chaud |
| **Atelier de pratique** | S'entraîner à une situation, échanger entre pairs | Très grand nombre de personnes ; peu de temps | Moyen à élevé | Observation, mise en situation |
| **Jeu de rôle** | Communication, posture, entretien | Public réticent sans animateur formé | Moyen | Observation avec grille |
| **Hackathon** | Résoudre un problème réel en équipe, innover | Apprendre une base ; public débutant | Élevé | Livrables produits |
| **Accompagnement terrain** | Savoir-faire tacite, gestes, culture d'équipe | Grand nombre d'apprenants à former vite | Élevé (temps des experts) | Observation, grille de compétences |
| **Retour d'expérience entre pairs** | Capitaliser sur des cas vécus | Absence de culture de partage | Faible à moyen | Cas documentés |
| **Module en ligne** (Rise) | Contenu structuré, large audience, preuve de complétion | Compétence à pratiquer en situation | Moyen | Progression suivie par le LMS |

Pour construire chacun de ces formats : [CONS-1] à [CONS-9].

## [FORM-5] Limites de l'Atelier et jeux à venir
**À retenir : ne propose jamais comme disponible ce qui figure dans cette section.**

Limites actuelles :
- Le score ne remonte pas au LMS.
- Pas de question à réponse libre, pas d'image dans les questions.
- Pas de classement partagé entre les joueurs.
- Interface en français uniquement.
- L'accessibilité n'est pas complète : parcours au clavier partiel, lecteurs d'écran non testés.
- Les polices Office ne s'affichent que si elles sont installées sur le poste du joueur.
- Un jeu exporté est une copie figée : pour le modifier, il faut le modifier dans l'Atelier (à partir du fichier d'édition `.json`), le ré-exporter et remplacer le fichier.

**Pas encore disponibles** (tu peux les mentionner comme « à venir », jamais comme utilisables) : tri de cartes, ordonnancement d'étapes, association, repérage d'erreurs sur image, scénario à choix, dialogue, enquête, escape game.
