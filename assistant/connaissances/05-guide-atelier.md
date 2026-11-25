# Guide d'utilisation de l'Atelier de jeux

Version 0.2 · 2026-11-26 · **À consulter quand la personne demande comment créer un jeu, importer un fichier, régler une option ou publier.** Les capacités de l'Atelier sont décrites dans [FORM-1], [FORM-2] et [FORM-5]. Les éléments `[à compléter]` ne sont pas confirmés.

## [ATEL-1] À quoi sert l'Atelier
Un outil interne qui crée des jeux de connaissances en HTML. L'auteur saisit ou importe son contenu, règle l'habillage, joue l'aperçu, puis exporte **un fichier HTML autonome**. Adresse de l'Atelier : `[à compléter]`.

## [ATEL-2] Créer un jeu en 8 étapes
1. **Ouvrir l'Atelier.** En haut, choisir le **Type de jeu** : Quiz à paliers ou Champion solo.
2. **Identité visuelle** (premier onglet) : titre, phrase d'accroche, message de fin ; couleurs (palettes prêtes ou codes hexadécimaux, et palettes de marque enregistrables) ; police ; logo (2 Mo au maximum).
3. **Questions** (deuxième onglet) : saisir les questions une par une, ou importer un fichier Excel ([ATEL-3]). Un panneau « Contrôle qualité » et des pastilles orange signalent des conseils sur la forme : info clé manquante, négation dans l'énoncé, réponses identiques, bonne réponse nettement plus longue, thème trop petit… Ce sont des conseils, ils ne bloquent pas l'export.
4. **Règles** (troisième onglet) : les règles du jeu choisi ([ATEL-4]).
5. **Sons** (quatrième onglet) : activer ou non les sons, régler le volume, remplacer un son par un autre fichier. **Scores** (cinquième onglet) : activer le tableau des scores si le jeu est hébergé sur SharePoint ([ATEL-5]).
6. **Aperçu** : à droite de l'écran ; c'est le vrai jeu, on peut y jouer. Le menu « Afficher » saute à un écran précis.
7. **Enregistrer l'édition** : télécharge un fichier `.json` qui permet de **reprendre le travail** plus tard. **À conserver : le fichier HTML exporté ne se modifie pas dans l'Atelier.**
8. **Exporter le jeu (.html)** : télécharge le jeu autonome, prêt à publier ([ATEL-6]).

## [ATEL-3] Importer le contenu depuis Excel
1. Dans l'onglet Questions : **Télécharger le modèle Excel**. Le modèle contient trois feuilles : « Questions », « Trouve avant la fin » (pour le Champion solo) et « Mode d'emploi ».
2. Remplir les feuilles. Les colonnes attendues sont décrites dans [JEU-6]. Supprimer les lignes d'exemple.
3. **Importer un fichier** : choisir le fichier `.xlsx` ou `.csv`. Pour un CSV, le séparateur peut être une virgule, un point-virgule ou une tabulation.
4. L'Atelier affiche un bilan : nombre de questions et de concepts lus, et la liste des lignes ignorées avec la raison (« ligne 7 : pas de bonne réponse »).
5. Choisir **Remplacer le contenu actuel** ou **Ajouter à la suite**.

Un tableau fourni par l'assistant se copie dans la feuille du modèle, en gardant les noms de colonnes de la première ligne.

## [ATEL-4] Régler les règles

**Quiz à paliers**
- Gain maximal, unité (points, euros, étoiles…), progression (accélérée ou régulière).
- Paliers de sécurité : aucun, ou tous les 2, 3 ou 5 paliers.
- Une mauvaise réponse : fait redescendre d'un palier (recommandé), ramène au dernier palier de sécurité, ne fait rien perdre, ou termine la partie.
- Jokers : 50/50, indice, passer (0 à 3 de chaque).
- Temps par question : sans limite ou de 15 à 90 secondes.
- Mélanger l'ordre des réponses à chaque partie.

**Champion solo**
- Manches de la partie : cocher Sprint, La série, Trouve avant la fin.
- Sprint : points à atteindre (9 par défaut), questions au maximum, temps par question (sans limite par défaut).
- La série : bonnes réponses d'affilée (4 par défaut), questions au maximum.
- Trouve avant la fin : concepts par partie (3 par défaut), pénalité pour une mauvaise réponse (1 point par défaut ; à garder à 1 au moins, sinon tenter dès le premier indice est toujours le plus rentable).
- Reposer plus tard une question ratée.

## [ATEL-5] Sons, tableau des scores, habillage
- **Sons** : facultatifs. Le joueur est prévenu avant de commencer et choisit « avec » ou « sans » ; un bouton « Son » permet de couper à tout moment.
- **Musique d'ambiance** (onglet Sons) : une piste facultative jouée en boucle, à faible volume. Le joueur la coupe avec le bouton « Musique », indépendamment des effets. Pendant un effet (bonne réponse, suspense…), elle s'efface en douceur puis revient. Réglages : volume de la musique et niveau d'atténuation pendant les effets. Une musique d'exemple libre de droits est proposée ; une autre se charge comme n'importe quel son (2 Mo au maximum).
- **Tableau des scores** (onglet Scores) : **option, désactivée par défaut.** Réglages : mode de nom (3 initiales, pseudo généré, pseudo libre filtré), nombre de scores gardés (5, 10 ou 20), mots interdits en plus. Les scores restent dans le navigateur du joueur et ne sont pas partagés. **Ils ne sont conservés que si l'hébergement autorise le stockage du navigateur** : sur SharePoint (page HTML ou dossier), la page est affichée dans un cadre isolé qui le bloque : les scores disparaissent à l'actualisation et ne durent que le temps de la visite. Les records et la maîtrise par thème du Champion solo sont concernés de la même façon. Le jeu affiche un avertissement à l'accueil quand le stockage est bloqué. Inutile dans Rise ou le LMS.
- **Polices** : les polices Office ne s'affichent que si elles sont installées sur le poste du joueur ; sinon le jeu utilise une police proche.

## [ATEL-6] Exporter et publier
1. **Exporter le jeu (.html)** : un seul fichier, qui contient le jeu et ses sons.
2. **Sur SharePoint** : déposer le fichier HTML dans une bibliothèque ou une page HTML classique, accessible et modifiable directement dans SharePoint. Procédure détaillée : `[à compléter]`.
3. **Dans Rise** : Rise héberge les sorties HTML des jeux, à l'intérieur d'un module. Procédure détaillée : `[à compléter]`.
4. **Dans le LMS** : par l'export SCORM du module Rise ; le LMS suit la progression du module, pas le score du jeu ([FORM-3]).
5. **Mettre à jour un jeu** : ouvrir le fichier d'édition `.json` dans l'Atelier, modifier, ré-exporter, puis remplacer le fichier publié. Dans Rise, un jeu se remplace depuis Rise, même une fois le module publié dans le LMS.

## [ATEL-7] Problèmes fréquents
- **Des lignes sont ignorées à l'import** : lire la raison dans le bilan (bonne réponse illisible, énoncé manquant, moins de deux réponses…), corriger dans le fichier, ré-importer.
- **Le jeu exporté n'est plus modifiable** : normal, c'est une copie figée. Reprendre le fichier d'édition `.json`. Sans ce fichier, il faut ressaisir le contenu.
- **Les sons ne partent pas tout seuls** : normal, le navigateur exige un clic ; le jeu propose « Commencer avec le son ».
- **Les records ou le tableau des scores ont disparu** : ils sont gardés dans le navigateur du joueur. Causes : l'hébergement bloque le stockage (le jeu affiche alors « Les scores ne sont pas conservés ici »), ou le joueur a vidé son navigateur ou changé de poste. Si l'avertissement est affiché, essayer un autre mode d'hébergement ou renoncer au tableau des scores.
- **L'aperçu est vide** : ouvrir le bon fichier de l'Atelier ; `[à compléter : procédure de dépannage]`.
- **Qui est responsable ?** L'auteur du jeu : contenu, info clé, mise à jour.
