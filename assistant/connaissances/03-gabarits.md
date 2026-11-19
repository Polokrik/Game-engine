# Gabarits de sortie

Version 0.1 · 2026-11-19. L'assistant utilise ces trames telles quelles. Remplir toutes les rubriques ; écrire « à confirmer » quand l'information manque.

## A. Brief de besoin

| Rubrique | Contenu |
|---|---|
| Comportement attendu après la formation | |
| Situation de travail | |
| Constat actuel (erreurs, incidents) | |
| Cause probable : manque de savoir, ou autre ? | |
| Public (effectif, métiers, niveau) | |
| Temps disponible | |
| Contraintes (délai, budget, preuve de complétion) | |
| Documents source et validation | |
| Mesure du résultat | |

## B. Comparatif de formats (toujours 2 ou 3 options)

| | Option 1 : … | Option 2 : … | Option 3 : … |
|---|---|---|---|
| À quoi il sert ici | | | |
| Avantages | | | |
| Limites | | | |
| Effort de production | | | |
| Comment mesurer | | | |

**Recommandation** : option … **Pourquoi** : … **Ce qui me manque pour trancher** : …

## C. Plan de module

| Rubrique | Contenu |
|---|---|
| Titre et durée | |
| Objectifs (verbe d'action observable : « identifier », « choisir », « appliquer »…) | |
| Prérequis | |
| Séquence : 1) accroche, 2) contenu essentiel, 3) mise en pratique, 4) évaluation, 5) rappel | |
| Activités et format de chacune | |
| Évaluation : comment vérifier que l'objectif est atteint | |
| Rappels : J+2, J+7, J+30 (sous quelle forme) | |
| Points à valider par l'expert métier | |

## D. Import Excel pour l'Atelier de jeux

**Feuille « Questions »** : une ligne par question, première ligne = en-têtes.

| Colonne | Contenu | Obligatoire |
|---|---|---|
| `question` | Énoncé | oui |
| `reponse_A` à `reponse_D` | Réponses proposées (2 minimum, C et D peuvent rester vides) | A et B |
| `bonne` | Lettre de la bonne réponse : A, B, C ou D | oui |
| `indice` | Aide donnée par le joker Indice (Quiz à paliers) | non |
| `info_cle` | 1 ou 2 phrases : ce qu'il faut retenir | recommandé |
| `niveau` | 1, 2 ou 3 : nombre de points dans le Champion solo | non |
| `source` | Passage du document source | recommandé |
| `theme` | Thème de la question (au moins 8 questions par thème) | pour le Champion solo |

**Feuille « Trouve avant la fin »** : un concept par ligne.

| Colonne | Contenu |
|---|---|
| `theme` | Thème |
| `indice_1` à `indice_4` | 4 indices, du plus difficile au plus facile |
| `reponse` | Le concept à trouver |
| `faux_1` à `faux_3` | Fausses propositions (2 minimum) |
| `info_cle` | Ce qu'il faut retenir |
| `source` | Passage du document source |

Pour l'assistant, présenter les lignes sous forme de **tableau**, une ligne par question, que la personne copie dans Excel.

## E. Contrôle de qualité d'une question

- [ ] Elle teste **une seule notion**.
- [ ] L'énoncé se comprend sans lire les réponses.
- [ ] Les fausses réponses sont plausibles et fondées sur de vraies erreurs.
- [ ] Les réponses ont à peu près la même longueur ; la bonne n'est pas la plus longue par habitude.
- [ ] Pas de « toutes les réponses » ni de « aucune de ces réponses ».
- [ ] L'info clé explique **pourquoi**, pas seulement quoi.
- [ ] La source est citée ; ce qui n'est pas dans le document est marqué « à confirmer ».
- [ ] Elle sera encore vraie dans 6 mois (sinon, noter la date de revue).
