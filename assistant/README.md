# Assistant IA « ingénieur pédagogique »

Documentation de l'assistant qui aide les experts métier à choisir un format de formation, à le construire, puis à remplir un jeu de l'Atelier. Cadrage complet : [`docs/PROJET.md`](../docs/PROJET.md), section 6.

Version 0.2 · 2026-11-26 · première version testée par des utilisateurs (retours positifs) ; **pas encore évaluée avec la grille** de `evaluation/`.

## Contenu

| Fichier | Rôle | Où le mettre |
|---|---|---|
| [`prompt-systeme.md`](prompt-systeme.md) | Les instructions de l'assistant (environ 5 500 caractères) | Dans les **instructions** de l'assistant |
| [`connaissances/00-index.md`](connaissances/00-index.md) | **Porte d'entrée** : dit quelle section consulter selon la question | Base de connaissances |
| [`connaissances/01-diagnostic-et-choix.md`](connaissances/01-diagnostic-et-choix.md) | Est-ce un besoin de formation ? Questions à poser, orientation, comparaison, mesure, passage à l'équipe learning | Base de connaissances |
| [`connaissances/02-formats-et-outils.md`](connaissances/02-formats-et-outils.md) | Ce que font et ne font pas l'Atelier, Rise, SharePoint, le LMS ; formats hors outil | Base de connaissances |
| [`connaissances/03-construire-par-format.md`](connaissances/03-construire-par-format.md) | Comment construire chaque format (module, jeu, vidéo, atelier, hackathon…) | Base de connaissances |
| [`connaissances/04-remplir-un-jeu.md`](connaissances/04-remplir-un-jeu.md) | Transformer un document en questions et concepts, tableau d'import exact | Base de connaissances |
| [`connaissances/05-guide-atelier.md`](connaissances/05-guide-atelier.md) | Utiliser l'Atelier : créer, importer, régler, publier | Base de connaissances |
| [`connaissances/06-gabarits.md`](connaissances/06-gabarits.md) | Trames de réponse : brief, comparatif, plan, phrases types | Base de connaissances |
| [`connaissances/07-exemples.md`](connaissances/07-exemples.md) | Réponses complètes à imiter (fictives) | Base de connaissances |
| [`a-completer.md`](a-completer.md) | **Liste de ce qu'il manque** : informations à fournir par l'équipe | **Nulle part** : liste de travail |
| [`evaluation/jeu-evaluation.md`](evaluation/jeu-evaluation.md) | Méthode, grille et cas de test | **Nulle part** : à garder hors de l'assistant |

## Comment l'assistant explore les fichiers
Le prompt lui impose une procédure : ouvrir d'abord `00-index`, repérer la ligne qui correspond à la question, consulter les sections indiquées (chacune a un code comme `[DIAG-1]`), reprendre tels quels les chiffres et règles, citer la source, et répondre « je ne trouve pas » plutôt que d'inventer. Les sections sont courtes, se comprennent seules et portent un titre explicite : c'est ce qui aide la recherche d'un outil qui découpe les fichiers en morceaux.

## Limites des outils (à vérifier sur chaque outil)
D'après la documentation de Microsoft (consultée le 2026-11-26) :
- **Instructions : 8 000 caractères au maximum.** Le prompt en fait environ 5 500. Des retours d'utilisateurs signalent qu'une limite interne peut se déclencher quand les instructions de plusieurs endroits s'additionnent : garder de la marge.
- **Fichiers de connaissance de Copilot Studio : Word, Excel, PowerPoint, PDF.** Le Markdown n'est pas dans la liste : **convertir les `.md` en `.docx`** (voir ci-dessous).
- Copilot Studio : jusqu'à 500 fichiers, 512 Mo par fichier. Agent Builder de Microsoft 365 Copilot : **20 fichiers au maximum**. Nous en avons 8.
- L'outil maison : `[à compléter]` (voir `a-completer.md`, n° 6).

## Mise en place
1. Générer les fichiers : `python3 assistant/construire-connaissances.py` (nécessite `pandoc`). Résultat dans `assistant/dist/` : le prompt en texte brut et les 8 fichiers `.docx`.
2. Coller le contenu de `dist/prompt-systeme.txt` dans les **instructions** de l'assistant.
3. Ajouter les 8 fichiers de `dist/connaissances/` comme **sources de connaissance**.
4. Vérifier que la limite d'instructions n'est pas atteinte.
5. Passer le jeu d'évaluation, puis corriger.

## Vérifier la cohérence
`python3 assistant/verifier.py` contrôle : la taille du prompt, que chaque code de section cité existe, que chaque fichier porte un numéro de version. À lancer après toute modification.

## Principes
- **Toujours 2 ou 3 formats**, avec avantages et limites, puis une recommandation motivée.
- **Poser des questions avant de recommander** ; vérifier d'abord qu'il s'agit bien d'un besoin de formation.
- **Ne rien affirmer au-delà de la base** : une capacité non écrite n'existe pas.
- **Aucun contenu métier inventé** : chaque ligne générée a son passage source, un humain valide.
- Conçu pour des modèles moins puissants que les IA grand public : instructions explicites, étapes numérotées, gabarits de sortie, exemples, connaissance dans des fichiers séparés.

## Tenir à jour
- Relire `02-formats-et-outils` chaque trimestre, et à chaque évolution de l'Atelier ou de Rise.
- Compléter les éléments `[à compléter]` avec les équipes (liste dans `a-completer.md`).
- Chaque fichier porte un numéro de version et une date ; refaire le jeu d'évaluation après toute modification.
