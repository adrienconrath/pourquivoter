"""Relever les lacunes de chaque case, sans confondre longueur et qualité."""

from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def rows(name):
    path = DATA / name
    if not path.exists():
        return []
    return [line.split("|") for line in path.read_text().splitlines()
            if line.strip() and not line.startswith("#")]


positions = defaultdict(list)
for row in rows("positions.tsv"):
    positions[tuple(row[:2])].append(row)
baseline = {tuple(row[:2]): row[2] for row in rows("audit-couverture.tsv")}
reviews = {tuple(row[:2]): row[3] for row in rows("recherches.tsv")}
lines = [
    "# Longueur indicative : ne prouve ni exhaustivité ni exactitude.",
    "# theme|personne|mots_avant|mots_actuels|blocs|sources_distinctes|critiques|financement|priorite|recherche_revue",
]
for theme, *_ in rows("themes.tsv"):
    for person, *_ in rows("profils.tsv"):
        records = positions[theme, person]
        words = sum(len(row[5].split()) for row in records)
        refs = {ref for row in records for ref in row[4].split(",")}
        priority = ("vide" if words == 0 else "insuffisant" if words < 250
                    else "a_approfondir" if words < 600 else "controle_qualitatif")
        lines.append("|".join(map(str, [
            theme, person, baseline.get((theme, person), words), words,
            len(records), len(refs), sum(row[2] == "critique" for row in records),
            sum(row[2] == "financement" for row in records), priority,
            reviews.get((theme, person), "non"),
        ])))
(DATA / "audit-couverture.tsv").write_text("\n".join(lines) + "\n")
print(f"Audit : {len(lines) - 2} cases.")
