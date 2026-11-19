#!/usr/bin/env python3
"""Assemble l'atelier : modèle (atelier.src.html) + code des jeux (src/) + sons (sons/).
Produit :
  atelier/atelier-jeux.html             page complète SANS sons : versionnée, prête à ouvrir ou à héberger
  atelier/dist/atelier-jeux-avec-sons.html   page complète AVEC les sons de sons/ (non versionnée)
  atelier/dist/atelier-artefact.html    fragment sans en-tête, tel que publié comme artefact Claude (avec sons)
Usage : python3 atelier/construire.py   (ffprobe lit les durées des sons, s'il y en a)"""
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
    lignes, manquants, presents = [], [], 0
    for var, pistes in packs.items():
        if var.startswith("_"):
            continue
        out = {}
        for cle, nom in pistes.items():
            f = ici / "sons" / nom
            if not f.exists():
                manquants.append(nom)
                continue
            presents += 1
            out[cle] = {"nom": nom, "duree": duree(f), "src": "data:audio/mpeg;base64," + base64.b64encode(f.read_bytes()).decode()}
        lignes.append("var " + var + " = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";")
    return "\n".join(lignes), manquants, presents

SANS_SONS = "var SONS_DEFAUT = {};\nvar SONS_QPUC = {};"
ENTETE = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
          '<style>:root{color-scheme:light}html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
          '</head>\n<body>\n')

modele = (ici / "atelier.src.html").read_text(encoding="utf-8")
code = (ici / "src" / "commun.js").read_text(encoding="utf-8") + "\n" + (ici / "src" / "champion.js").read_text(encoding="utf-8")
assert "</script" not in code

def assembler(sons):
    t = remplacer(modele, "/*SONS_DEBUT*/", "/*SONS_FIN*/", sons)
    return remplacer(t, "/*MOTEURS_DEBUT*/", "/*MOTEURS_FIN*/", code)

def complet(fragment):
    return ENTETE + fragment + "\n</body>\n</html>\n"

# 1. version versionnée : jamais d'audio
(ici / "atelier-jeux.html").write_text(complet(assembler(SANS_SONS)), encoding="utf-8")
print("construit :", ici / "atelier-jeux.html", "(sans sons, versionné)")

# 2. versions avec sons, si les fichiers audio sont présents
js, manquants, presents = sons_js()
if presents:
    avec = assembler(js)
    (dist / "atelier-artefact.html").write_text(avec, encoding="utf-8")
    (dist / "atelier-jeux-avec-sons.html").write_text(complet(avec), encoding="utf-8")
    print("construit :", dist / "atelier-jeux-avec-sons.html", "et", dist / "atelier-artefact.html")
else:
    print("aucun fichier audio dans sons/ : seule la version sans sons a été construite")
if manquants:
    print("sons absents :", ", ".join(manquants))
