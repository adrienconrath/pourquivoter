"""Génère la version Markdown du comparateur pour les agents IA.

Appelé par scripts/build.py à chaque build : écrit dist/markdown/<candidat>/<theme>.md
(un fichier par candidature et par thème, sans lien depuis les pages du site) et dist/llms.txt qui les référence.
Peut aussi tourner seul : python3 scripts/export_markdown.py.
"""

import shutil
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from build import DATA, DIST, ROOT, validate, word_date

SITE = "https://pourquivoter.fyi"


def md_link(title, url):
    title = title.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]")
    return f"[{title}](<{url}>)"


def case_sections(fields):
    measures = sorted(
        (record for field in ("orientation", "mesure", "explication")
         for record in fields.get(field, [])),
        key=lambda record: record["sequence"],
    )
    sections = [
        ("Résumé", fields.get("resume", []), False),
        ("Mesures", measures, True),
        ("Financement", fields.get("financement", []), True),
        ("Points à vérifier", fields.get("critique", []), True),
    ]
    return [(title, records, bullets) for title, records, bullets in sections if records]


def render_case(person, theme, fields, sources, snapshot):
    ref_order = []
    for _title, records, _bullets in case_sections(fields):
        for record in records:
            for ref in record["refs"].split(","):
                if ref not in ref_order:
                    ref_order.append(ref)
    number = {ref: index + 1 for index, ref in enumerate(ref_order)}

    def cite(record):
        return "".join(f" [{number[ref]}]" for ref in record["refs"].split(","))

    lines = [
        f"# {person['name']} — {theme['name']}",
        "",
        f"- Candidat : {person['name']} ({person['party']})",
        f"- Thème : {theme['name']} ({theme['group']})",
        f"- Édition : {word_date(snapshot)}",
        f"- Profil : {md_link(person['name'], f'{SITE}/profils/{person['id']}.html')}",
        f"- Comparateur : {md_link('voir cette case sur le site', f'{SITE}/#position-{theme['id']}-{person['id']}')}",
        "",
    ]
    for title, records, bullets in case_sections(fields):
        lines += [f"## {title}", ""]
        for record in records:
            text = f"{record['text']}{cite(record)}"
            lines.append(f"- **{record['kind']}.** {text}" if bullets else text)
            if not bullets:
                lines.append("")
        if bullets:
            lines.append("")
    lines += ["## Sources", ""]
    for ref in ref_order:
        source = sources[ref]
        lines.append(f"{number[ref]}. {md_link(source['title'], source['url'])} — {source['kind']}")
    lines.append("")
    return "\n".join(lines)


def render_llms_txt(people, themes, snapshot):
    lines = [
        "# Pour qui voter ?",
        "",
        "> Comparateur indépendant des propositions pour la présidentielle française de 2027. "
        "Chaque affirmation est sourcée ; les sources sont listées avec leurs liens.",
        "",
        f"Édition : {word_date(snapshot)}.",
        "",
        "Les fichiers ci-dessous sont la version texte du comparateur, destinée aux agents IA. "
        "Ils ne sont pas liés depuis les pages du site.",
        "",
        f"- [Comparer les propositions]({SITE}/#comparer)",
        "",
    ]
    for person in people.values():
        lines += [f"## {person['name']} ({person['party']})", ""]
        lines.append(f"- Profil : {md_link(person['name'], f'{SITE}/profils/{person['id']}.html')}")
        for theme in themes.values():
            lines.append(f"- [{theme['name']}]({SITE}/markdown/{person['id']}/{theme['id']}.md)")
        lines.append("")
    return "\n".join(lines)


def export(dist=DIST):
    people, themes, sources, _portraits, entries = validate()
    snapshot = date.fromisoformat((DATA / "edition.txt").read_text().strip())
    dist.mkdir(exist_ok=True)
    md_dir = dist / "markdown"
    if md_dir.exists():
        shutil.rmtree(md_dir)
    for person in people.values():
        person_dir = md_dir / person["id"]
        person_dir.mkdir(parents=True)
        for theme in themes.values():
            fields = entries[(theme["id"], person["id"])]
            (person_dir / f"{theme['id']}.md").write_text(
                render_case(person, theme, fields, sources, snapshot), encoding="utf-8-sig"
            )
    # BOM UTF-8 : les .txt/.md sont servis sans charset, le BOM force la détection.
    (dist / "llms.txt").write_text(render_llms_txt(people, themes, snapshot), encoding="utf-8-sig")
    count = len(people) * len(themes)
    print(f"{count} fichiers Markdown + llms.txt dans {dist.relative_to(ROOT)}/")


if __name__ == "__main__":
    export()
