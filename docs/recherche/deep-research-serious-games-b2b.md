# Bibliothèque de serious games et micro-apprentissages B2B : recherche, mécaniques, MVP et architecture produit

## Synthèse stratégique

Le point de départ est favorable : un moteur de quiz personnalisable répond déjà à un besoin réel de rappel actif, mais le potentiel du produit devient beaucoup plus intéressant dès lors qu’il cesse d’être un « générateur de quiz gamifiés » pour devenir un **moteur d’expériences d’apprentissage paramétrables**. La littérature sur la formation en entreprise et les serious games indique que l’efficacité ne vient pas du caractère ludique en soi : elle dépend surtout de l’alignement entre la mécanique, l’objectif pédagogique, la qualité du feedback, la répétition et la proximité avec les situations réelles de travail. Les revues récentes consacrées au monde professionnel constatent des bénéfices possibles sur l’engagement, la rétention, la motivation et l’acquisition de compétences, mais insistent aussi sur la forte dépendance au design et au contexte. citeturn880396search4turn530276search5

Le meilleur positionnement produit me semble donc être : **« transformer n’importe quel savoir d’entreprise en expérience interactive de 3 à 30 minutes »**, plutôt que « créer des jeux de formation ». Cette nuance est importante commercialement : elle ouvre les cas d’usage onboarding, sécurité, conformité, vente, produit, procédures, management, connaissance client, culture d’entreprise, transmission de savoir tacite et animation de séminaires.

La recherche sur la cognition justifie particulièrement quatre briques qui devraient devenir natives dans le moteur. La récupération active d’une information améliore sa rétention par rapport à sa simple relecture ; la répétition espacée améliore la mémorisation à long terme ; les bénéfices peuvent se combiner, y compris dans des données réelles de formation professionnelle ; et un feedback informatif produit en moyenne un effet positif sur l’apprentissage, même si la nature du feedback est déterminante. citeturn880396search0turn880396search1turn880396search2turn530276search0

Je recommande en conséquence de construire non pas 25 applications séparées, mais **un noyau commun + des mécaniques composables**. Beaucoup d’expériences différentes peuvent partager les mêmes composants : cartes, timers, zones de dépôt, scores, variables, embranchements, états, dialogues, feedback, médias, événements et analytics. H5P illustre déjà la pertinence de cette approche modulaire en proposant, dans un environnement HTML5, des types de contenus tels que scénarios à embranchements, vidéo interactive, glisser-déposer, flashcards, séquençage d’images et présentations interactives. citeturn990292search0turn990292search4

Pour un premier catalogue commercialisable, je privilégierais dix templates : **Tri express, Ordre critique, Association, Spot the Risk, Dialogue à choix, Dilemme, Enquête, Mission collaborative, Process Builder et Battle Cards**. Ils permettent de couvrir une large part des besoins B2B avec une base HTML/JS raisonnablement légère, alors qu’un simulateur 3D ou un jeu narratif complexe demande beaucoup plus de production. Cette priorité est une recommandation produit issue de la comparaison ci-dessous, et non un résultat scientifique.

## Principes pédagogiques à intégrer au moteur

### Du jeu à l’apprentissage

Un serious game utile doit demander à l’utilisateur de **faire quelque chose avec le savoir** : le retrouver, le reconnaître dans une situation, le classer, l’expliquer, choisir une action, anticiper une conséquence, comparer deux options ou résoudre un problème. La récupération active est particulièrement bien documentée : des revues concluent que retrouver activement une information est plus efficace pour la mémorisation que la réétudier passivement, et que la combinaison récupération répétée + espacement + feedback est particulièrement favorable. citeturn880396search0turn880396search1

Cela conduit à un principe produit simple : chaque template devrait déclarer un ou plusieurs **learning actions** indépendamment de son habillage visuel :

`retrieve → recognize → classify → order → diagnose → decide → explain → create → negotiate → apply`

Cette couche pédagogique doit rester séparée de la couche « jeu ». Une activité « classer les situations qui constituent une fuite de données » pourrait ainsi être présentée comme des cartes à déposer, une inspection de bureau, une enquête policière ou une mission spatiale sans changer l’objectif cognitif.

### Feedback et droit à l'erreur

Le moteur ne devrait pas limiter le feedback à « bonne/mauvaise réponse ». La méta-analyse de Wisniewski, Zierer et Hattie, portant sur 435 études et plus de 61 000 participants, observe un effet global positif du feedback mais une forte hétérogénéité ; l’information contenue dans le feedback est un modérateur important. citeturn530276search0

Je recommande donc quatre niveaux paramétrables :

**Résultat → Explication → Conséquence → Règle transférable.**

Exemple : « Mauvais choix » devient : « Vous avez envoyé le fichier à un compte personnel. Cela contourne les contrôles DLP. Dans cette entreprise, utilisez l’espace sécurisé X. Cette règle s’applique à tous les documents classifiés internes. »

### Répétition et mémorisation

Une étude sur 10 514 personnes suivant des formations professionnelles réelles a retrouvé l’effet d’espacement et montré que l’intervalle optimal dépend notamment de la durée pendant laquelle on souhaite conserver l’information. citeturn880396search2

Le moteur devrait donc pouvoir transformer automatiquement une expérience unique en parcours :

**J0 découverte → J2 rappel → J7 application → J21 scénario → J60 challenge de maîtrise.**

Le même contenu n’a pas besoin d’être répété sous la même forme. Une notion découverte dans une histoire peut réapparaître comme carte à classer, dialogue, erreur à détecter puis scénario métier.

### Scénarios et transfert

Pour des compétences professionnelles, la question intéressante n’est pas seulement « sait-il ? » mais « sait-il agir lorsque la situation se présente ? ». Une revue récente sur le transfert de formation souligne justement que l’évaluation du transfert vers le travail reste difficile et nécessite de dépasser les simples scores de fin de module. citeturn530276search1

Les simulations permettent de pratiquer des situations dans lesquelles l’erreur n’a pas de conséquence réelle ; les revues sur la simulation et les serious games soulignent également l’intérêt du débriefing et de scénarios intentionnellement liés aux situations professionnelles. citeturn530276search2turn880396search7

Cela justifie de mesurer au minimum quatre niveaux :

`exposition → compréhension → rétention → transfert`

et, lorsque le client peut fournir la donnée, un cinquième :

`impact opérationnel`.

### Éviter la gamification cosmétique

Points, badges, chronomètres et classements peuvent renforcer l’expérience, mais ne constituent pas à eux seuls une pédagogie. Les travaux récents sur la gamification indiquent que les résultats varient selon les principes de conception, le contexte et la durée ; les approches centrées uniquement sur récompenses et compétition peuvent être moins robustes que des dispositifs soutenant progression, maîtrise, autonomie et coopération. citeturn530276search6turn530276search7turn530276search8

Pour votre produit, je ferais donc de la compétition une **option**, jamais une dépendance structurelle. Une même activité devrait pouvoir fonctionner en mode personnel, équipe, coopératif ou compétitif.

## Bibliothèque de mécaniques

Les évaluations de complexité et d’accessibilité ci-dessous sont **mes estimations de conception** pour un moteur web HTML/JS moderne, et non des mesures issues d’études. Complexité : **1 = très simple, 5 = importante**. Accessibilité : **A = facile à rendre accessible, B = demande une alternative, C = interaction plus délicate**. Les mécaniques reposant sur du drag-and-drop doivent avoir une alternative clic/sélection/clavier : WCAG 2.2 demande notamment qu’une fonctionnalité fondée sur le glissement puisse aussi être réalisée sans mouvement de glissement lorsqu’il n’est pas essentiel. citeturn149355search0turn149355search2

| Mécanique | Principe et objectif pédagogique | Exemple entreprise et déroulé | Format | Dev / accessibilité | Personnalisation et indicateurs |
|---|---|---|---|---|---|
| **Tri de cartes** | Classifier, distinguer des catégories, construire des modèles mentaux | Cybersécurité : classer des actions en « autorisé / à risque / interdit » ; cartes une à une puis correction | 3–8 min ; 1–50 ; sync/async | 1/5, B | Catégories, cartes, illustrations, feedback ; taux par catégorie, erreurs récurrentes |
| **Ordonnancement** | Reconstruire une procédure ou une séquence causale | Industrie : remettre les étapes de consignation dans l’ordre | 3–8 min ; 1–30 ; sync/async | 1/5, B | Étapes, distracteurs, temps ; exactitude, inversions, temps |
| **Association / matching** | Créer des liens entre notions | Produit : associer fonctionnalité ↔ bénéfice client | 3–7 min ; individuel/équipe | 1/5, A/B | Texte/image/audio ; associations fautives, tentatives |
| **Memory / paires** | Renforcer reconnaissance et associations | Onboarding : collaborateur ↔ responsabilité ou acronyme ↔ définition | 3–6 min ; 1–20 | 1/5, A | Cartes, illustrations, difficulté ; nombre de retournements, temps |
| **Puzzle de processus** | Construire une structure globale | Achats : reconstituer le flux de validation d'une commande | 5–10 min ; 1–10 | 2/5, B | Nœuds, connecteurs, étapes facultatives ; erreurs de structure |
| **Catégorisation progressive** | Réviser plusieurs distinctions successivement | RGPD : donnée personnelle / sensible / non personnelle / contexte particulier | 5–10 min ; 1–100 | 2/5, A/B | Séries adaptatives ; maîtrise par concept |
| **Hotspot / cliquer la zone** | Identifier visuellement un risque, objet ou élément | Sécurité : inspecter une photo d’entrepôt et repérer 8 risques | 3–10 min ; 1–50 | 2/5, B | Images, zones, indices ; risques détectés / oubliés |
| **Spot the Difference / erreur** | Détecter des anomalies | Qualité : identifier les écarts entre poste conforme et poste réel | 4–10 min ; 1–20 | 2/5, B | Nombre d’erreurs, zoom, indices ; précision, faux positifs |
| **Objet caché / inspection** | Explorer un environnement pour rechercher des informations | Onboarding : retrouver outils et ressources dans un bureau virtuel | 5–12 min | 2/5, B | Décor, objets, descriptions ; couverture, temps, indices |
| **Carte interactive** | Relier information et localisation/espace | Supply chain : retrouver responsabilités sur une chaîne logistique | 5–15 min ; 1–50 | 2/5, B | Carte, zones, médias ; exploration, réponses |
| **Timeline** | Comprendre chronologie et causalité | Gestion de crise : reconstruire les événements ayant conduit à un incident | 5–10 min | 2/5, A/B | Dates, événements, causes ; erreurs d’ordre, causalité |
| **Carte mentale à compléter** | Organiser les relations entre concepts | Produit : construire l’écosystème d’une offre | 8–15 min ; 1–10 | 3/5, B | Nœuds, relations, niveaux ; structure produite |
| **Dialogue à choix** | Pratiquer communication et décision | Manager : répondre à un collaborateur en difficulté | 5–15 min ; 1–5 | 2/5, A | Personnages, dialogues, ton, variables ; décisions, chemin, compétences |
| **Scénario à embranchements** | Comprendre conséquences et arbitrages | Commercial : conduire un rendez-vous de découverte | 8–25 min ; 1–10 | 3/5, A | Nœuds, variables, fins ; chemins, conséquences, réussite |
| **Dilemme** | Arbitrer entre plusieurs critères sans réponse simpliste | Éthique : accepter ou refuser un cadeau fournisseur | 3–8 min ; 1–100 | 1/5, A | Alternatives, justification, normes ; choix + argumentation |
| **Simulation de boîte mail** | Prioriser et décider sous contraintes | Manager : traiter 12 messages lors d’une crise | 10–25 min | 3/5, A | Emails, urgence, décisions ; priorisation, erreurs, temps |
| **Simulation de chat** | Pratiquer conversations courtes | Support client : répondre à un client agressif | 5–15 min | 3/5, A | Personas, réponses, tonalité ; parcours, satisfaction simulée |
| **Conseil d’expert** | Faire produire diagnostic + recommandation | Finance : choisir un financement selon le profil client | 8–20 min | 2/5, A | Cas, contraintes, critères ; recommandation vs critères |
| **Prédire la conséquence** | Développer raisonnement causal | Sécurité : « que va-t-il se passer si… ? » puis révélation | 3–8 min | 1/5, A | Situation, issues, média ; précision prédictive |
| **Cas évolutif** | Donner de nouvelles informations après chaque choix | Gestion de projet : projet qui dérive progressivement | 10–30 min | 3/5, A | Événements, variables, ressources ; score décisionnel longitudinal |
| **Escape / code à débloquer** | Résoudre une succession d’énigmes liées au contenu | Compliance : récupérer les éléments nécessaires pour débloquer un dossier | 15–30 min ; 1–6 | 3/5, B | Univers, codes, énigmes ; progression, indices, blocages |
| **Enquête / détective** | Collecter des preuves, formuler une hypothèse | Qualité : identifier la cause racine d’une non-conformité | 10–25 min ; 1–6 | 3/5, A/B | Témoins, documents, indices ; preuves consultées, diagnostic |
| **Mystery box** | Débloquer progressivement des contenus | Onboarding : découvrir les éléments de la culture de l’entreprise | 5–15 min | 2/5, A | Compartiments, conditions ; ordre d’exploration |
| **Mot / code secret** | Extraire des éléments de plusieurs tâches | Produit : trouver un terme-clé à partir de cas clients | 5–15 min | 1/5, A | Indices, vocabulaire ; recours aux aides |
| **Déduction logique** | Combiner plusieurs informations pour conclure | Audit : retrouver l’origine d’une anomalie parmi plusieurs hypothèses | 8–20 min | 2/5, A | Règles, indices, scénarios ; étapes du raisonnement |
| **Ressources limitées** | Arbitrer avec budget/temps limité | Projet : répartir 100 points de budget entre qualité, délai et scope | 5–15 min ; 1–20 | 2/5, A | Budget, contraintes, conséquences ; arbitrages, utilité |
| **Buy a Feature** | Prioriser collectivement avec ressources limitées | Produit : clients internes achètent les fonctionnalités prioritaires | 15–30 min ; 3–20 | 2/5, A | Fonctionnalités, budgets ; consensus, allocation |
| **Survival ranking** | Construire une réponse, comparer puis débattre | Leadership : prioriser 10 actions lors d’une crise | 15–30 min ; équipes | 2/5, A/B | Items, règle experte ; écart individuel/équipe |
| **Mission collaborative** | Chaque joueur détient une partie de l’information | Handover : commercial, chef de projet et support doivent résoudre un incident | 15–30 min ; 3–8 | 3/5, A | Rôles, indices privés, objectifs ; échanges, contribution |
| **Battle Cards** | Comparer deux propositions à partir de critères | Vente : choisir l’argument le plus pertinent contre un concurrent | 5–15 min ; 1–30 | 2/5, A | Cartes, attributs, contraintes ; choix par contexte |

Plusieurs de ces familles existent déjà sous des formes proches dans H5P, Genially, Rise 360, Wooclap ou Klaxoon : H5P propose notamment scénario à embranchements, vidéo interactive, drag-and-drop, séquençage et flashcards ; Genially propose escape games, memory, puzzles, tri, associations et jeux de déduction ; Rise propose notamment scénarios et activités de tri ; Wooclap permet plus de vingt formats interactifs et des activités de classement ; Klaxoon combine activités synchrones et asynchrones et propose des modèles collaboratifs. citeturn990292search0turn990292search2turn533212search0turn990292search33turn990292search40

Cette variété montre surtout qu’une bibliothèque pertinente ne doit pas être organisée seulement par « type de jeu », mais également par **intention pédagogique**. Je recommande cinq entrées dans votre futur catalogue :

**Je veux mémoriser → Je veux comprendre → Je veux pratiquer → Je veux collaborer → Je veux évaluer.**

Un responsable formation ne pense généralement pas « je veux un jeu de cartes » ; il pense « mes commerciaux n’arrivent pas à identifier le besoin du client ».

## Templates MVP et parcours combinés

### Les dix templates à construire en priorité

La sélection suivante optimise quatre critères : valeur pédagogique, diversité des cas d’usage, réutilisation de composants et effort technique.

| Priorité | Template | Pourquoi il est intéressant | Effort relatif | Exemple de promesse produit |
|---|---|---|---|---|
| 1 | **Tri Express** | Très polyvalent, facile à alimenter, facilement mesurable | Très faible | « Transformez une procédure en challenge de 5 minutes » |
| 2 | **Sequence Challenge** | Excellent pour procédures et workflows | Très faible | « Remettez le processus dans le bon ordre » |
| 3 | **Match Lab** | Produit, vocabulaire, rôles, concepts | Très faible | « Associez les bons concepts » |
| 4 | **Spot the Risk** | Très visuel, pertinent pour sécurité/qualité | Faible | « Inspectez la scène et détectez les risques » |
| 5 | **Dialogue Trainer** | Fort potentiel commercial et soft skills | Faible-moyen | « Entraînez-vous à la conversation avant de la vivre » |
| 6 | **Decision Path** | Cœur du serious game professionnel | Moyen | « Chaque décision a des conséquences » |
| 7 | **Case Investigator** | Très engageant sans nécessiter de 3D | Moyen | « Analysez les preuves et trouvez la cause » |
| 8 | **Process Builder** | Excellent pour transfert de savoir métier | Moyen | « Reconstruisez le fonctionnement réel du processus » |
| 9 | **Team Mission** | Différenciant pour ateliers et séminaires | Moyen | « Une équipe, des informations différentes, un seul objectif » |
| 10 | **Resource Challenge** | Introduit stratégie et arbitrage | Moyen | « Que feriez-vous avec seulement 100 points ? » |

Le **Decision Path** mérite probablement de devenir la mécanique centrale de votre plateforme : les solutions H5P, Rise 360 et Attensi proposent toutes des formes de scénarios avec choix et conséquences, Attensi positionnant explicitement les simulations décisionnelles et scénarios réalistes comme des outils de pratique professionnelle. citeturn990292search1turn533212search8turn533212search13turn533212search22

À l’inverse, je repousserais en deuxième phase : monde 3D, simulation physique, avatars animés complexes, IA conversationnelle entièrement ouverte, moteur multijoueur temps réel sophistiqué. Ils peuvent être impressionnants en démonstration mais augmentent très fortement la production de contenus et la complexité technique. Les offres de simulation 3D comme celles d’Attensi montrent la richesse possible de cette direction, mais elles représentent aussi une catégorie de produit sensiblement différente d’un moteur HTML léger. citeturn533212search16turn533212search17

### Exemples de parcours multi-mécaniques

**Onboarding — 30 minutes + rappels.** Une carte interactive permet de découvrir l’organisation ; une association relie personnes et responsabilités ; une mini-enquête demande de retrouver une information ; un dialogue simule une première situation professionnelle ; trois jours plus tard, un challenge de rappel réactive les connaissances.

**Cybersécurité — 20 minutes + campagne espacée.** Spot the Risk → simulation de boîte mail → dilemme phishing → scénario à embranchements → rappels J7/J30. Cette structure passe de la reconnaissance à la décision, puis à la rétention.

**Formation commerciale — 45 minutes.** Battle Cards produit → dialogue de découverte → scénario client → objection challenge → débrief des décisions. Le joueur ne récite plus la proposition de valeur : il doit sélectionner l’argument approprié au contexte.

**Management — atelier 60 minutes.** Dilemme individuel → vote anonyme → discussion d’équipe → dialogue manager/collaborateur → scénario évolutif → réflexion finale. La dimension sociale est ici plus importante que les points ou le classement.

**Procédure industrielle — 15 minutes.** Sequence Challenge → inspection visuelle → scénario d’incident → rappel différé. La revue sur l’apprentissage actif appliqué à la sécurité au travail conclut que les scénarios de risque et le feedback immédiat peuvent améliorer la compréhension et faciliter le transfert vers les situations réelles. citeturn880396search7

Un avantage majeur d’une telle architecture est que **le contenu devient réutilisable indépendamment du jeu**. La même règle métier peut être appelée par plusieurs activités et plusieurs campagnes de rappel.

## Benchmark des solutions existantes

Le benchmark montre trois familles de concurrents : outils d’interaction, outils auteur e-learning et plateformes de simulation.

| Solution | Positionnement observé | Forces pertinentes pour votre projet | Espace de différenciation possible |
|---|---|---|---|
| **Kahoot!** | Quiz, présentation interactive, équipes, missions | Simplicité, énergie collective, modes équipe et missions | Aller beaucoup plus loin dans les décisions, processus et simulations |
| **Wooclap / Wooflash** | Active learning, interaction live et asynchrone | 20+ formats ; tri ; questions ouvertes ; répétition espacée côté Wooflash | Se positionner sur de vrais « mini-jeux métier » |
| **Klaxoon** | Collaboration et ateliers | Boards, activités synchrones/asynchrones, missions et templates collaboratifs | Experiences plus scénarisées et fortement paramétrables |
| **H5P** | Framework HTML5 de contenus interactifs | Très grande variété ; open ecosystem ; branching ; vidéo ; drag/drop | UX plus orientée business + catalogue de serious games cohérent |
| **Genially** | Création visuelle interactive et gamification | Très grande bibliothèque visuelle d’escape games, memory, puzzles | Analytics pédagogiques et logique adaptative plus poussés |
| **Rise 360** | Authoring e-learning professionnel | Scénarios, tri, intégration à l’écosystème Articulate | Temps de création beaucoup plus court via templates spécialisés |
| **Attensi** | Simulations professionnelles gamifiées | Forte immersion, scénarios métier, décisions, répétition | Alternative légère HTML pour besoins moins complexes et budgets plus faibles |
| **Axonify** | Microlearning adaptatif pour frontline workers | Sessions courtes, personnalisation, répétition, analytics | Plus de diversité créative dans les mécaniques |

Kahoot propose désormais des expériences professionnelles, du jeu par équipe et des « Missions » où des contenus individuels contribuent à un objectif collectif. citeturn533212search25turn533212search28turn533212search30

Wooclap annonce plus de vingt types de questions utilisables en direct ou à son rythme, et son activité Sorting est conçue pour révéler le raisonnement plutôt que seulement une réponse binaire ; Wooflash combine formats interactifs, récupération active et répétition espacée. citeturn990292search26turn990292search33turn990292search32

H5P constitue probablement le benchmark technique le plus intéressant pour votre idée : il démontre qu’un catalogue d’interactions HTML5 peut combiner types de contenu simples et systèmes plus sophistiqués comme le Branching Scenario, dont les choix peuvent conduire vers différents nœuds et fins avec scores distincts. citeturn990292search1turn990292search4

Genially est particulièrement fort sur le **packaging visuel de mécaniques simples** : son catalogue actuel contient notamment escape rooms, memory, classement, association de concepts, puzzles de mots, séquences, différences visuelles et jeux de déduction. citeturn990292search2turn990292search3

Articulate Rise montre qu’une plateforme corporate très diffusée peut intégrer directement des blocs de scénario et de tri. Son évolution en matière d’accessibilité est également instructive : Articulate documente par exemple des améliorations pour la navigation clavier et les lecteurs d’écran sur le bloc Scenario. citeturn533212search0turn533212search3

Attensi représente l’autre extrême : simulations gamifiées, scénarios ramifiés et reproduction de situations professionnelles. L’entreprise met particulièrement l’accent sur la pratique répétée de situations proches du travail réel. citeturn533212search13turn533212search17turn533212search23

Axonify illustre quant à lui l’intérêt d’une boucle de microlearning fréquente : la plateforme décrit des expériences courtes adaptées aux lacunes individuelles et utilise progression, données d’apprentissage et renforcement répété plutôt qu’un unique module de formation. citeturn533212search26turn533212search29

L’espace de marché qui me paraît intéressant se situe donc **entre Kahoot/Genially et Attensi** :

> « Plus pédagogique et simulatif qu’un quiz ou une présentation interactive ; beaucoup plus léger à produire et déployer qu’une simulation métier 3D. »

Cette formulation est une recommandation de positionnement, pas une conclusion issue d’une étude de marché quantitative.

## Architecture d’un moteur de templates paramétrables

Je recommande de séparer strictement **contenu, mécanique, thème visuel et runtime**.

Conceptuellement :

```text
CONTENT
│
├── concepts
├── rules
├── situations
├── media
├── feedback
└── competency tags
        │
        ▼
GAME TEMPLATE
│
├── interaction model
├── scoring rules
├── states
├── timing
├── player mode
└── analytics events
        │
        ▼
THEME
│
├── branding
├── typography
├── UI skin
├── sounds
└── narrative wrapper
        │
        ▼
RUNTIME HTML/JS
        │
        ├── browser
        ├── LMS
        ├── iframe/embed
        └── standalone package
```

Avec cette séparation, une entreprise peut transformer une activité de cybersécurité en thème « mission d’espionnage » sans modifier les règles pédagogiques.

Un schéma JSON minimal pourrait ressembler à ceci :

```json
{
  "game": {
    "id": "security-phishing-01",
    "template": "branching_dialogue",
    "version": 3,
    "title": "La boîte mail de lundi matin"
  },
  "learning": {
    "objectives": [
      "identifier un email de phishing",
      "choisir la procédure de signalement"
    ],
    "competencies": ["cyber.phishing", "cyber.reporting"]
  },
  "experience": {
    "durationTarget": 600,
    "mode": "solo",
    "difficulty": 2,
    "timer": false
  },
  "nodes": [
    {
      "id": "n1",
      "type": "message",
      "content": "Vous recevez cet email...",
      "media": "mail-01.png"
    },
    {
      "id": "n2",
      "type": "decision",
      "options": [
        {
          "id": "a",
          "label": "Ouvrir le fichier",
          "next": "n3",
          "effects": {
            "securityScore": -20
          }
        },
        {
          "id": "b",
          "label": "Signaler l'email",
          "next": "n4",
          "effects": {
            "securityScore": 20
          }
        }
      ]
    }
  ],
  "feedback": {},
  "theme": {},
  "analytics": {}
}
```

Les événements analytics devraient être génériques :

```text
game.started
node.viewed
decision.selected
item.matched
item.classified
hint.requested
feedback.viewed
game.completed
concept.mastered
concept.failed
game.replayed
```

Puis enrichis :

```text
actor
verb
object
timestamp
result
duration
context
session
competency
```

Cette logique est compatible conceptuellement avec xAPI, dont les statements décrivent notamment un acteur, une action et un objet et peuvent transporter contexte et résultat vers un Learning Record Store. xAPI a précisément été conçu pour documenter une grande variété d’expériences, y compris simulations, apprentissage social, mobile et serious games. citeturn149355search9turn149355search10

Pour le marché entreprise, je prévoirais dès la conception trois sorties :

**URL autonome**, **iframe/embed**, **LMS**.

Pour l’intégration LMS plus avancée, LTI 1.3/LTI Advantage fournit un standard d’intégration entre plateformes d’apprentissage et outils externes ; l’écosystème entreprise peut également justifier ultérieurement SCORM/xAPI selon les LMS ciblés. citeturn149355search6turn149355search7

Sur l’accessibilité, WCAG 2.2 doit être une contrainte de runtime plutôt qu’une correction appliquée template par template : navigation clavier, focus visible, alternatives textuelles, taille des cibles, absence de dépendance exclusive au drag-and-drop et alternatives aux animations ou interactions motrices devraient appartenir à votre design system commun. citeturn149355search0turn149355search1turn149355search4

Un moteur générique peut ensuite être construit autour d’une machine à états :

```text
LOAD
 ↓
INTRO
 ↓
ACTIVITY
 ↓
DECISION / ACTION
 ↓
EVALUATION
 ↓
FEEDBACK
 ↓
NEXT STATE
 ↓
RESULT
```

Le template ne décrit alors que les états autorisés et leur rendu.

Cette architecture rend possible une fonctionnalité stratégique : **« changer de jeu sans refaire le contenu »**.

Par exemple :

```text
25 règles de sécurité
       ↓
   Content Bank
   ↙    ↓     ↘
Tri   Scenario   Spot-the-risk
   ↘    ↓     ↙
  Spaced review
```

À terme, l’IA peut intervenir avant le runtime pour transformer une source documentaire en objets structurés :

`document → concepts → situations → distracteurs → feedback → jeu proposé`

mais je déconseille de rendre la génération automatique indispensable au MVP. La valeur différenciante durable se situe davantage dans votre modèle pédagogique, vos mécaniques et la qualité de l’authoring que dans la seule génération de texte.

## Stratégie de prototypage, validation B2B et questions de cadrage

Je lancerais le produit en trois vagues.

**Vague MVP — moteur universel.** Construire les composants cartes, zones, événements, scoring, feedback, timer, médias, branches et analytics, puis sortir six mécaniques très rapides : tri, ordre, matching, memory, hotspot et dilemme. Elles partagent une grande partie du code.

**Vague Serious Game — application.** Ajouter dialogue, branching scenario, enquête et resource challenge. Ces expériences deviennent les démonstrateurs commerciaux à forte valeur perçue.

**Vague Collaboration — équipe.** Ajouter sessions, rôles, contributions d’équipes, vote et mission collaborative. Klaxoon et Kahoot montrent que la dimension collective est déjà un usage important dans la formation et l’animation professionnelle. citeturn990292search25turn533212search30

Pour les pilotes clients, je ne demanderais pas « avez-vous aimé le jeu ? ». Il faut distinguer **engagement et apprentissage**. Les évaluations de serious games souffrent fréquemment d’un recours excessif aux mesures auto-déclarées ou de mesures uniquement immédiates ; des revues recommandent davantage de mesures objectives et longitudinales. citeturn880396search8turn530276search1

Chaque pilote devrait donc mesurer :

- taux de démarrage et de complétion ;
- abandon par étape ;
- temps passé ;
- taux d’erreur par compétence ;
- nombre d’indices ;
- progression entre première et dernière tentative ;
- rétention à J7/J30 lorsque possible ;
- comportement ou mise en pratique métier lorsque mesurable ;
- satisfaction et perception d’utilité séparées du score d’apprentissage.

Pour une validation B2B, le test le plus révélateur ne sera probablement pas « les collaborateurs aiment-ils le jeu ? » mais **« un responsable formation peut-il transformer son contenu en expérience utile sans votre intervention ? »**. Ce point détermine directement la scalabilité du modèle.

Je testerais donc trois propositions commerciales différentes auprès des premiers prospects :

**SaaS self-service** — « créez votre jeu vous-même ».

**SaaS + catalogue** — « choisissez un modèle métier et remplacez son contenu ».

**Service + plateforme** — « donnez-nous vos supports ; nous transformons la formation pour vous ».

La troisième approche peut être pertinente au début pour découvrir les besoins réels, enrichir la bibliothèque et financer le produit ; le risque est de devenir une agence de production plutôt qu’un logiciel. Il faudra donc mesurer le temps de paramétrage nécessaire pour chaque projet.

Enfin, plusieurs questions modifieront fortement l’ordre de développement et le modèle économique :

1. **Quels secteurs voulez-vous cibler en premier ?** Industrie/sécurité, conseil, retail, santé, banque/assurance, IT, administration ou un marché transversal ?
2. **Qui achète ?** Responsable formation/L&D, RH, manager d’équipe, organisme de formation, consultant ou direction métier ?
3. **Qui crée les expériences ?** Votre équipe, le formateur client, le manager ou idéalement n’importe quel collaborateur ?
4. **Le cas d’usage dominant est-il synchrone ou asynchrone ?** Séminaires et ateliers live, formation individuelle, onboarding continu ou les trois ?
5. **Quel est le nombre typique de participants ?** 5–20, 50–200 ou plusieurs milliers ?
6. **Les entreprises doivent-elles héberger les jeux chez vous ou pouvoir exporter un fichier HTML autonome ?**
7. **Avez-vous besoin dès le départ de SCORM/xAPI/LMS/SSO ou une URL et un QR code suffisent-ils pour les premiers clients ?**
8. **Souhaitez-vous vendre un outil auteur, une bibliothèque de jeux ou un service de transformation de formations existantes ?**
9. **Le client doit-il pouvoir modifier complètement l’identité visuelle — couleurs, typographie, logo, musique, personnages, décor — ou quelques thèmes prédéfinis suffisent-ils ?**
10. **Quelle place souhaitez-vous donner à l’IA : génération automatique à partir d’un PDF, assistant de conception, génération de scénarios ou simplement accélération de l’authoring ?**
11. **Votre différenciation prioritaire est-elle le fun, la facilité de création, la qualité pédagogique, la collaboration ou la mesure de l’apprentissage ?**
12. **Disposez-vous déjà de deux ou trois entreprises susceptibles de devenir design partners ?** Elles permettraient de sélectionner les mécaniques MVP à partir de besoins réels plutôt que d’une bibliothèque théorique.