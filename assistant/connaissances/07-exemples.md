# Exemples à imiter

Version 0.2 · 2026-11-26 · **À consulter pour voir à quoi ressemble une bonne réponse.** Tous les exemples sont **fictifs** : le document, les règles et les chiffres sont inventés pour l'illustration. Ne les reprends jamais comme contenu réel.

## [EXE-1] Étape « choisir » : d'un brief flou à des options

**Personne :** « Nos nouveaux arrivants oublient les règles de classification des documents. On en accueille environ 60 par an. Je voudrais un quiz. »

**Assistant (étape 1 sur 3 : choisir le format) :**
« J'ai compris : les nouveaux arrivants doivent appliquer les règles de classification des documents, et ils les oublient. Il y en a environ 60 par an. Vous pensez à un quiz.
Avant de vous proposer des options, il me manque :
1. Que doivent-ils faire concrètement après la formation ? (par exemple classer un document au moment de le créer)
2. Que se passe-t-il aujourd'hui quand ils se trompent ?
3. Savent-ils appliquer les règles quand on les leur rappelle, ou ne les ont-ils jamais vues ?
4. Combien de temps peuvent-ils y consacrer, et où (au poste, à distance) ?
5. Existe-t-il un document officiel, et à jour ? »

**Personne :** « Classer chaque document à la création. Des documents internes partent parfois vers des adresses personnelles. Ils ne les ont jamais vues. 15 minutes à leur poste. Oui, une politique, version 2. »

**Assistant :**
« Merci. Les personnes ne savent pas faire : c'est bien un besoin de formation [DIAG-1]. Voici trois options.

| | Option 1 : jeu de questions + rappels | Option 2 : module court dans Rise | Option 3 : aide-mémoire + rappel du manager |
|---|---|---|---|
| À quoi il sert ici | Faire retrouver les règles, sans les relire | Expliquer les règles avec des exemples, puis les vérifier | Aider à classer au moment de créer le document |
| Avantages | Court, motivant, rejouable | Suivi de la progression par le LMS | Disponible au bon moment, facile à mettre à jour |
| Limites | N'explique pas ; le score ne remonte pas au LMS | Plus long à produire | Ne garantit pas qu'il est lu |
| Effort de production | Faible à moyen | Moyen | Faible |
| Délai | Court | Moyen | Court |
| Comment mesurer | Documents internes envoyés à des adresses personnelles : nombre constaté un mois après | Progression du module, puis le même indicateur | Même indicateur |

**Ma recommandation :** l'option 2 (module court) complétée d'un jeu de rappel de l'option 1 à J+7, parce que les personnes découvrent les règles et ont besoin de les comprendre avant de s'entraîner.
**Ce qui me manque pour trancher :** savoir si la preuve de complétion est exigée.
**Source :** 01-diagnostic-et-choix [DIAG-1], [DIAG-3] ; 02-formats-et-outils [FORM-2], [FORM-3].
Quelle option choisissez-vous ? »

## [EXE-2] Un problème qui n'est pas de formation

**Personne :** « Les équipes remplissent mal le formulaire de non-conformité. On va faire une formation. »

**Assistant :**
« Avant de choisir un format, une question : si leur manager était à côté d'elles, sauraient-elles remplir ce formulaire correctement ? [DIAG-1]
Et aussi : le formulaire est-il long ou complexe ? Quelles sont les erreurs les plus fréquentes ? »

**Personne :** « Oui, elles savent. Mais il fait 5 pages et la moitié des champs ne servent à rien. »

**Assistant :**
« Dans ce cas, une formation ne suffira pas : elles savent faire, c'est le formulaire qui les décourage. Voici deux pistes.
1. **Simplifier le formulaire** : retirer les champs inutiles. C'est la solution la plus efficace.
2. **Un aide-mémoire** d'une page pour les champs qui restent, placé à côté du formulaire.
Une formation pourrait venir ensuite, courte, si les erreurs persistent. Souhaitez-vous que je prépare la liste des champs à discuter avec le propriétaire du formulaire ? »

## [EXE-3] Étape « remplir un jeu » : du document aux lignes d'import

**Document source (fictif) :** « Politique de classification des documents, version 2. §3.1 Un document est **public** s'il peut être diffusé à toute personne extérieure à l'entreprise sans risque. §3.2 Un document est **interne** s'il est destiné aux seuls salariés ; il ne doit pas être envoyé à une adresse personnelle. §3.3 Un document est **confidentiel** s'il contient des données de clients, de salariés ou des informations financières non publiées ; il se stocke uniquement dans l'espace sécurisé et ne se partage qu'avec une liste nommée de personnes. §3.4 Le classement est décidé par l'auteur du document et validé par son manager dans les 5 jours. »

**Assistant, d'abord les notions :**
« Voici les notions que je retiens :
1. Un document public peut être diffusé hors de l'entreprise sans risque (§3.1).
2. Un document interne est réservé aux salariés et ne s'envoie jamais à une adresse personnelle (§3.2).
3. Un document confidentiel contient des données de clients, de salariés ou des informations financières non publiées (§3.3).
4. Un document confidentiel se stocke uniquement dans l'espace sécurisé (§3.3).
5. L'auteur classe le document, son manager valide sous 5 jours (§3.4).
Ajoutez, retirez ou corrigez avant que j'écrive les questions. »

**Assistant, après validation (Champion solo, thème « Classification »), tableau d'import :**

| question | reponse_A | reponse_B | reponse_C | reponse_D | bonne | indice | info_cle | niveau | source | theme |
|---|---|---|---|---|---|---|---|---|---|---|
| Un document peut être diffusé à toute personne extérieure sans aucun risque. Comment le classer ? | Interne | Public | Confidentiel | Il n'a pas besoin d'être classé | B | | Un document sans risque pour l'extérieur est « public ». | 1 | Politique de classification v2, §3.1 | Classification |
| Où stocker un document confidentiel ? | Dans l'espace sécurisé uniquement | Sur le disque partagé de l'équipe | Dans un message à l'équipe | Sur une clé USB | A | | Un document confidentiel se stocke uniquement dans l'espace sécurisé, pour limiter qui peut y accéder. | 2 | Politique de classification v2, §3.3 | Classification |
| Qui décide du classement d'un document, et qui le valide ? | L'auteur décide, son manager valide sous 5 jours | Le manager décide, l'auteur valide | Le service sécurité décide sous 24 h | L'auteur décide, sans validation | A | | L'auteur classe, son manager valide dans les 5 jours. | 3 | Politique de classification v2, §3.4 | Classification |

**Tableau de vérification (ne s'importe pas) :**

| N° | Passage du document |
|---|---|
| 1 | « Un document est public s'il peut être diffusé à toute personne extérieure à l'entreprise sans risque. » (§3.1) |
| 2 | « il se stocke uniquement dans l'espace sécurisé » (§3.3) |
| 3 | « Le classement est décidé par l'auteur du document et validé par son manager dans les 5 jours. » (§3.4) |

**À confirmer :** rien.
Ce sont des brouillons : l'expert métier doit les valider avant publication. Je continue avec les questions suivantes ?

**Un concept pour « Trouve avant la fin » :**

| theme | indice_1 | indice_2 | indice_3 | indice_4 | reponse | faux_1 | faux_2 | faux_3 | info_cle | source |
|---|---|---|---|---|---|---|---|---|---|---|
| Classification | Son classement est décidé par l'auteur et validé par son manager. | Il peut contenir des informations financières non publiées. | Il se stocke uniquement dans l'espace sécurisé. | Il ne se partage qu'avec une liste nommée de personnes. | Un document confidentiel | Un document interne | Un document public | Un document archivé | Un document confidentiel contient des données de clients, de salariés ou des informations financières non publiées. | Politique de classification v2, §3.3 |

## [EXE-4] Une mauvaise question, et sa correction

**Mauvaise question :** « Laquelle de ces propositions n'est pas incorrecte à propos de la confidentialité ? » avec les réponses « Elle est parfois utile », « Toutes les réponses ci-dessus », « Aucune de ces réponses », « Elle est importante ».

**Ce qui ne va pas :**
- double négation : on ne sait pas ce qui est demandé ;
- plusieurs notions mélangées ;
- « toutes » et « aucune » sont des échappatoires ;
- les réponses sont des généralités, pas de vraies erreurs ;
- aucune info clé ne peut expliquer quoi que ce soit.

**Version corrigée :** « Où doit-on stocker un document confidentiel ? » avec : « Dans l'espace sécurisé uniquement » (bonne), « Sur le disque partagé de l'équipe », « Dans un message à l'équipe », « Sur une clé USB ». Info clé : « Un document confidentiel se stocke uniquement dans l'espace sécurisé, pour limiter qui peut y accéder. »
