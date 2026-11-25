#!/usr/bin/env python3
"""Vérifie la cohérence de la documentation de l'assistant.
  - taille du prompt système (limite de Copilot : 8 000 caractères)
  - chaque référence [CODE-n] pointe vers une section qui existe
  - chaque fichier de connaissance a son numéro de version
  - les fichiers cités dans le prompt existent
Usage : python3 assistant/verifier.py   (code de sortie 1 s'il y a une erreur)"""
import pathlib, re, sys

ici = pathlib.Path(__file__).parent
erreurs, avis = [], []

# 1. prompt
prompt = (ici / "prompt-systeme.md").read_text(encoding="utf-8")
corps = prompt.split("DÉBUT", 1)[1].strip()
n = len(corps)
print("prompt système : %s caractères (limite Copilot : 8 000)" % format(n, ",").replace(",", " "))
if n > 8000:
    erreurs.append("le prompt dépasse 8 000 caractères")
elif n > 6800:
    avis.append("le prompt dépasse 6 800 caractères : peu de marge si l'outil ajoute ses propres consignes")

# 2. sections définies et références
connaissances = sorted((ici / "connaissances").glob("*.md"))
definies = {}
for f in connaissances:
    t = f.read_text(encoding="utf-8")
    if not re.search(r"^Version \d", t, re.M):
        erreurs.append("%s : ligne « Version … » manquante" % f.name)
    for m in re.finditer(r"^##\s+\[([A-Z]+-\d+)\]\s+(.+)$", t, re.M):
        if m.group(1) in definies:
            erreurs.append("code défini deux fois : [%s]" % m.group(1))
        definies[m.group(1)] = f.name

def references(texte):
    out = set()
    for m in re.finditer(r"\[([A-Z]+-\d+)\]", texte):
        out.add(m.group(1))
    return out

utilisees = set()
sources = [("prompt-systeme.md", corps)] + [(f.name, f.read_text(encoding="utf-8")) for f in connaissances]
sources += [("a-completer.md", (ici / "a-completer.md").read_text(encoding="utf-8"))]
for nom, texte in sources:
    # les définitions elles-mêmes ne comptent pas comme des références
    sans_titres = re.sub(r"^##\s+\[[A-Z]+-\d+\].*$", "", texte, flags=re.M)
    refs = references(sans_titres)
    utilisees |= refs
    for r in sorted(refs):
        if r not in definies:
            erreurs.append("%s : référence à [%s], section introuvable" % (nom, r))

# plages « [CONS-1] à [CONS-9] » : toutes les sections intermédiaires doivent exister
for nom, texte in sources:
    for m in re.finditer(r"\[([A-Z]+)-(\d+)\] à \[\1-(\d+)\]", texte):
        for i in range(int(m.group(2)), int(m.group(3)) + 1):
            if "%s-%d" % (m.group(1), i) not in definies:
                erreurs.append("%s : la plage [%s-%s] à [%s-%s] contient [%s-%d] qui n'existe pas" % (nom, m.group(1), m.group(2), m.group(1), m.group(3), m.group(1), i))
            utilisees.add("%s-%d" % (m.group(1), i))

jamais = sorted(c for c in set(definies) - utilisees if not c.startswith("IDX-"))
if jamais:
    avis.append("sections jamais citées (ni dans l'index ni ailleurs) : " + ", ".join("[%s]" % c for c in jamais))

# 3. fichiers cités dans le prompt
for nom in re.findall(r"\b(0\d-[a-z\-]+)\b", corps):
    if not any(f.name.startswith(nom) for f in connaissances):
        erreurs.append("prompt : fichier « %s » introuvable" % nom)

print("%d sections définies dans %d fichiers" % (len(definies), len(connaissances)))
for a in avis:
    print("AVIS   :", a)
for e in erreurs:
    print("ERREUR :", e)
print("OK : aucune erreur" if not erreurs else "%d erreur(s)" % len(erreurs))
sys.exit(1 if erreurs else 0)
