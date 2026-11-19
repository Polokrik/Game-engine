# Atelier de jeux pédagogiques

Éditeur de jeux de connaissances en HTML/JS pur, sans serveur ni compilation obligatoire.
Deux jeux : **Quiz à paliers** et **Champion solo** (Sprint, La série, Trouve avant la fin).

## Ce que fait l'outil
- Le formateur règle l'identité visuelle, saisit ou importe (Excel/CSV) ses questions, règle les règles et les sons.
- L'aperçu est le vrai jeu. « Exporter le jeu » produit **un fichier .html autonome** : à déposer sur SharePoint, Posit Connect, un bucket, ou à ouvrir en local.
- « Enregistrer l'édition » produit un `.json` qui permet de reprendre le travail.

## Organisation
| Chemin | Rôle |
|---|---|
| `atelier.src.html` | Modèle de l'atelier (éditeur, lecteur du quiz, styles). Sans audio. |
| `src/commun.js` | Briques partagées : thème visuel, création d'éléments, moteur de sons |
| `src/champion.js` | Lecteur du Champion solo et sa feuille de style |
| `sons/packs.json` | Correspondance événement, fichier audio. Les fichiers eux-mêmes ne sont pas versionnés (droits d'auteur) : sans eux, l'atelier fonctionne sans pack de sons par défaut |
| `construire.py` | Assemble le modèle, `src/` et `sons/` dans `dist/` |
| `dist/` | Fichiers générés, non versionnés |
| `tests/e2e-brouillons/` | Scripts de test de navigateur (Playwright) écrits pendant le développement, à nettoyer |

## Construire
```bash
python3 atelier/construire.py
```
Produit `dist/atelier-jeux.html` (page complète) et `dist/atelier-artefact.html` (fragment sans en-tête, tel que publié comme artefact Claude). `ffprobe` sert à lire la durée des sons, s'ils sont présents.

Après toute modification dans `src/`, `sons/` ou `atelier.src.html`, relancer la commande.

## À savoir
- Un jeu exporté recopie le code de son lecteur : il fonctionne sans l'atelier, mais ne se met pas à jour tout seul.
- Records et maîtrise par thème (Champion solo) sont gardés dans le navigateur du joueur.
- Le jeu envoie ses événements (début, réponse, fin) à une fonction `suivi()` vide : c'est le point d'accroche d'un futur export SCORM.
- L'import Excel charge SheetJS depuis cdnjs : sans accès à ce site, utiliser l'import CSV.
- Les tests de `tests/e2e-brouillons/` contiennent des chemins absolus de la session de développement : ils servent de base, pas de suite prête à lancer.
