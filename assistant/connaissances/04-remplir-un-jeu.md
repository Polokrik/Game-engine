# Remplir un jeu de l'Atelier avec le contenu du client

Version 0.2 · 2026-11-26 · **À consulter pour transformer un document en questions ou concepts, prêts à être importés dans l'Atelier.** Règles de pouce de l'équipe. Les caractéristiques des jeux sont dans [FORM-2] ; l'utilisation de l'Atelier dans [ATEL-1] à [ATEL-7].

## [JEU-1] Ce qu'il faut avant d'écrire
**À retenir : pas de document source, pas de questions.** Ne rédige rien avant d'avoir :
1. le **document source** (collé dans la conversation ou joint), avec son nom et sa date ou version ;
2. le **jeu visé** : Quiz à paliers ou Champion solo ;
3. le **nombre de questions** souhaité ;
4. pour le Champion solo : les **thèmes** ;
5. le **public** et son niveau de départ.

Si la personne n'a pas de document, ne devine pas le contenu : demande une source, même incomplète, ou propose d'écrire d'abord des notes que l'expert métier valide.

## [JEU-2] Extraire les notions
**À retenir : on écrit les notions d'abord, les questions ensuite, et la personne valide la liste.**
1. Lis le document par parties.
2. Note chaque notion en **une phrase** (« Un document confidentiel se stocke uniquement dans l'espace sécurisé »).
3. Garde ce qui compte le plus : ce dont l'oubli coûte cher, ce que l'on confond souvent, ce qu'il faut savoir sans chercher. Écarte le contexte et les détails rares.
4. Vise **au plus 15 notions** pour un jeu de 10 à 20 questions : une ou deux questions par notion.
5. Présente la liste et demande : « Voici les notions retenues. Ajoutez, retirez ou corrigez avant que j'écrive les questions. »

## [JEU-3] Écrire une question à choix
**À retenir : une question teste une seule notion, avec des fausses réponses qui ressemblent à de vraies erreurs.**
- L'**énoncé** est une question complète, qui se comprend sans lire les réponses. Évite les négations (« laquelle n'est pas… »).
- **4 réponses** (2 au minimum) dont **une seule** est juste.
- Les **fausses réponses** reprennent des erreurs réelles ou des confusions fréquentes, de même longueur et de même forme que la bonne.
- Pas de « toutes les réponses » ni de « aucune de ces réponses ».
- La bonne réponse **n'est pas toujours la plus longue**, et sa lettre varie d'une question à l'autre.
- L'**info clé** tient en 1 ou 2 phrases : **pourquoi** la réponse est juste et la règle à retenir. Elle s'affiche après chaque réponse, juste ou fausse.
- L'**indice** (Quiz à paliers seulement) aide sans donner la réponse.
- La **source** est une courte référence visible par les joueurs : nom du document et section (« Politique de classification v2, §3.1 »). Ce n'est pas un passage recopié.
- Le **thème** est un mot ou deux (« Classification »).

## [JEU-4] Volume et difficulté selon le jeu

**Quiz à paliers**
- 10 à 20 questions.
- **L'ordre compte** : les questions sont posées dans l'ordre du fichier. Mets les plus simples d'abord, les plus difficiles à la fin.
- Colonne `niveau` : facultative, non utilisée.

**Champion solo**
- 24 à 40 questions au total, réparties en **thèmes de 8 questions au moins** : la série demande 4 bonnes réponses d'affilée, et un thème trop petit répète les questions.
- Colonne `niveau` : 1, 2 ou 3, soit le nombre de points. Répartition de pouce : environ la moitié en niveau 1, un tiers en niveau 2, le reste en niveau 3.
- « Trouve avant la fin » : **5 concepts ou plus**, pour que les parties varient (3 par partie par défaut).

## [JEU-5] Écrire un concept « Trouve avant la fin »
**À retenir : un concept, quatre indices qui se précisent, une réponse unique.**
- Le **concept** est une notion que l'on peut désigner par un nom : une règle, un outil, une étape, un terme.
- **Indice 1** : le plus difficile. Il situe le contexte sans permettre de conclure ; plusieurs concepts pourraient correspondre. **Indice 4** : le plus facile, presque décisif. Chaque indice rapproche de la réponse (4, 3, 2 puis 1 point).
- Aucun indice ne contient le nom du concept ni un synonyme évident.
- Chaque indice est **vrai** pour le concept, et seul l'ensemble des indices le désigne.
- **2 à 3 fausses propositions**, plausibles, de même nature que la bonne réponse. Elles s'affichent avec la bonne quand le joueur appuie sur « JE SAIS ! ».
- Une **info clé** qui explique le concept ; une **source** courte ; un **thème**.

## [JEU-6] Le tableau à fournir
**À retenir : donne les noms de colonnes exactement comme ci-dessous, en minuscules avec des tirets bas. L'import les reconnaît à leur nom.**

**Tableau 1 : questions** (feuille « Questions »)

| question | reponse_A | reponse_B | reponse_C | reponse_D | bonne | indice | info_cle | niveau | source | theme |
|---|---|---|---|---|---|---|---|---|---|---|
| Énoncé complet ? | Réponse | Réponse | Réponse | Réponse | B | Aide (Quiz) | 1 ou 2 phrases | 1 | Document, §x | Thème |

- `reponse_C` et `reponse_D` peuvent rester vides.
- `bonne` : la lettre A, B, C ou D.
- `indice` : seulement pour le Quiz à paliers, sinon vide.
- `niveau` : 1, 2 ou 3 pour le Champion solo, sinon vide.
- `theme` : pour le Champion solo ; recommandé aussi pour le Quiz.

**Tableau 2 : concepts** (feuille « Trouve avant la fin »)

| theme | indice_1 | indice_2 | indice_3 | indice_4 | reponse | faux_1 | faux_2 | faux_3 | info_cle | source |
|---|---|---|---|---|---|---|---|---|---|---|
| Thème | Le plus difficile | … | … | Le plus facile | Le concept | Fausse | Fausse | Fausse | 1 ou 2 phrases | Document, §x |

**Comment livrer**
1. Fournis **un tableau par message, 10 lignes au plus**, puis demande : « Je continue avec les 10 suivantes ? »
2. Après chaque tableau, ajoute un **tableau de vérification** : numéro de la ligne et **passage exact du document** qui justifie la bonne réponse (copié mot pour mot, avec sa localisation). Ce tableau sert à la relecture : il ne s'importe pas.
3. Marque `à confirmer` dans `info_cle` toute information que le document ne dit pas clairement.
4. Termine par : « Ce sont des brouillons : l'expert métier doit les valider avant publication. »
5. Indique comment importer : [ATEL-3].

## [JEU-7] Checklist qualité avant d'envoyer
- [ ] Une seule notion par question.
- [ ] L'énoncé se comprend sans lire les réponses ; pas de négation.
- [ ] Les fausses réponses sont plausibles et fondées sur de vraies erreurs.
- [ ] Les réponses ont à peu près la même longueur ; la bonne n'est pas toujours la plus longue.
- [ ] Les lettres des bonnes réponses sont réparties.
- [ ] Pas de « toutes » ni de « aucune de ces réponses ».
- [ ] L'info clé explique pourquoi, en 1 ou 2 phrases.
- [ ] Chaque ligne a sa référence source et son passage dans le tableau de vérification.
- [ ] Les noms de colonnes sont exacts.
- [ ] Les thèmes ont 8 questions au moins (Champion solo).
- [ ] Rien n'est inventé : ce qui n'est pas dans le document est marqué « à confirmer ».

## [JEU-8] Cas particuliers
- **Document trop long** : traite-le section par section et demande quelles sections sont prioritaires.
- **Document ancien** : demande la date et la version, et préviens que le jeu sera faux si la règle a changé.
- **Contradiction dans le document** : ne choisis pas ; signale les deux passages et demande à l'expert métier.
- **Chiffres, délais, seuils réglementaires** : recopie-les exactement et ajoute `à confirmer`.
- **Jargon** : explique le terme dans l'info clé.
- **Données personnelles** : ne les reprends pas dans les questions.
- **Demande d'une question ouverte, d'une image, d'un tri ou d'un ordre à reconstituer** : ces formats n'existent pas encore ([FORM-5]). Propose une question à choix équivalente.
