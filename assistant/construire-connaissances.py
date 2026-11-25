#!/usr/bin/env python3
"""Prépare les fichiers à charger dans l'outil IA du client.
Copilot Studio accepte les fichiers de connaissance en Word, Excel, PowerPoint ou PDF, pas en Markdown :
ce script convertit chaque fichier de connaissances en .docx (avec pandoc) et extrait le prompt en texte brut.
Résultat dans assistant/dist/ (non versionné).
Usage : python3 assistant/construire-connaissances.py"""
import pathlib, shutil, subprocess, sys

ici = pathlib.Path(__file__).parent
dist = ici / "dist"
if dist.exists():
    shutil.rmtree(dist)
(dist / "connaissances").mkdir(parents=True)

if not shutil.which("pandoc"):
    sys.exit("pandoc est nécessaire (https://pandoc.org). Sans lui, chargez les fichiers .md tels quels si l'outil les accepte.")

for md in sorted((ici / "connaissances").glob("*.md")):
    sortie = dist / "connaissances" / (md.stem + ".docx")
    subprocess.run(["pandoc", "-f", "gfm", "-t", "docx", "-o", str(sortie), str(md)], check=True)
    print("converti :", sortie.name)

prompt = (ici / "prompt-systeme.md").read_text(encoding="utf-8").split("DÉBUT", 1)[1].strip() + "\n"
(dist / "prompt-systeme.txt").write_text(prompt, encoding="utf-8")
print("prompt   :", dist / "prompt-systeme.txt", "(%d caractères)" % len(prompt.strip()))
