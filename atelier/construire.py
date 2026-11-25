#!/usr/bin/env python3
"""Assemble l'atelier : modèle (atelier.src.html) + code des jeux (src/) + sons (sons/).

Usage :
  python3 atelier/construire.py                    construit atelier/atelier-jeux.html (AVEC sons, versionné)
                                                   et atelier/dist/atelier-artefact.html (fragment publié comme artefact Claude)
  python3 atelier/construire.py --sans-sons        idem, sans aucun son embarqué
  python3 atelier/construire.py --sortie CHEMIN    écrit uniquement la page complète à CHEMIN (publication GitHub Pages)
Les options se combinent. Les durées des sons sont lues avec ffprobe, ou à défaut dans sons/durees.json."""
import argparse, base64, json, pathlib, re, subprocess

ici = pathlib.Path(__file__).parent
ap = argparse.ArgumentParser(description="Assemble l'atelier de jeux.")
ap.add_argument("--sans-sons", action="store_true", help="n'embarque aucun son")
ap.add_argument("--sortie", help="écrit uniquement la page complète à ce chemin")
args = ap.parse_args()

def remplacer(t, debut, fin, contenu):
    motif = re.compile(re.escape(debut) + r".*?" + re.escape(fin), re.S)
    t2, n = motif.subn(lambda m: debut + "\n" + contenu + "\n" + fin, t)
    assert n == 1, "marqueurs introuvables : " + debut
    return t2

fichier_durees = ici / "sons" / "durees.json"
durees = json.loads(fichier_durees.read_text(encoding="utf-8")) if fichier_durees.exists() else {}

def duree(f):
    try:
        d = round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]).decode().strip()), 1)
        durees[f.name] = d
        return d
    except Exception:
        return durees.get(f.name)

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

SANS_SONS = "var SONS_DEFAUT = {};\nvar SONS_QPUC = {};"
ENTETE = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
          '<style>:root{color-scheme:light}html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
          '</head>\n<body>\n')

modele = (ici / "atelier.src.html").read_text(encoding="utf-8")
code = (ici / "src" / "commun.js").read_text(encoding="utf-8") + "\n" + (ici / "src" / "champion.js").read_text(encoding="utf-8")
assert "</script" not in code

if args.sans_sons:
    sons, manquants = SANS_SONS, []
else:
    sons, manquants = sons_js()
    if manquants:
        print("ATTENTION, sons absents de sons/ :", ", ".join(manquants))

t = remplacer(modele, "/*SONS_DEBUT*/", "/*SONS_FIN*/", sons)
t = remplacer(t, "/*MOTEURS_DEBUT*/", "/*MOTEURS_FIN*/", code)
page = ENTETE + t + "\n</body>\n</html>\n"
mode = "sans sons" if args.sans_sons else "avec sons"

if args.sortie:
    sortie = pathlib.Path(args.sortie)
    sortie.parent.mkdir(parents=True, exist_ok=True)
    sortie.write_text(page, encoding="utf-8")
    print("construit :", sortie, "(" + mode + ")")
else:
    (ici / "atelier-jeux.html").write_text(page, encoding="utf-8")
    dist = ici / "dist"
    dist.mkdir(exist_ok=True)
    (dist / "atelier-artefact.html").write_text(t, encoding="utf-8")
    print("construit :", ici / "atelier-jeux.html", "(" + mode + ") et", dist / "atelier-artefact.html")

if not args.sans_sons and durees:
    fichier_durees.write_text(json.dumps(durees, indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")
