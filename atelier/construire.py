#!/usr/bin/env python3
"""Assemble l'atelier : modèle (atelier.src.html) + code des jeux (src/) + sons (sons/) -> dist/.
Produit :
  dist/atelier-jeux.html      page complète, à ouvrir ou héberger (SharePoint, Posit Connect, bucket...)
  dist/atelier-artefact.html  fragment sans en-tête, tel que publié comme artefact Claude
Usage : python3 atelier/construire.py   (ffprobe est utilisé pour lire les durées des sons, s'il y en a)"""
import base64, json, pathlib, re, subprocess

ici = pathlib.Path(__file__).parent
dist = ici / "dist"
dist.mkdir(exist_ok=True)

def remplacer(t, debut, fin, contenu):
    motif = re.compile(re.escape(debut) + r".*?" + re.escape(fin), re.S)
    t2, n = motif.subn(lambda m: debut + "\n" + contenu + "\n" + fin, t)
    assert n == 1, "marqueurs introuvables : " + debut
    return t2

def duree(f):
    try:
        return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]).decode().strip()), 1)
    except Exception:
        return None

def sons_js():
    packs = json.loads((ici / "sons" / "packs.json").read_text(encoding="utf-8"))
    lignes, manquants = [], []
    for var, pistes in packs.items():
        if var.startswith("_"):
            continue
        out = {}
        for cle, nom in pistes.items():
            f = ici / "sons" / nom
            if not f.exists():
                manquants.append(nom)
                continue
            out[cle] = {"nom": nom, "duree": duree(f), "src": "data:audio/mpeg;base64," + base64.b64encode(f.read_bytes()).decode()}
        lignes.append("var " + var + " = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";")
    return "\n".join(lignes), manquants

t = (ici / "atelier.src.html").read_text(encoding="utf-8")
js, manquants = sons_js()
t = remplacer(t, "/*SONS_DEBUT*/", "/*SONS_FIN*/", js)
code = (ici / "src" / "commun.js").read_text(encoding="utf-8") + "\n" + (ici / "src" / "champion.js").read_text(encoding="utf-8")
assert "</script" not in code
t = remplacer(t, "/*MOTEURS_DEBUT*/", "/*MOTEURS_FIN*/", code)

(dist / "atelier-artefact.html").write_text(t, encoding="utf-8")
entete = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
          '<style>:root{color-scheme:light}html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
          '</head>\n<body>\n')
(dist / "atelier-jeux.html").write_text(entete + t + "\n</body>\n</html>\n", encoding="utf-8")
print("construit :", dist / "atelier-jeux.html", "et", dist / "atelier-artefact.html")
if manquants:
    print("sons absents (atelier sans pack par défaut pour eux) :", ", ".join(manquants))
