/* Briques communes à tous les jeux.
   Chaque fonction est autonome (aucune dépendance extérieure) : elle est recopiée telle quelle
   dans les jeux exportés, grâce à Function.prototype.toString(). */

/* Fabrique la fonction el(tag, attrs, enfants) qui crée un élément du DOM sans jamais interpréter de HTML. */
function fabriquerEl(doc) {
  return function el(tag, attrs, enfants) {
    var e = doc.createElement(tag), k;
    attrs = attrs || {};
    for (k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    (enfants || []).forEach(function (c) {
      if (c == null || c === false) return;
      e.appendChild(typeof c === "string" ? doc.createTextNode(c) : c);
    });
    return e;
  };
}

/* Applique l'identité visuelle (couleurs, police, arrondi, taille du logo) à la racine d'un jeu. */
function appliquerTheme(racine, theme) {
  theme = theme || {};
  var POLICES = {
    sans: 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    arrondie: 'ui-rounded,"SF Pro Rounded","Nunito","Varela Round","Trebuchet MS",Verdana,sans-serif',
    serif: 'Georgia,"Iowan Old Style","Palatino Linotype","Times New Roman",serif',
    mono: 'ui-monospace,"Cascadia Mono",Consolas,"Courier New",monospace',
    calibri: 'Calibri,Carlito,"Segoe UI",system-ui,sans-serif',
    centurygothic: '"Century Gothic",CenturyGothic,"URW Gothic","Avant Garde",Futura,"Trebuchet MS",sans-serif',
    arial: 'Arial,"Liberation Sans",Helvetica,sans-serif',
    verdana: 'Verdana,Geneva,"DejaVu Sans",sans-serif',
    tahoma: 'Tahoma,Geneva,Verdana,sans-serif',
    trebuchet: '"Trebuchet MS","Lucida Grande",Tahoma,sans-serif',
    segoe: '"Segoe UI",system-ui,Roboto,sans-serif',
    cambria: 'Cambria,Georgia,"Times New Roman",serif',
    georgia: 'Georgia,"Times New Roman",serif',
    garamond: 'Garamond,"EB Garamond","Times New Roman",serif',
    times: '"Times New Roman",Times,"Liberation Serif",serif',
    couriernew: '"Courier New",Courier,monospace'
  };
  function surCouleur(hex) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || "");
    if (!m) return "#ffffff";
    var l = [1, 2, 3].map(function (i) {
      var c = parseInt(m[i], 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2] > 0.4 ? "#14181d" : "#ffffff";
  }
  racine.className = "qz";
  racine.setAttribute("lang", "fr");
  racine.setAttribute("tabindex", "-1");
  var st = racine.style;
  st.setProperty("--fond", theme.fond || "#0E3B43");
  st.setProperty("--carte", theme.carte || "#14505B");
  st.setProperty("--texte", theme.texte || "#F4F7F5");
  st.setProperty("--accent", theme.accent || "#F5B841");
  st.setProperty("--sur-accent", surCouleur(theme.accent || "#F5B841"));
  st.setProperty("--rayon", (theme.arrondi != null ? Number(theme.arrondi) : 14) + "px");
  var pile = POLICES[theme.police] || POLICES.sans;
  if (theme.police === "perso" && String(theme.policePerso || "").replace(/["'\\;{}<>]/g, "").trim()) {
    pile = '"' + String(theme.policePerso).replace(/["'\\;{}<>]/g, "").trim() + '",' + POLICES.sans;
  }
  st.setProperty("--police", pile);
  st.setProperty("--logo-h", (Number(theme.logoHauteur) || 64) + "px");
}

/* Moteur de sons facultatifs. `pistes` : { cle: { src: "data:audio/..." } }, `volumePct` : 0 à 100.
   Les sons ne démarrent qu'après activer(true), appelé depuis un geste du joueur. */
function creerMoteurSons(pistes, volumePct) {
  pistes = pistes || {};
  var vol = Math.max(0, Math.min(1, (volumePct != null ? Number(volumePct) : 70) / 100));
  var audios = {}, actif = false, fondu = null;
  var cles = Object.keys(pistes).filter(function (k) { return pistes[k] && pistes[k].src; });

  function preparer() {
    cles.forEach(function (k) {
      if (audios[k]) return;
      try { var a = new Audio(pistes[k].src); a.preload = "auto"; audios[k] = a; } catch (e) {}
    });
  }
  function arreter() {
    if (fondu) { clearInterval(fondu); fondu = null; }
    cles.forEach(function (k) {
      var a = audios[k];
      if (!a) return;
      try { a.onended = null; a.pause(); a.currentTime = 0; a.volume = vol; } catch (e) {}
    });
  }
  /* Lance une piste (en coupant les autres). `auFin` est appelé à la fin, ou tout de suite s'il n'y a rien à jouer. */
  function jouer(cle, auFin) {
    var a = actif ? audios[cle] : null;
    arreter();
    if (!a) { if (auFin) auFin(); return; }
    var fini = false;
    function terminer() { if (fini) return; fini = true; a.onended = null; if (auFin) auFin(); }
    try {
      a.volume = vol; a.currentTime = 0; a.onended = terminer;
      var pr = a.play();
      if (pr && pr.catch) pr.catch(terminer);
    } catch (e) { terminer(); }
  }
  /* Coupe en douceur ce qui joue, sans bloquer l'écran. */
  function estomper(duree) {
    var jouant = cles.map(function (k) { return audios[k]; }).filter(function (a) { return a && !a.paused && !a.ended; });
    if (!jouant.length) return;
    if (fondu) clearInterval(fondu);
    var pas = 50, total = Math.max(1, Math.round(duree / pas)), i = 0;
    fondu = setInterval(function () {
      i++;
      if (i >= total) { arreter(); return; }
      jouant.forEach(function (a) { try { a.volume = Math.max(0, vol * (1 - i / total)); } catch (e) {} });
    }, pas);
  }
  return {
    disponible: cles.length > 0,
    preparer: preparer,
    activer: function (b) { actif = !!b; if (actif) preparer(); },
    actif: function () { return actif; },
    jouer: jouer,
    arreter: arreter,
    estomper: estomper
  };
}

/* Tableau des scores façon arcade. Le classement est gardé dans le navigateur du joueur (ce poste, ce navigateur).
   config : { actif, mode: "initiales" | "genere" | "libre", taille, motsInterdits: [] }
   cle : clé de stockage ; persistant : false pour ne rien écrire dans le navigateur (aperçu de l'éditeur). */
function creerTableauScores(config, cle, persistant) {
  config = config || {};
  var actif = config.actif === true; /* désactivé tant que l'auteur ne l'a pas demandé */
  var mode = config.mode === "libre" || config.mode === "genere" ? config.mode : "initiales";
  var taille = Math.max(3, Math.min(50, Math.round(Number(config.taille)) || 10));
  var stockOk = true, liste = [];

  /* Filtre de base : minuscules, sans accents, chiffres et symboles courants remplacés par leurs lettres, sans espaces ni ponctuation. */
  function simplifier(s) {
    s = String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    s = s.replace(/[@4]/g, "a").replace(/3/g, "e").replace(/[1!|]/g, "i").replace(/0/g, "o").replace(/[5$]/g, "s").replace(/7/g, "t");
    return s.replace(/[^a-z]/g, "");
  }
  /* Mots refusés seulement si le nom entier est ce mot (évite de refuser « Monique » ou « Constance »). */
  var EXACTS = ["con", "conne", "cons", "connes", "cul", "culs", "zob", "bite", "bites", "pute", "putes", "pd", "pede", "pedes", "pedo",
    "fdp", "ntm", "nique", "niquer", "kkk", "sex", "sexe", "nazi", "nazis", "dick", "cock", "cunt", "fuck", "shit", "slut", "whore",
    "bitch", "ptn", "tdc"].map(simplifier);
  /* Mots refusés partout dans le nom. */
  var CONTENUS = ["connard", "connasse", "salope", "salaud", "encule", "putain", "merde", "niquetamere", "filsdepute", "batard",
    "pedophile", "negre", "bougnoule", "youpin", "hitler", "fuck", "shit", "bitch", "asshole", "nigger", "nigga", "faggot", "enfoire",
    "branleur", "gouine", "tarlouze", "pouffiasse", "suceuse"].map(simplifier);
  var EXTRAS = (config.motsInterdits || []).map(simplifier).filter(Boolean);

  function nettoyer(brut) {
    var s = String(brut == null ? "" : brut).trim();
    if (mode === "initiales") return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    return s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9 _.\-]/g, "").replace(/\s+/g, " ").trim().slice(0, mode === "genere" ? 24 : 12);
  }
  function verifier(brut) {
    var nom = nettoyer(brut);
    if (mode === "initiales" ? nom.length !== 3 : nom.length < 2) {
      return { ok: false, raison: mode === "initiales" ? "Entrez exactement 3 lettres." : "Entrez au moins 2 caractères." };
    }
    var n = simplifier(nom), complet = simplifier(brut); /* on contrôle aussi la saisie avant troncature */
    var interdit = !n || EXACTS.indexOf(n) >= 0
      || CONTENUS.some(function (c) { return n.indexOf(c) >= 0 || complet.indexOf(c) >= 0; })
      || EXTRAS.some(function (e) { return e.length <= 3 ? n === e : (n.indexOf(e) >= 0 || complet.indexOf(e) >= 0); });
    if (interdit) return { ok: false, raison: "Ce nom n'est pas accepté. Choisissez-en un autre." };
    return { ok: true, nom: nom };
  }

  var ADJ = ["Fougueux", "Rusé", "Zen", "Malin", "Rapide", "Vaillant", "Curieux", "Joyeux", "Audacieux", "Futé",
    "Flamboyant", "Rêveur", "Costaud", "Sage", "Astucieux", "Intrépide", "Espiègle", "Radieux", "Têtu", "Gourmand"];
  var ANI = ["Panda", "Lynx", "Hibou", "Castor", "Renard", "Lama", "Koala", "Dauphin", "Faucon", "Blaireau",
    "Hérisson", "Pingouin", "Tigre", "Phoque", "Morse", "Lézard", "Bison", "Ours", "Cerf", "Loup"];
  function pseudoAuto() {
    return ANI[Math.floor(Math.random() * ANI.length)] + " " + ADJ[Math.floor(Math.random() * ADJ.length)];
  }

  function trier() {
    liste.sort(function (a, b) { return b.score - a.score || a.date - b.date; });
    liste = liste.slice(0, taille);
  }
  function charger() {
    if (!persistant) return;
    try {
      var t = window.localStorage.getItem(cle);
      if (t) {
        var a = JSON.parse(t);
        if (Array.isArray(a)) liste = a.filter(function (x) { return x && typeof x.nom === "string" && isFinite(x.score); });
      }
    } catch (e) { stockOk = false; }
  }
  function sauver() {
    if (!persistant) return;
    try { window.localStorage.setItem(cle, JSON.stringify(liste)); } catch (e) { stockOk = false; }
  }
  charger();
  trier();

  return {
    actif: actif, mode: mode, taille: taille, persistant: !!persistant,
    stockOk: function () { return stockOk; },
    lire: function () { return liste.slice(); },
    qualifie: function (score) {
      score = Number(score);
      return actif && score > 0 && (liste.length < taille || score > liste[liste.length - 1].score);
    },
    verifier: verifier,
    pseudoAuto: pseudoAuto,
    enregistrer: function (nom, score) {
      var e = { nom: nom, score: Number(score), date: Date.now() };
      liste.push(e); trier(); sauver();
      return liste.indexOf(e) + 1;
    },
    effacer: function () { liste = []; sauver(); }
  };
}

/* Affiche le tableau des scores (et le formulaire de saisie du nom en fin de partie).
   opts : { score (nombre, en fin de partie), format(score), etat ({fait, rang, nom, pseudo}, conservé par le jeu),
            rerendre(), compact (écran d'accueil : les 5 premiers, sans formulaire) } */
function vueTableauScores(el, tableau, opts) {
  opts = opts || {};
  if (!tableau || !tableau.actif) return null;
  var etat = opts.etat || { fait: true, rang: 0, nom: "", pseudo: "" };
  var format = opts.format || function (s) { return String(s); };
  var liste = tableau.lire();
  var compact = !!opts.compact;
  if (compact && !liste.length) return null;
  var enjeu = opts.score != null && !etat.fait;
  var blocs = [el("h2", { text: compact ? "Meilleurs scores" : "Tableau des scores" })];

  function formulaire() {
    var erreur = el("p", { class: "qz-erreur", role: "alert", text: "" });
    erreur.hidden = true;
    function valider(valeur) {
      var r = tableau.verifier(valeur);
      if (!r.ok) { erreur.textContent = r.raison; erreur.hidden = false; return; }
      etat.rang = tableau.enregistrer(r.nom, opts.score); etat.nom = r.nom; etat.fait = true;
      opts.rerendre();
    }
    function passer() { etat.fait = true; etat.rang = 0; opts.rerendre(); }
    var initiales = tableau.mode === "initiales";
    var boutons, champ;
    if (tableau.mode === "genere") {
      if (!etat.pseudo) etat.pseudo = tableau.pseudoAuto();
      boutons = [
        el("button", { class: "qz-btn qz-principal", type: "button", "data-focus": "1", text: "Enregistrer mon score", onclick: function () { valider(etat.pseudo); } }),
        el("button", { class: "qz-btn", type: "button", text: "Un autre pseudo", onclick: function () { etat.pseudo = tableau.pseudoAuto(); opts.rerendre(); } }),
        el("button", { class: "qz-btn qz-discret", type: "button", text: "Passer", onclick: passer })
      ];
      return el("div", { class: "qz-scores-form" }, [
        el("p", { class: "qz-doux", text: "Nouveau score : " + format(opts.score) + ". Votre pseudo :" }),
        el("p", { class: "qz-pseudo", text: etat.pseudo }),
        el("div", { class: "qz-scores-ligne" }, boutons)
      ]);
    }
    champ = el("input", {
      class: initiales ? "qz-nom-saisie" : "qz-nom-libre", id: "qz-nom-saisie", type: "text",
      maxlength: initiales ? "3" : "12", autocomplete: "off", spellcheck: "false", "data-focus": "1",
      placeholder: initiales ? "AAA" : "Votre pseudo"
    });
    champ.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); valider(champ.value); } });
    if (initiales) {
      champ.addEventListener("input", function () {
        champ.value = champ.value.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
      });
    }
    return el("div", { class: "qz-scores-form" }, [
      el("label", { class: "qz-doux", for: "qz-nom-saisie", text: "Nouveau score : " + format(opts.score) + ". " + (initiales ? "Entrez vos 3 initiales :" : "Entrez votre pseudo :") }),
      el("div", { class: "qz-scores-ligne" }, [
        champ,
        el("button", { class: "qz-btn qz-principal", type: "button", text: "Enregistrer mon score", onclick: function () { valider(champ.value); } }),
        el("button", { class: "qz-btn qz-discret", type: "button", text: "Passer", onclick: passer })
      ]),
      erreur
    ]);
  }

  if (enjeu && tableau.qualifie(opts.score)) blocs.push(formulaire());
  else if (enjeu && opts.score > 0) blocs.push(el("p", { class: "qz-doux", text: "Votre score (" + format(opts.score) + ") n'entre pas dans le tableau cette fois." }));

  if (liste.length) {
    var affiches = compact ? liste.slice(0, 5) : liste;
    blocs.push(el("ol", { class: "qz-scores-liste" }, affiches.map(function (e, i) {
      var moi = etat.fait && etat.rang === i + 1 && etat.nom === e.nom;
      return el("li", { class: "qz-scores-li" + (moi ? " qz-score-moi" : "") }, [
        el("span", { class: "qz-rang", text: (i + 1) + "." }),
        el("span", { class: "qz-nom", text: e.nom }),
        el("span", { class: "qz-pts", text: format(e.score) })
      ]);
    })));
  } else blocs.push(el("p", { class: "qz-doux", text: "Aucun score pour l'instant : soyez le premier !" }));

  if (tableau.persistant && !tableau.stockOk()) {
    blocs.push(el("p", { class: "qz-doux", text: "Les scores ne sont pas conservés dans ce contexte de lecture : ils disparaîtront à la fermeture." }));
  } else if (!tableau.persistant) {
    blocs.push(el("p", { class: "qz-doux", text: "Aperçu : les scores ne sont pas conservés." }));
  }
  if (!compact && liste.length) {
    var effacer = el("button", { class: "qz-btn qz-discret", type: "button", text: "Effacer les scores de ce poste" });
    effacer.addEventListener("click", function () {
      if (effacer.getAttribute("data-confirme") !== "1") {
        effacer.setAttribute("data-confirme", "1"); effacer.textContent = "Confirmer l'effacement";
        setTimeout(function () { effacer.removeAttribute("data-confirme"); effacer.textContent = "Effacer les scores de ce poste"; }, 4000);
        return;
      }
      tableau.effacer(); etat.rang = 0;
      if (opts.rerendre) opts.rerendre();
    });
    blocs.push(effacer);
  }
  return el("section", { class: "qz-scores" }, blocs);
}
