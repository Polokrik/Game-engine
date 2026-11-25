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

**En ligne : <https://polokrik.github.io/Game-engine/>** (source : GitHub Actions). Chaque modification de `atelier/` sur `main` republie la page.

> **La page est publique, et le dépôt aussi** : les fichiers du dépôt, y compris les sons, sont téléchargeables par tout le monde.
>
> **Par défaut, la page est publiée avec les sons** (décision du 2026-11-25). Ce sont des extraits d'émissions de télévision. Pour publier sans sons : *Settings > Secrets and variables > Actions > Variables*, créer `PUBLIER_SONS` avec la valeur `false`.
>
> Cette page est l'outil, avec un contenu d'exemple. Les jeux créés avec l'atelier se déposent sur SharePoint ou dans Rise, pas sur Pages.
