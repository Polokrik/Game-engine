/* Champion solo : lecteur du jeu (3 manches : Sprint, La série, Trouve avant la fin).
   Dépend de fabriquerEl, appliquerTheme et creerMoteurSons (src/commun.js). Recopié tel quel dans les jeux exportés. */

function mountChampion(racine, config, options) {
  options = options || {};
  var doc = racine.ownerDocument;
  var el = fabriquerEl(doc);
  var meta = config.meta || {}, theme = config.theme || {}, ch = config.champion || {};
  var cSprint = ch.sprint || {}, cSerie = ch.serie || {}, cTrouve = ch.trouve || {};
  appliquerTheme(racine, theme);

  var LETTRES = ["A", "B", "C", "D", "E", "F"];
  var NOMS = { sprint: "Sprint", serie: "La série", trouve: "Trouve avant la fin" };
  var BONUS_SERIE = 5;
  function entier(v, def, min, max) { v = Math.round(Number(v)); if (!isFinite(v)) v = def; return Math.max(min, Math.min(max, v)); }
  function propre(x) { return String(x == null ? "" : x).trim(); }
  function pluriel(n, un, plusieurs) { return n + " " + (Math.abs(n) > 1 ? plusieurs : un); }

  var objectif = entier(cSprint.objectif, 9, 1, 99);
  var sprintMax = entier(cSprint.questionsMax, 14, 3, 60);
  var chrono = entier(cSprint.chrono, 0, 0, 120);
  var longueur = entier(cSerie.longueur, 4, 2, 10);
  var serieMax = entier(cSerie.questionsMax, 12, longueur, 60);
  var nbTrouve = entier(cTrouve.nombre, 3, 1, 20);
  var penalite = cTrouve.penalite != null ? entier(cTrouve.penalite, 1, 0, 3) : 1;
  var reposer = ch.reposerErreurs !== false;

  /* ---------- contenu ---------- */
  var pool = (config.questions || []).map(function (q) {
    var rep = [];
    (q.reponses || []).forEach(function (t, i) { t = propre(t); if (t) rep.push({ texte: t, bonne: i === Number(q.bonne) }); });
    return {
      enonce: propre(q.enonce), rep: rep, infoCle: propre(q.infoCle), source: propre(q.source),
      theme: propre(q.theme) || "Général", niveau: entier(q.niveau, 1, 1, 3), reposee: false
    };
  }).filter(function (q) {
    return q.enonce && q.rep.length >= 2 && q.rep.some(function (r) { return r.bonne; });
  });
  var trouves = (config.trouve || []).map(function (t) {
    return {
      theme: propre(t.theme) || "Général",
      indices: (t.indices || []).slice(0, 4).map(propre),
      reponse: propre(t.reponse),
      faux: (t.faux || []).map(propre).filter(Boolean).slice(0, 3),
      infoCle: propre(t.infoCle), source: propre(t.source)
    };
  }).filter(function (t) {
    return t.indices.length === 4 && t.indices.every(Boolean) && t.reponse && t.faux.length >= 2;
  });

  function listeThemes() {
    var vus = {}, out = [];
    pool.concat(trouves).forEach(function (x) { if (!vus[x.theme]) { vus[x.theme] = 1; out.push(x.theme); } });
    return out;
  }
  function questionsDuTheme(th) { return pool.filter(function (q) { return q.theme === th; }); }
  function themesSerie() { return listeThemes().filter(function (th) { return questionsDuTheme(th).length >= longueur; }); }
  var dispo = { sprint: pool.length >= 1, serie: themesSerie().length >= 1, trouve: trouves.length >= 1 };
  var voulues = (ch.manches && ch.manches.length) ? ch.manches : ["sprint", "serie", "trouve"];
  var manches = ["sprint", "serie", "trouve"].filter(function (m) { return voulues.indexOf(m) >= 0 && dispo[m]; });

  /* ---------- sons ---------- */
  var sonsCfg = config.sons || {};
  var moteur = creerMoteurSons(sonsCfg.pistes, sonsCfg.volume);
  var aSons = sonsCfg.actif !== false && moteur.disponible;

  /* ---------- records et maîtrise (gardés dans le navigateur du joueur) ---------- */
  var cleStock = "qz-champion-" + (meta.id || "defaut");
  var stockOk = true;
  function chargerStats() {
    var vide = { v: 1, records: { score: 0, serie: 0, sprint: null, parties: 0 }, themes: {} };
    if (options.persistance === false) return vide;
    try {
      var t = window.localStorage.getItem(cleStock);
      if (t) { var o = JSON.parse(t); if (o && o.v === 1 && o.records && o.themes) return o; }
    } catch (e) { stockOk = false; }
    return vide;
  }
  var stats = chargerStats();
  function sauverStats() {
    if (options.persistance === false) return;
    try { window.localStorage.setItem(cleStock, JSON.stringify(stats)); } catch (e) { stockOk = false; }
  }
  function maitrise(th) {
    var a = stats.themes[th];
    if (!a || a.length < 3) return null;
    var s = 0; a.forEach(function (x) { s += x; });
    return Math.round(100 * s / a.length);
  }
  function noter(th, ok) { var a = stats.themes[th] || []; a.push(ok ? 1 : 0); stats.themes[th] = a.slice(-10); }
  function signaler(type, d) {
    if (typeof options.onEvenement === "function") { try { options.onEvenement(type, d || {}); } catch (e) {} }
  }

  /* ---------- utilitaires ---------- */
  function melanger(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var etat = null, minuterie = null, chronoEl = null;
  function arreterChrono() { if (minuterie) { clearInterval(minuterie); minuterie = null; } }
  function nouvellePartie() {
    arreterChrono(); moteur.arreter();
    etat = { ecran: "accueil", im: -1, manche: null, m: null, q: null, t: null, score: 0, chaine: 0, chaineMax: 0, bilans: {}, reponses: [], final: null, sprintRecord: false, reste: 0 };
  }

  /* ---------- éléments d'interface ---------- */
  function logo(cls) { return theme.logo ? el("img", { class: cls, src: theme.logo, alt: "" }) : null; }
  function boutonSon() {
    if (!aSons) return null;
    var actif = moteur.actif();
    return el("button", {
      class: "qz-btn qz-son", type: "button", "data-son": "1", "aria-pressed": actif ? "true" : "false",
      title: actif ? "Couper le son" : "Activer le son", text: actif ? "Son activé" : "Son coupé",
      onclick: function () {
        if (moteur.actif()) { moteur.activer(false); moteur.arreter(); } else moteur.activer(true);
        rendre(false);
        var b = racine.querySelector("[data-son]");
        if (b) { try { b.focus({ preventScroll: true }); } catch (e) {} }
      }
    });
  }
  function entete(texte) {
    return el("header", { class: "qz-entete" }, [
      logo("qz-logo"),
      el("span", { class: "qz-titre-court", text: texte }),
      chronoEl,
      el("span", { class: "qc-score", text: "Score : " + Math.max(0, etat.score) }),
      boutonSon()
    ]);
  }
  function barre(ratio) {
    var p = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
    return el("div", { class: "qc-barre-objectif", role: "img", "aria-label": p + " %" }, [el("i", { style: "width:" + p + "%" })]);
  }
  function pastilles(n, total) {
    var l = [];
    for (var i = 0; i < total; i++) l.push(el("span", { class: "qc-pastille" + (i < n ? " qc-plein" : "") }));
    return el("div", { class: "qc-pastilles", role: "img", "aria-label": n + " sur " + total }, l);
  }
  function infoBloc(x) {
    if (!x.infoCle) return null;
    return el("div", { class: "qz-info" }, [
      el("p", { class: "qz-etiquette", text: "À retenir" }),
      el("p", { text: x.infoCle }),
      x.source ? el("p", { class: "qz-source", text: "Source : " + x.source }) : null
    ]);
  }
  function blocMaitrise(titre) {
    var ths = listeThemes();
    if (!ths.length) return null;
    var lignes = ths.map(function (th) {
      var p = maitrise(th);
      return el("li", { class: "qc-theme-ligne" }, [
        el("span", { class: "qc-theme-nom", text: th }),
        el("span", { class: "qc-barre-theme", role: "img", "aria-label": p == null ? "Pas encore mesuré" : "Maîtrise " + p + " %" }, [el("i", { style: "width:" + (p == null ? 0 : p) + "%" })]),
        el("span", { class: "qc-theme-pct", text: p == null ? "—" : p + " %" })
      ]);
    });
    var faibles = ths.filter(function (th) { var p = maitrise(th); return p != null && p < 70; })
      .sort(function (a, b) { return maitrise(a) - maitrise(b); }).slice(0, 3);
    return el("section", { class: "qc-bloc" }, [
      el("h2", { text: titre }),
      el("ul", { class: "qc-themes-liste" }, lignes),
      faibles.length ? el("p", { class: "qc-a-revoir" }, [el("strong", { text: "À retravailler : " }), faibles.join(", ")]) : null
    ]);
  }
  function blocRecords() {
    var r = stats.records;
    if (!r.parties) return null;
    function tuile(valeur, libelle) {
      return el("div", { class: "qc-tuile" }, [el("p", { class: "qc-tuile-val", text: valeur }), el("p", { class: "qc-tuile-lib", text: libelle })]);
    }
    return el("section", { class: "qc-bloc" }, [
      el("h2", { text: "Vos records" }),
      el("div", { class: "qc-tuiles" }, [
        tuile(String(r.score), "Meilleur score"),
        tuile(String(r.serie), "Meilleure série"),
        tuile(r.sprint == null ? "—" : r.sprint + " s", "Sprint le plus rapide"),
        tuile(String(r.parties), r.parties > 1 ? "Parties jouées" : "Partie jouée")
      ])
    ]);
  }

  /* ---------- écran d'accueil ---------- */
  function demarrer(avecSon) {
    moteur.activer(avecSon);
    signaler("debut", { son: !!avecSon });
    etat.im = 0;
    allerIntro();
    moteur.jouer("qp_generique");
  }
  function vueAccueil() {
    var entetes = [logo("qz-logo-grand"), el("h1", { text: meta.titre || "Champion solo" })];
    if (!manches.length) {
      return el("div", { class: "qz-accueil" }, entetes.concat([
        el("p", { class: "qz-vide", text: "Ce jeu n'est pas encore jouable. Ajoutez au moins une question complète (Sprint), un thème de " + longueur + " questions (La série) ou un concept complet (Trouve avant la fin), et cochez la manche correspondante dans les règles." })
      ]));
    }
    var regles = [];
    if (manches.indexOf("sprint") >= 0) regles.push("Sprint : atteignez " + objectif + " points. Une bonne réponse rapporte 1 à 3 points selon sa difficulté" + (chrono ? ", avec " + chrono + " secondes par question." : "."));
    if (manches.indexOf("serie") >= 0) regles.push("La série : enchaînez " + longueur + " bonnes réponses sur le thème de votre choix. Une erreur remet la série à zéro, mais votre meilleure série est gardée.");
    if (manches.indexOf("trouve") >= 0) regles.push("Trouve avant la fin : un indice de plus à chaque étape. Répondre dès l'indice 1 rapporte 4 points, à l'indice 4 un seul point." + (penalite ? " Une mauvaise réponse coûte " + pluriel(penalite, "point", "points") + "." : ""));
    var bas;
    if (aSons) {
      bas = el("div", { class: "qz-choix-son" }, [
        el("p", { class: "qz-avis-son" }, [
          el("strong", { text: "Ce jeu comporte des effets sonores. " }),
          "Ils sont facultatifs : commencez sans le son si vous préférez le silence. Vous pourrez aussi les couper à tout moment avec le bouton « Son » en haut de l'écran."
        ]),
        el("div", { class: "qz-actions-debut" }, [
          el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: "Commencer avec le son", onclick: function () { demarrer(true); } }),
          el("button", { class: "qz-btn", type: "button", text: "Commencer sans le son", onclick: function () { demarrer(false); } })
        ])
      ]);
    } else {
      bas = el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: "Commencer", onclick: function () { demarrer(false); } });
    }
    var aJoue = stats.records.parties > 0;
    return el("div", { class: "qz-accueil qc-accueil" }, entetes.concat([
      meta.sousTitre ? el("p", { class: "qz-accroche", text: meta.sousTitre }) : null,
      el("ul", { class: "qz-regles" }, regles.map(function (t) { return el("li", { text: t }); })),
      bas,
      aJoue ? blocRecords() : null,
      aJoue ? blocMaitrise("Votre maîtrise par thème") : null,
      !stockOk && options.persistance !== false ? el("p", { class: "qz-doux", text: "Vos records ne peuvent pas être conservés dans ce contexte de lecture." }) : null
    ]));
  }

  /* ---------- introduction d'une manche ---------- */
  function allerIntro() {
    etat.manche = manches[etat.im];
    etat.ecran = "intro";
    rendre(true);
  }
  function vueIntro() {
    var type = etat.manche, titre = "Manche " + (etat.im + 1) + " sur " + manches.length + " · " + NOMS[type];
    var contenu;
    if (type === "serie") {
      var ths = themesSerie();
      contenu = [
        el("p", { class: "qz-accroche", text: "Choisissez votre thème. Il faut enchaîner " + longueur + " bonnes réponses, en " + serieMax + " questions au plus." }),
        el("div", { class: "qc-themes" }, ths.map(function (th, i) {
          var p = maitrise(th);
          return el("button", { class: "qc-theme", type: "button", "data-focus": i === 0 ? "1" : null, onclick: function () { lancerManche("serie", th); } }, [
            el("span", { class: "qc-theme-titre", text: th }),
            el("span", { class: "qc-theme-info", text: pluriel(questionsDuTheme(th).length, "question", "questions") + " · " + (p == null ? "pas encore mesuré" : "maîtrise " + p + " %") })
          ]);
        }))
      ];
    } else {
      var texte = type === "sprint"
        ? "Atteignez " + objectif + " points en " + sprintMax + " questions au plus. Chaque bonne réponse rapporte 1, 2 ou 3 points selon sa difficulté." + (chrono ? " Vous avez " + chrono + " secondes par question." : "")
        : "Un concept à deviner, avec un indice de plus à chaque étape. Appuyez sur « JE SAIS ! » dès que vous avez la réponse : 4 points à l'indice 1, 3 à l'indice 2, 2 à l'indice 3, 1 à l'indice 4." + (penalite ? " Une mauvaise réponse coûte " + pluriel(penalite, "point", "points") + "." : "");
      contenu = [
        el("p", { class: "qz-accroche", text: texte }),
        el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: "C'est parti !", onclick: function () { lancerManche(type); } })
      ];
    }
    return el("div", { class: "qz-accueil" }, [el("p", { class: "qz-etiquette", text: titre }), el("h1", { text: NOMS[type] })].concat(contenu));
  }
  function lancerManche(type, th) {
    moteur.estomper(600);
    etat.manche = type;
    if (type === "sprint") {
      etat.m = { type: type, file: melanger(pool), points: 0, nbQ: 0, ok: 0, debut: Date.now(), derniere: null };
      poserQuestion();
    } else if (type === "serie") {
      etat.m = { type: type, theme: th, file: melanger(questionsDuTheme(th)), serie: 0, best: 0, nbQ: 0, points: 0, ok: 0, derniere: null };
      poserQuestion();
    } else {
      etat.m = { type: type, file: melanger(trouves).slice(0, nbTrouve), i: 0, points: 0, details: [] };
      poserTrouve();
    }
  }

  /* ---------- Sprint et La série : questions à choix ---------- */
  function prochaine(m) {
    if (m.type === "sprint") { if (m.nbQ >= sprintMax) return null; return m.file.shift() || null; }
    if (m.nbQ >= serieMax) return null;
    if (!m.file.length) {
      m.file = melanger(questionsDuTheme(m.theme));
      if (m.file.length > 1 && m.file[0] === m.derniere) m.file.push(m.file.shift());
    }
    return m.file.shift() || null;
  }
  function poserQuestion() {
    var m = etat.m, q = prochaine(m);
    if (!q) { terminerManche(); return; }
    m.nbQ++; m.derniere = q;
    etat.ecran = "qcm";
    etat.q = { q: q, ordre: melanger(q.rep), choix: null, valide: false, ok: null, pts: 0, fin: null, temps: false, reprogramme: false };
    if (m.type === "sprint" && chrono > 0) {
      etat.reste = chrono;
      arreterChrono();
      minuterie = setInterval(function () {
        etat.reste--;
        if (chronoEl) { chronoEl.textContent = etat.reste + " s"; chronoEl.className = "qz-chrono" + (etat.reste <= 5 ? " qz-urgent" : ""); }
        if (etat.reste <= 0) repondre(-1);
      }, 1000);
      moteur.jouer("qp_timer");
    } else moteur.estomper(450);
    rendre(false);
  }
  function repondre(idx) {
    var s = etat.q, m = etat.m;
    if (!s || s.valide) return;
    arreterChrono();
    s.valide = true; s.choix = idx; s.temps = idx < 0;
    s.ok = idx >= 0 && !!s.ordre[idx].bonne;
    var q = s.q;
    noter(q.theme, s.ok);
    if (s.ok) {
      s.pts = q.niveau; m.points += s.pts; etat.score += s.pts; m.ok++;
      etat.chaine++; etat.chaineMax = Math.max(etat.chaineMax, etat.chaine);
      if (m.type === "serie") { m.serie++; m.best = Math.max(m.best, m.serie); }
    } else {
      etat.chaine = 0;
      if (m.type === "serie") m.serie = 0;
      if (reposer && !q.reposee) { q.reposee = true; s.reprogramme = true; m.file.splice(Math.min(m.file.length, 3), 0, q); }
    }
    etat.reponses.push({ q: q, ok: s.ok, manche: m.type });
    if (m.type === "sprint") s.fin = m.points >= objectif ? "reussie" : (m.nbQ >= sprintMax || !m.file.length) ? "echec" : null;
    else s.fin = m.serie >= longueur ? "reussie" : m.nbQ >= serieMax ? "echec" : null;
    moteur.jouer(s.ok ? "qp_correct" : "qp_faux");
    sauverStats();
    signaler("reponse", { manche: m.type, theme: q.theme, correcte: s.ok, score: Math.max(0, etat.score) });
    rendre(true);
  }
  function vueQcm() {
    var s = etat.q, q = s.q, m = etat.m;
    chronoEl = (m.type === "sprint" && chrono > 0 && !s.valide)
      ? el("span", { class: "qz-chrono" + (etat.reste <= 5 ? " qz-urgent" : ""), "aria-label": "Temps restant", text: etat.reste + " s" }) : null;
    var suivi = m.type === "sprint"
      ? el("div", { class: "qc-suivi" }, [
          el("p", { class: "qc-suivi-texte", text: "Objectif : " + Math.min(m.points, objectif) + " / " + objectif + " points · question " + m.nbQ + " sur " + sprintMax + " au plus" }),
          barre(m.points / objectif)
        ])
      : el("div", { class: "qc-suivi" }, [
          el("p", { class: "qc-suivi-texte", text: "Série : " + m.serie + " sur " + longueur + " · meilleure " + m.best + " · thème " + m.theme }),
          pastilles(m.serie, longueur)
        ]);
    var reponses = el("div", { class: "qz-reponses", role: "group", "aria-label": "Réponses" }, s.ordre.map(function (r, idx) {
      var cls = "qz-rep", marque = null;
      if (s.valide) {
        if (r.bonne) { cls += " qz-bonne"; marque = "✓"; }
        else if (s.choix === idx) { cls += " qz-fausse"; marque = "✗"; }
        else cls += " qz-neutre";
      }
      return el("button", { class: cls, type: "button", disabled: s.valide, onclick: function () { repondre(idx); } }, [
        el("span", { class: "qz-lettre", text: LETTRES[idx] }),
        el("span", { class: "qz-rep-texte", text: r.texte }),
        marque ? el("span", { class: "qz-marque", "aria-hidden": "true", text: marque }) : null
      ]);
    }));
    var retour = null;
    if (s.valide) {
      var bonne = s.ordre.filter(function (r) { return r.bonne; })[0];
      var titre = s.ok ? "Bonne réponse · +" + pluriel(s.pts, "point", "points") : s.temps ? "Temps écoulé" : "Mauvaise réponse";
      var msg = null;
      if (s.fin === "reussie") msg = m.type === "serie" ? "Série de " + longueur + " réussie ! +" + BONUS_SERIE + " points de bonus." : "Objectif atteint !";
      else if (s.fin === "echec") msg = m.type === "serie" ? "La manche s'arrête ici. Votre meilleure série : " + m.best + " sur " + longueur + "." : "La manche s'arrête ici : objectif non atteint.";
      retour = el("div", { class: "qz-retour " + (s.ok ? "qz-retour-ok" : "qz-retour-ko"), role: "status" }, [
        el("p", { class: "qz-retour-titre" }, [el("span", { "aria-hidden": "true", text: s.ok ? "✓ " : "✗ " }), titre]),
        s.ok ? null : el("p", {}, ["La bonne réponse : ", el("strong", { text: LETTRES[s.ordre.indexOf(bonne)] + ". " + bonne.texte })]),
        infoBloc(q),
        !s.ok && s.reprogramme ? el("p", { class: "qz-doux", text: "Cette question reviendra un peu plus tard pour vous laisser retenter." }) : null,
        msg ? el("p", { class: "qc-msg-manche", text: msg }) : null,
        el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: s.fin ? "Terminer la manche" : "Question suivante", onclick: function () { if (s.fin) terminerManche(); else poserQuestion(); } })
      ]);
    }
    return el("div", { class: "qz-jeu" }, [
      entete(NOMS[m.type]),
      el("div", { class: "qc-colonne" }, [
        suivi,
        el("p", { class: "qc-niveau", text: q.theme + " · " + pluriel(q.niveau, "point", "points") }),
        el("h2", { class: "qz-enonce", text: q.enonce }),
        reponses,
        retour
      ])
    ]);
  }

  /* ---------- Trouve avant la fin ---------- */
  function poserTrouve() {
    var m = etat.m, t = m.file[m.i];
    if (!t) { terminerManche(); return; }
    etat.ecran = "trouve";
    etat.t = { t: t, k: 0, phase: "indices", ordre: null, choix: null, ok: null, pts: 0 };
    moteur.estomper(450);
    rendre(false);
  }
  function jeSais() {
    var s = etat.t;
    moteur.jouer("qp_buzzer");
    s.ordre = melanger([{ texte: s.t.reponse, bonne: true }].concat(s.t.faux.map(function (x) { return { texte: x, bonne: false }; })));
    s.phase = "choix";
    rendre(true);
  }
  function repondreTrouve(idx) {
    var s = etat.t, m = etat.m;
    if (s.phase !== "choix") return;
    s.ok = idx >= 0 && !!s.ordre[idx].bonne; s.choix = idx;
    s.pts = s.ok ? 4 - s.k : -penalite;
    s.phase = "resultat";
    m.points += s.pts; etat.score += s.pts;
    if (s.ok) { etat.chaine++; etat.chaineMax = Math.max(etat.chaineMax, etat.chaine); } else etat.chaine = 0;
    noter(s.t.theme, s.ok);
    m.details.push({ t: s.t, ok: s.ok, pts: s.pts, k: s.k });
    moteur.jouer(s.ok ? "qp_correct" : "qp_faux");
    sauverStats();
    signaler("reponse", { manche: "trouve", theme: s.t.theme, correcte: s.ok, score: Math.max(0, etat.score) });
    rendre(true);
  }
  function abandonnerTrouve() {
    var s = etat.t, m = etat.m;
    s.ok = false; s.pts = 0; s.phase = "resultat"; s.abandon = true;
    etat.chaine = 0;
    noter(s.t.theme, false);
    m.details.push({ t: s.t, ok: false, pts: 0, k: s.k, abandon: true });
    moteur.estomper(300);
    sauverStats();
    rendre(true);
  }
  function vueTrouve() {
    var s = etat.t, t = s.t, m = etat.m;
    var liste = el("ol", { class: "qc-indices" }, t.indices.map(function (txt, i) {
      var vu = i <= s.k || s.phase === "resultat";
      return el("li", { class: "qc-indice" + (vu ? "" : " qc-verrou") + (i === s.k && s.phase !== "resultat" ? " qc-courant" : "") }, [
        el("span", { class: "qc-indice-n", text: "Indice " + (i + 1) }),
        el("span", { class: "qc-indice-t", text: vu ? txt : "À découvrir" }),
        el("span", { class: "qc-indice-pts", text: pluriel(4 - i, "point", "points") })
      ]);
    }));
    var action;
    if (s.phase === "indices") {
      action = el("div", { class: "qc-actions" }, [
        el("button", { class: "qz-btn qz-principal qc-buzz", type: "button", "data-focus": "1", text: "JE SAIS !", onclick: jeSais }),
        s.k < 3
          ? el("button", { class: "qz-btn", type: "button", text: "Indice suivant", onclick: function () { s.k++; moteur.estomper(200); rendre(true); } })
          : el("button", { class: "qz-btn", type: "button", text: "Je ne sais pas", onclick: abandonnerTrouve }),
        el("p", { class: "qz-doux qc-enjeu", text: "Vous gagnez " + pluriel(4 - s.k, "point", "points") + " si vous répondez maintenant." + (penalite ? " Une erreur coûte " + pluriel(penalite, "point", "points") + "." : "") })
      ]);
    } else if (s.phase === "choix") {
      action = el("div", { class: "qc-choix" }, [
        el("p", { class: "qc-niveau", text: "Quelle est la réponse ?" }),
        el("div", { class: "qz-reponses", role: "group", "aria-label": "Réponses" }, s.ordre.map(function (r, idx) {
          return el("button", { class: "qz-rep", type: "button", "data-focus": idx === 0 ? "1" : null, onclick: function () { repondreTrouve(idx); } }, [
            el("span", { class: "qz-lettre", text: LETTRES[idx] }),
            el("span", { class: "qz-rep-texte", text: r.texte })
          ]);
        }))
      ]);
    } else {
      var dernier = m.i + 1 >= m.file.length;
      var titre = s.abandon ? "Concept passé" : s.ok ? "Bonne réponse · +" + pluriel(s.pts, "point", "points") : "Mauvaise réponse" + (s.pts < 0 ? " · −" + pluriel(-s.pts, "point", "points") : "");
      action = el("div", { class: "qz-retour " + (s.ok ? "qz-retour-ok" : "qz-retour-ko"), role: "status" }, [
        el("p", { class: "qz-retour-titre" }, [el("span", { "aria-hidden": "true", text: s.abandon ? "→ " : s.ok ? "✓ " : "✗ " }), titre]),
        el("p", {}, ["La réponse : ", el("strong", { text: t.reponse })]),
        infoBloc(t),
        el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: dernier ? "Terminer la manche" : "Concept suivant", onclick: function () { m.i++; if (m.i >= m.file.length) terminerManche(); else poserTrouve(); } })
      ]);
    }
    return el("div", { class: "qz-jeu" }, [
      entete(NOMS.trouve),
      el("div", { class: "qc-colonne" }, [
        el("p", { class: "qc-suivi-texte", text: "Concept " + (m.i + 1) + " sur " + m.file.length + " · thème " + t.theme }),
        el("h2", { class: "qz-enonce", text: "Qui suis-je, ou qu'est-ce que c'est ?" }),
        liste,
        action
      ])
    ]);
  }

  /* ---------- fin de manche et de partie ---------- */
  function terminerManche() {
    arreterChrono();
    var m = etat.m, b;
    if (m.type === "sprint") {
      var temps = Math.round((Date.now() - m.debut) / 1000);
      b = { type: "sprint", reussie: m.points >= objectif, points: m.points, nbQ: m.nbQ, temps: temps };
      if (b.reussie) {
        var r = stats.records;
        if (r.sprint == null || temps < r.sprint) { if (r.sprint != null) etat.sprintRecord = true; r.sprint = temps; }
      }
    } else if (m.type === "serie") {
      var reussie = m.serie >= longueur;
      if (reussie) { m.points += BONUS_SERIE; etat.score += BONUS_SERIE; }
      b = { type: "serie", theme: m.theme, reussie: reussie, best: m.best, points: m.points, nbQ: m.nbQ };
    } else {
      b = { type: "trouve", points: m.points, details: m.details };
    }
    etat.bilans[m.type] = b;
    sauverStats();
    etat.ecran = "bilan";
    moteur.estomper(300);
    rendre(true);
  }
  function resumeManche(b) {
    if (b.type === "sprint") return b.reussie
      ? "Objectif atteint : " + b.points + " points en " + pluriel(b.nbQ, "question", "questions") + " et " + b.temps + " s."
      : "Objectif manqué : " + b.points + " points sur " + objectif + " en " + pluriel(b.nbQ, "question", "questions") + ".";
    if (b.type === "serie") return b.reussie
      ? "Série de " + longueur + " réussie sur « " + b.theme + " » en " + pluriel(b.nbQ, "question", "questions") + ", bonus compris : " + pluriel(b.points, "point", "points") + "."
      : "Série non terminée sur « " + b.theme + " » : meilleure série " + b.best + " sur " + longueur + ".";
    var bons = b.details.filter(function (d) { return d.ok; }).length;
    return bons + " concept" + (bons > 1 ? "s" : "") + " trouvé" + (bons > 1 ? "s" : "") + " sur " + b.details.length + " · " + pluriel(b.points, "point", "points") + ".";
  }
  function vueBilan() {
    var b = etat.bilans[etat.m.type], dernier = etat.im + 1 >= manches.length;
    var titre = b.type === "trouve" ? "Manche terminée" : b.reussie ? (b.type === "sprint" ? "Sprint réussi !" : "Série réussie !") : (b.type === "sprint" ? "Sprint manqué" : "Série à retenter");
    return el("div", { class: "qz-accueil" }, [
      el("p", { class: "qz-etiquette", text: NOMS[b.type] }),
      el("h1", { text: titre }),
      el("p", { class: "qz-accroche", text: resumeManche(b) }),
      b.type === "sprint" && b.reussie && etat.sprintRecord ? el("p", { class: "qc-record", text: "Nouveau record de vitesse sur le Sprint !" }) : null,
      b.type === "serie" ? pastilles(b.reussie ? longueur : b.best, longueur) : null,
      el("p", { class: "qc-suivi-texte", text: "Score de la partie : " + Math.max(0, etat.score) }),
      el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: dernier ? "Voir mon résultat" : "Manche suivante : " + NOMS[manches[etat.im + 1]], onclick: function () {
        if (dernier) terminerPartie(); else { etat.im++; allerIntro(); }
      } })
    ]);
  }
  function terminerPartie() {
    arreterChrono();
    var r = stats.records, avant = r.parties, score = Math.max(0, etat.score);
    etat.final = { score: score, chaineMax: etat.chaineMax, nouveaux: { sprint: etat.sprintRecord } };
    if (avant > 0 && score > r.score) etat.final.nouveaux.score = true;
    if (avant > 0 && etat.chaineMax > r.serie) etat.final.nouveaux.serie = true;
    if (score > r.score) r.score = score;
    if (etat.chaineMax > r.serie) r.serie = etat.chaineMax;
    r.parties = avant + 1;
    sauverStats();
    etat.ecran = "fin";
    signaler("fin", { score: score, meilleureSerie: etat.chaineMax });
    rendre(true);
  }
  function vueFin() {
    var f = etat.final, nv = f.nouveaux;
    var cartes = manches.filter(function (mm) { return etat.bilans[mm]; }).map(function (mm) {
      var b = etat.bilans[mm];
      return el("li", { class: "qc-carte-manche" }, [el("p", { class: "qc-carte-titre", text: NOMS[mm] }), el("p", { text: resumeManche(b) })]);
    });
    /* fiche mémo : ce qui a été manqué d'abord */
    var parQ = {}, ordre = [];
    etat.reponses.forEach(function (x) {
      var k = x.q.enonce;
      if (!parQ[k]) { parQ[k] = { q: x.q, ok: x.ok }; ordre.push(k); } else parQ[k].ok = x.ok;
    });
    var items = ordre.map(function (k) { return parQ[k]; });
    var memo = items.filter(function (x) { return !x.ok; }).concat(items.filter(function (x) { return x.ok; })).map(function (x) {
      var bonne = x.q.rep.filter(function (r) { return r.bonne; })[0];
      return el("li", { class: "qz-memo-item" }, [
        el("span", { class: "qz-memo-marque " + (x.ok ? "qz-ok" : "qz-ko"), text: x.ok ? "✓" : "✗", title: x.ok ? "Réussie" : "À revoir" }),
        el("div", {}, [el("p", { class: "qz-memo-q", text: x.q.enonce }), el("p", { class: "qz-memo-r" }, [el("strong", { text: bonne.texte })]), x.q.infoCle ? el("p", { class: "qz-memo-info", text: x.q.infoCle }) : null])
      ]);
    });
    var tr = etat.bilans.trouve;
    if (tr) {
      tr.details.slice().sort(function (a, b) { return (a.ok ? 1 : 0) - (b.ok ? 1 : 0); }).forEach(function (d) {
        memo.push(el("li", { class: "qz-memo-item" }, [
          el("span", { class: "qz-memo-marque " + (d.ok ? "qz-ok" : "qz-ko"), text: d.ok ? "✓" : "✗", title: d.ok ? "Trouvé" : "À revoir" }),
          el("div", {}, [el("p", { class: "qz-memo-q", text: "Concept : " + d.t.indices[3] }), el("p", { class: "qz-memo-r" }, [el("strong", { text: d.t.reponse })]), d.t.infoCle ? el("p", { class: "qz-memo-info", text: d.t.infoCle }) : null])
        ]));
      });
    }
    return el("div", { class: "qz-fin" }, [
      boutonSon(),
      logo("qz-logo-grand"),
      el("p", { class: "qz-etiquette", text: "Partie terminée" }),
      el("h1", { class: "qz-gain-final", text: pluriel(f.score, "point", "points") }),
      nv.score ? el("p", { class: "qc-record", text: "Nouveau record de score !" }) : null,
      el("p", { class: "qz-score", text: "Meilleure série de la partie : " + f.chaineMax + (nv.serie ? " · nouveau record !" : "") }),
      meta.messageFin ? el("p", { class: "qz-accroche", text: meta.messageFin }) : null,
      el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: "Rejouer", onclick: function () { nouvellePartie(); rendre(true); } }),
      el("ul", { class: "qc-cartes" }, cartes),
      blocRecords(),
      blocMaitrise("Maîtrise par thème"),
      memo.length ? el("section", { class: "qz-memo" }, [el("h2", { text: "Fiche mémo" }), el("ol", {}, memo)]) : null
    ]);
  }

  /* ---------- affichage ---------- */
  function rendre(focaliser) {
    chronoEl = null;
    var vue = etat.ecran === "intro" ? vueIntro() : etat.ecran === "qcm" ? vueQcm() : etat.ecran === "trouve" ? vueTrouve()
      : etat.ecran === "bilan" ? vueBilan() : etat.ecran === "fin" ? vueFin() : vueAccueil();
    while (racine.firstChild) racine.removeChild(racine.firstChild);
    racine.appendChild(el("div", { class: "qz-cadre" }, [vue]));
    racine.scrollTop = 0;
    if (focaliser) {
      var cible = racine.querySelector("[data-focus]") || racine;
      try { cible.focus({ preventScroll: true }); } catch (e) {}
    }
  }
  function touche(ev) {
    if (!etat || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var k = String(ev.key || "").toLowerCase(), idx = "abcd".indexOf(k);
    if (idx < 0) idx = "1234".indexOf(k);
    if (k.length !== 1 || idx < 0) return;
    if (etat.ecran === "qcm" && !etat.q.valide && idx < etat.q.ordre.length) repondre(idx);
    else if (etat.ecran === "trouve" && etat.t.phase === "choix" && idx < etat.t.ordre.length) repondreTrouve(idx);
  }
  var ecouteur = options.touchesGlobales ? doc : racine;
  ecouteur.addEventListener("keydown", touche);

  /* ---------- départ (aperçu de l'éditeur : on saute directement à un écran) ---------- */
  function simulerFin() {
    var qs = pool.slice(0, 6);
    etat.reponses = qs.map(function (q, i) { return { q: q, ok: i % 3 !== 2, manche: "sprint" }; });
    manches.forEach(function (mm) {
      if (mm === "sprint") etat.bilans.sprint = { type: "sprint", reussie: true, points: objectif, nbQ: 11, temps: 74 };
      else if (mm === "serie") etat.bilans.serie = { type: "serie", theme: themesSerie()[0], reussie: false, best: Math.max(1, longueur - 1), points: 3, nbQ: serieMax };
      else etat.bilans.trouve = { type: "trouve", points: 5, details: trouves.slice(0, 3).map(function (t, i) { return { t: t, ok: i !== 1, pts: i !== 1 ? 3 : -penalite, k: 1 }; }) };
    });
    etat.score = 27; etat.chaineMax = 5;
    etat.final = { score: 27, chaineMax: 5, nouveaux: { score: true } };
    etat.ecran = "fin";
  }
  nouvellePartie();
  var dep = options.depart && options.depart.ecran;
  if (dep === "fin" && manches.length) simulerFin();
  else if ((dep === "sprint" || dep === "serie" || dep === "trouve") && dispo[dep]) {
    etat.im = Math.max(0, manches.indexOf(dep));
    lancerManche(dep, dep === "serie" ? themesSerie()[0] : undefined);
  }
  rendre(!!options.autoFocus);

  return { detruire: function () { arreterChrono(); moteur.arreter(); ecouteur.removeEventListener("keydown", touche); } };
}

const CHAMPION_CSS = `
.qc-accueil{max-width:760px}
.qc-score{flex:none;font-variant-numeric:tabular-nums;font-weight:700;color:var(--accent)}
.qc-colonne{display:flex;flex-direction:column;gap:16px;max-width:820px;width:100%}
.qc-suivi{display:flex;flex-direction:column;gap:8px}
.qc-suivi-texte{font-size:14px;color:var(--doux);font-variant-numeric:tabular-nums}
.qc-niveau{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
.qc-barre-objectif{height:10px;border-radius:99px;background:color-mix(in srgb,var(--texte) 14%,transparent);overflow:hidden}
.qc-barre-objectif>i{display:block;height:100%;border-radius:99px;background:var(--accent);transition:width .3s}
.qc-pastilles{display:flex;gap:10px}
.qc-pastille{width:26px;height:26px;border-radius:50%;border:2px solid var(--trait);transition:background .2s,border-color .2s}
.qc-plein{background:var(--accent);border-color:var(--accent)}
.qc-msg-manche{font-weight:700}
.qc-record{display:inline-block;padding:4px 12px;border-radius:99px;background:var(--accent);color:var(--sur-accent);font-weight:700;font-size:14px}

.qc-indices{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px}
.qc-indice{display:grid;grid-template-columns:84px minmax(0,1fr) auto;gap:12px;align-items:baseline;background:var(--carte);border-radius:var(--rayon);padding:12px 14px;border:2px solid transparent}
.qc-verrou{opacity:.42}
.qc-courant{border-color:var(--accent)}
.qc-indice-n{font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--accent)}
.qc-indice-pts{font-size:13px;color:var(--doux);font-variant-numeric:tabular-nums;white-space:nowrap}
.qc-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.qc-buzz{font-size:20px;letter-spacing:.04em;padding:14px 30px}
.qc-enjeu{flex:1 1 220px}
.qc-choix{display:flex;flex-direction:column;gap:12px}

.qc-themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;width:100%}
.qc-theme{font:inherit;color:var(--texte);text-align:left;background:var(--carte);border:2px solid transparent;border-radius:var(--rayon);padding:14px;display:flex;flex-direction:column;gap:4px;cursor:pointer}
.qc-theme:hover{border-color:var(--accent)}
.qc-theme-titre{font-weight:700;font-size:17px}
.qc-theme-info{font-size:13.5px;color:var(--doux)}

.qc-bloc{width:100%;display:flex;flex-direction:column;gap:12px}
.qc-bloc h2{font-size:20px}
.qc-tuiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.qc-tuile{background:var(--carte);border-radius:var(--rayon);padding:12px 14px}
.qc-tuile-val{font-size:26px;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums;line-height:1.1}
.qc-tuile-lib{font-size:13px;color:var(--doux)}
.qc-themes-liste{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px}
.qc-theme-ligne{display:grid;grid-template-columns:minmax(90px,200px) minmax(0,1fr) 48px;gap:12px;align-items:center}
.qc-theme-nom{font-weight:600;overflow-wrap:anywhere}
.qc-barre-theme{height:10px;border-radius:99px;background:color-mix(in srgb,var(--texte) 14%,transparent);overflow:hidden}
.qc-barre-theme>i{display:block;height:100%;border-radius:99px;background:var(--accent)}
.qc-theme-pct{font-variant-numeric:tabular-nums;text-align:right;color:var(--doux)}
.qc-a-revoir{background:var(--carte);border-left:4px solid var(--accent);padding:10px 14px;border-radius:calc(var(--rayon) / 2)}
.qc-cartes{list-style:none;padding:0;width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}
.qc-carte-manche{background:var(--carte);border-radius:var(--rayon);padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.qc-carte-titre{font-weight:700;color:var(--accent)}
@container (max-width:520px){
  .qc-indice{grid-template-columns:minmax(0,1fr) auto}
  .qc-indice-n{grid-column:1 / -1}
  .qc-theme-ligne{grid-template-columns:minmax(70px,120px) minmax(0,1fr) 44px}
}
`;
