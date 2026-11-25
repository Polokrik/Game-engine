# Assistant IA « ingénieur pédagogique »

Documentation de l'assistant qui aide les experts métier à choisir un format de formation, à le construire, puis à remplir un jeu de l'Atelier. Cadrage complet : [`docs/PROJET.md`](../docs/PROJET.md), section 6.

Version 0.1 · 2026-11-19 · première version, **non encore testée** sur les outils des clients.

## Contenu

| Fichier | Rôle | Où le mettre |
|---|---|---|
| [`prompt-systeme.md`](prompt-systeme.md) | Les instructions de l'assistant (court, pour des modèles moins puissants) | Dans les **instructions** de l'assistant |
| [`connaissances/01-grille-de-decision.md`](connaissances/01-grille-de-decision.md) | Questions à poser et orientation selon le besoin | Dans la **base de connaissances** |
| [`connaissances/02-formats-et-outils.md`](connaissances/02-formats-et-outils.md) | Formats, Atelier de jeux, Rise : ce qui existe, ce qui ne remonte pas | Dans la base de connaissances |
| [`connaissances/03-gabarits.md`](connaissances/03-gabarits.md) | Trames de sortie : brief, comparatif, plan de module, import Excel | Dans la base de connaissances |
| [`evaluation/jeu-evaluation.md`](evaluation/jeu-evaluation.md) | Méthode et grille de test | **Nulle part** : à garder hors de l'assistant |

## Principes
- **Toujours 2 ou 3 formats**, avec avantages et limites, puis une recommandation motivée.
- **Poser des questions avant de recommander** ; vérifier d'abord qu'il s'agit bien d'un besoin de formation.
- **Ne rien affirmer au-delà de la fiche des formats et outils** : une capacité non écrite n'existe pas.
- **Aucun contenu métier inventé** : chaque question cite son passage source, un humain valide.
- Conçu pour des modèles moins puissants que les IA grand public : instructions courtes, étapes numérotées, gabarits de sortie, connaissance dans des fichiers séparés.

## Mise en place dans l'outil du client
1. Copier le texte du prompt système (sous la ligne « DÉBUT ») dans les instructions.
2. Ajouter les trois fichiers de `connaissances/` comme sources de connaissance.
3. **Vérifier les limites de l'outil** (taille des instructions, nombre et taille des fichiers) : si le prompt dépasse la limite, déplacer des paragraphes vers les fichiers de connaissance, jamais l'inverse. Le prompt fait environ 2 700 caractères.
4. Passer le jeu d'évaluation, puis corriger.

## Tenir à jour
- Relire la fiche des formats et outils chaque trimestre, et à chaque changement d'outil ou de licence.
- Compléter les éléments `[à compléter]` avec l'équipe learning.
- Versionner : chaque fichier porte un numéro de version et une date ; refaire le jeu d'évaluation après toute modification.
