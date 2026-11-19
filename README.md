# Game-engine

Moteur de création de jeux pédagogiques en HTML, pour simplifier le travail des équipes métiers et de création de contenu pédagogique.

- **Le projet, l'état d'avancement, la feuille de route et les questions ouvertes** : [`docs/PROJET.md`](docs/PROJET.md)
- **La recherche (serious games et micro-apprentissage B2B)** : [`docs/recherche/`](docs/recherche/)
- **L'atelier (éditeur + jeux)** : [`atelier/`](atelier/)

## Démarrer

**Ouvrir `atelier/atelier-jeux.html` dans un navigateur.** Aucun serveur ni installation n'est nécessaire.

Cette version n'embarque pas de sons (droits d'auteur). Pour les avoir : déposer les fichiers audio dans `atelier/sons/` (noms listés dans `atelier/sons/packs.json`), puis lancer `python3 atelier/construire.py` et ouvrir `atelier/dist/atelier-jeux-avec-sons.html`.

> N'ouvrez pas `atelier/atelier.src.html` : c'est le modèle de construction, il affiche un message d'avertissement.
