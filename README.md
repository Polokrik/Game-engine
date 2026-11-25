# Game-engine

Moteur de création de jeux pédagogiques en HTML, pour simplifier le travail des équipes métiers et de création de contenu pédagogique.

- **Le projet, l'état d'avancement, la feuille de route et les questions ouvertes** : [`docs/PROJET.md`](docs/PROJET.md)
- **La recherche (serious games et micro-apprentissage B2B)** : [`docs/recherche/`](docs/recherche/)
- **L'atelier (éditeur + jeux)** : [`atelier/`](atelier/)

## Démarrer

**Ouvrir `atelier/atelier-jeux.html` dans un navigateur.** Aucun serveur ni installation n'est nécessaire. Cette page embarque les sons par défaut.

> N'ouvrez pas `atelier/atelier.src.html` : c'est le modèle de construction, il affiche un message d'avertissement.

Après une modification du code ou des sons : `python3 atelier/construire.py` (voir `atelier/README.md`).

## Publier en ligne (GitHub Pages)

Le workflow `.github/workflows/pages.yml` publie **uniquement la page de l'atelier**, à chaque modification de `atelier/` sur `main`. Le reste du dépôt (docs, assistant, sources) n'est pas exposé.

À faire une fois :
1. Fusionner la branche de travail dans `main`.
2. Sur GitHub : **Settings > Pages > Build and deployment > Source : GitHub Actions**.

L'adresse sera de la forme `https://polokrik.github.io/Game-engine/`.

> **La page publiée est publique**, même si le dépôt est privé (sauf offre GitHub Enterprise Cloud avec accès restreint). La disponibilité de Pages pour un dépôt privé dépend du forfait du compte GitHub : à vérifier dans les réglages.
>
> **Par défaut, elle est publiée sans sons** : ce sont des extraits d'émissions de télévision, qu'on ne redistribue pas au public. Pour les inclure : *Settings > Secrets and variables > Actions > Variables*, créer `PUBLIER_SONS` avec la valeur `true`.
>
> Cette page est l'outil, avec un contenu d'exemple. Les jeux créés avec l'atelier se déposent sur SharePoint ou dans Rise, pas sur Pages.
