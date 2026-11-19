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
