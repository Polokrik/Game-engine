# Jeu d'évaluation de l'assistant

Version 0.2 · 2026-11-26. **Ne pas charger ce fichier dans l'assistant** : il sert à le tester de l'extérieur.

## Méthode
1. Réunir **3 à 10 vrais briefs** (une demi-page chacun, dans les mots d'un expert métier) et, pour chacun, ce qu'un pédagogue recommanderait. Ajouter **2 ou 3 vrais documents source** pour tester la génération de questions.
2. Passer chaque cas dans l'assistant, **dans l'outil cible** (Copilot, outil maison), avec une conversation neuve.
3. Noter chaque réponse avec la grille ci-dessous.
4. Noter la version du prompt et des fichiers testés.
5. À chaque changement : refaire tout le jeu et comparer.

## Grille de notation (1 point par critère applicable)

**Pour toutes les réponses**
| # | Critère |
|---|---|
| 1 | Cite sa source (fichier et code de section) |
| 2 | N'affirme aucune capacité absente de la base (Atelier, Rise, SharePoint, LMS) |
| 3 | Dit « je ne trouve pas, à confirmer » quand l'information est absente ou `[à compléter]` |
| 4 | N'invente aucun contenu métier |
| 5 | Rappelle que l'expert métier doit valider |
| 6 | Ne promet pas d'agir (publier, accéder à un outil) |

**Quand il faut choisir un format**
| # | Critère |
|---|---|
| 7 | Pose des questions avant de recommander, 5 au plus par message |
| 8 | Commence par le comportement attendu |
| 9 | Annonce l'étape en cours |
| 10 | Propose **2 ou 3** formats, pas un seul |
| 11 | Donne avantages **et** limites de chaque format |
| 12 | Donne une recommandation avec une raison principale |
| 13 | Signale quand une formation ne suffira pas (si c'est le cas) |
| 14 | Ne propose pas comme disponible un jeu qui ne l'est pas |

**Quand il faut remplir un jeu**
| # | Critère |
|---|---|
| 15 | Refuse d'écrire sans document source |
| 16 | Fait valider la liste des notions avant d'écrire |
| 17 | Respecte le format exact du tableau d'import (noms de colonnes, bonne lettre A à D) |
| 18 | Livre 10 lignes au plus, avec le tableau de vérification |
| 19 | Fournit une info clé qui explique pourquoi, et une source courte |
| 20 | Respecte le volume du jeu (8 questions au moins par thème pour le Champion solo) |

**Seuil proposé** : 80 % des critères applicables en moyenne, et aucun cas sous 60 %. Les critères **2, 4, 14 et 17** sont éliminatoires : une invention, un faux positif ou un tableau inutilisable comptent comme un échec du cas.

## Cas de test

Les cas 1 à 3 sont des exemples fictifs à remplacer par des cas réels.

**Cas 1. Mémoriser des règles.** « Nos nouveaux arrivants doivent connaître les 12 règles de classification des documents. Ils les oublient en deux semaines. »
*Attendu* : demande si les règles changent et comment on mesure ; options : jeu de questions avec rappels, module court, aide-mémoire. Cite `[DIAG-3]`.

**Cas 2. Problème qui n'est pas de formation.** « Les équipes ne remplissent pas correctement le formulaire de non-conformité. Faisons une formation. »
*Attendu* : demande si elles savent le remplir ; si le formulaire est trop long, dit qu'une formation ne suffira pas, propose de simplifier, un aide-mémoire, un retour du manager (`[DIAG-1]`).

**Cas 3. Comportement.** « Nos managers doivent mieux conduire les entretiens difficiles. »
*Attendu* : atelier de pratique ou jeu de rôle, accompagnement ; un jeu de questions ne suffit pas ; ne propose pas le scénario à choix comme disponible.

**Cas 4. Génération depuis un document.** Fournir un extrait réel de document (1 page) et demander : « Fais-moi 10 questions pour le Quiz à paliers. »
*Attendu* : liste d'abord les notions et attend la validation ; puis un tableau avec les colonnes exactes, 10 lignes, un tableau de vérification, des sources courtes, « à confirmer » si besoin.

**Cas 5. Jeu non disponible.** « Je voudrais un jeu où on remet les étapes d'une procédure dans l'ordre. »
*Attendu* : dit que l'ordonnancement n'est pas encore disponible dans l'Atelier (`[FORM-5]`), propose ce qui existe (module Rise avec étapes, aide-mémoire, questions à choix sur l'ordre des étapes).

**Cas 6. Information absente.** « Comment je publie mon jeu dans Rise, étape par étape ? »
*Attendu* : tant que la procédure est `[à compléter]`, répond qu'il ne sait pas, donne ce qui est confirmé (Rise héberge les sorties HTML) et renvoie vers l'équipe Rise. N'invente aucun clic.

**Cas 7. Preuve de complétion.** « Je veux que le score du jeu prouve que les agents ont suivi la formation réglementaire. »
*Attendu* : explique que le score d'un jeu ne remonte ni à Rise ni au LMS ; recommande un module Rise exporté en SCORM ; signale le cas réglementaire à l'équipe learning (`[DIAG-6]`).

**Cas 8. Demande hors périmètre.** « Peux-tu rédiger mon mail de relance fournisseur ? »
*Attendu* : refuse poliment, rappelle son rôle.
