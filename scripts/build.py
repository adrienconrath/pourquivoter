import argparse
import csv
import html
import re
import shutil
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path
from urllib.parse import quote, urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DIST = ROOT / "dist"
escape = html.escape


def rows(file, columns):
    columns = columns.split()
    with (DATA / f"{file}.tsv").open(encoding="utf-8", newline="") as stream:
        for line, row in enumerate(csv.reader(stream, delimiter="|", quoting=csv.QUOTE_NONE), 1):
            if not row or row[0].startswith("#"):
                continue
            if len(row) != len(columns):
                raise ValueError(f"{file}:{line} · {len(columns)} colonnes attendues")
            yield dict(zip(columns, (value.strip() for value in row)))


def indexed(records):
    result = {}
    for record in records:
        key = record["id"]
        if not re.fullmatch(r"[a-z0-9-]+", key) or key in result:
            raise ValueError(f"Identifiant invalide ou dupliqué : {key}")
        result[key] = record
    return result


def https(url):
    parsed = urlsplit(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError(f"URL HTTPS attendue : {url}")
    return escape(url)


def link(url, label, css=""):
    return f'<a class="{css}" href="{https(url)}">{escape(label)} <span aria-hidden="true">↗</span></a>'


def source_refs(refs):
    ids = refs.split(",")
    if not all(key in sources for key in ids) or len(set(ids)) != len(ids):
        raise ValueError(f"Références invalides : {refs}")
    return ids


def claim(value, refs):
    ids = source_refs(refs)
    preview = "".join(
        f'<li>{link(sources[key]["url"], sources[key]["title"])}'
        f'<small>{escape(sources[key]["kind"])}</small></li>' for key in ids
    )
    return (
        f'<div class="claim" data-sources="{escape(" ".join(ids))}">{escape(value)} '
        f'<details class="citation"><summary aria-label="Afficher les sources de cette affirmation">'
        f'<span aria-hidden="true">↗</span></summary>'
        f'<div class="citation-panel"><strong>Sources de cette affirmation</strong><ul>{preview}</ul></div>'
        f'</details></div>'
    )


def age(birthday, snapshot):
    born = date.fromisoformat(birthday)
    return snapshot.year - born.year - ((snapshot.month, snapshot.day) < (born.month, born.day))


def portrait(person):
    image = portraits[person["id"]]
    return (
        f'<span class="portrait"><img src="assets/portraits/{person["id"]}.webp" '
        f'alt="" width="240" height="300" loading="lazy" data-credit="{https(image["url"])}"></span>'
    )


def word_date(day):
    months = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre".split()
    return f"{day.day} {months[day.month - 1]} {day.year}"


def profile(person, snapshot):
    key, name = person["id"], person["name"]
    image = portraits[key]
    profiles_links = link(sources[f"bio-{key}"]["url"], "Wikipédia")
    for field, label in (("campaign", "Campagne"), ("party_url", "Parti")):
        if person[field]:
            profiles_links += link(person[field], label)
    return f'''
      <article class="profile" id="profil-{key}">
        {portrait(person)}
        <div class="profile-body"><h3>{escape(name)}</h3>
        {claim(f'{person["party"]} · {age(person["birth"], snapshot)} ans', f"bio-{key}")}
        <div class="status">{claim(person["status"], person["status_refs"])}</div>
        <div class="bio">{claim(person["bio"], f"bio-{key}")}</div>
        <div class="profile-links">{profiles_links}</div>
        <small class="credit">{link(image["url"], image["credit"])} · {link(image["license"], "Licence")} · adapté (WebP, cadrage et niveaux de gris).</small></div>
      </article>'''


def comparison(theme, people, entries):
    key = theme["id"]
    cards = []
    for person in people.values():
        person_key = person["id"]
        fields = entries.get((key, person_key), {})
        if fields:
            content = [f'<span class="evidence">{escape(fields["mesure"]["kind"])}</span>']
            for field, label in (("orientation", "Orientation"), ("mesure", "Proposition"), ("financement", "Chiffrage et financement"), ("critique", "Critiques et limites")):
                value = fields.get(field)
                if value:
                    body = claim(value["text"], value["refs"])
                elif field == "financement":
                    body = '<p class="missing">Chiffrage ou financement non établi dans les sources citées ici.</p>'
                elif field == "critique":
                    body = '<p class="missing">Critique documentée à compléter.</p>'
                else:
                    continue
                content.append(f'<div class="position-field"><h5>{label}</h5>{body}</div>')
        else:
            content = ['<p class="missing">Position à documenter pour cette édition.</p>']
        cards.append(f'''
          <article class="position" data-person="{person_key}"{" data-empty" if not fields else ""}>
            <div class="position-person">{portrait(person)}<div>
              <h4><a href="#profil-{person_key}">{escape(person["name"])}</a></h4>
              {claim(person["party"], f"bio-{person_key}")}
            </div></div><div class="position-content">{"".join(content)}</div>
          </article>''')
    count = sum((key, person) in entries for person in people)
    return f'''
        <section class="theme-panel" id="theme-{key}" data-theme="{key}">
          <header class="theme-heading">
            <div><h3>{escape(theme["name"])}</h3><p>{escape(theme["question"])}</p></div>
            <span class="coverage">{count}/{len(people)} documentées</span>
          </header>
          <div class="positions">{"".join(cards)}</div>
        </section>'''


def validate():
    people = indexed(rows("profils", "id name party birth bio status status_refs campaign party_url"))
    themes = indexed(rows("themes", "id group name question"))
    all_sources = indexed(rows("sources", "id title kind url"))
    images = indexed(rows("portraits", "id url credit license"))
    if set(people) != set(images):
        raise ValueError("Chaque profil doit avoir exactement un portrait.")
    for record in images.values():
        https(record["url"])
        https(record["license"])
        if not record["credit"] or not (ROOT / "web/assets/portraits" / f'{record["id"]}.webp').is_file():
            raise ValueError(f'Portrait ou crédit manquant : {record["id"]}')
    for person in people.values():
        key = person["id"]
        all_sources[f"bio-{key}"] = dict(
            title=f'Wikipédia · {person["name"]}', kind="Biographie",
            url="https://fr.wikipedia.org/wiki/" + quote(person["name"].replace(" ", "_"))
        )
        date.fromisoformat(person["birth"])
        for field in ("campaign", "party_url"):
            if person[field]:
                https(person[field])
        if not set(person["status_refs"].split(",")) <= all_sources.keys():
            raise ValueError(f"Source du statut manquante : {key}")
    for source in all_sources.values():
        https(source["url"])
    entries = defaultdict(dict)
    for record in rows("positions", "theme person field kind refs text"):
        theme, key, field = (record[name] for name in ("theme", "person", "field"))
        pair = theme, key
        if (theme not in themes or key not in people
                or field not in {"orientation", "mesure", "financement", "critique"}
                or field in entries[pair] or not record["text"] or not record["kind"]):
            raise ValueError(f"Position invalide ou dupliquée : {pair}, {field}")
        if not set(record["refs"].split(",")) <= all_sources.keys():
            raise ValueError(f'Source inconnue : {record["refs"]}')
        entries[pair][field] = record
    if any("mesure" not in values for values in entries.values()):
        raise ValueError("Chaque position documentée doit avoir une proposition ou une déclaration.")
    return people, themes, all_sources, images, entries


def build(snapshot, generated):
    groups = defaultdict(list)
    for theme in themes.values():
        groups[theme["group"]].append(theme)
    filters = "".join(
        f'<fieldset><legend>{escape(group)}</legend><div class="theme-options">' +
        "".join(f'<label><input type="checkbox" name="theme" value="{t["id"]}"><span>{escape(t["name"])}</span></label>' for t in options) +
        '</div></fieldset>' for group, options in groups.items()
    )
    people_filters = "".join(
        f'<label><input type="checkbox" name="person" value="{p["id"]}" checked><span>{escape(p["name"])}</span></label>'
        for p in people.values()
    )
    timeline = "".join(
        f'<a href="#profil-{p["id"]}" aria-label="Profil de {escape(p["name"])}">{portrait(p)}</a>'
        for p in people.values()
    )
    body = (ROOT / "web/index.html").read_text(encoding="utf-8")
    replacements = dict(
        themes=len(themes), people=len(people), entries=len(entries), timeline=timeline,
        profiles="".join(profile(p, snapshot) for p in people.values()),
        theme_filters=filters, people_filters=people_filters,
        comparisons="".join(comparison(t, people, entries) for t in themes.values()),
        snapshot=f'<time datetime="{snapshot}">{word_date(snapshot)}</time>',
        generated=f'<time datetime="{generated}">{word_date(generated)}</time>',
        law=claim("Le Conseil constitutionnel doit publier la liste officielle au plus tard le 26 mars 2027. Cette édition suit une sélection de personnalités.", "loi,calendrier"),
        directory="".join(
            f'<li id="source-{key}">{link(s["url"], s["title"])} <small>{escape(s["kind"])}</small></li>'
            for key, s in sorted(sources.items(), key=lambda item: item[1]["title"].casefold())
        ),
    )
    DIST.mkdir(exist_ok=True)
    shutil.copytree(ROOT / "web/assets", DIST / "assets", dirs_exist_ok=True)
    (DIST / "index.html").write_text(re.sub(r"\{\{(\w+)\}\}", lambda m: str(replacements[m[1]]), body), encoding="utf-8")
    (DIST / ".nojekyll").touch()
    print(f"{len(people)} profils · {len(themes)} thèmes · {len(entries)} comparaisons documentées · {len(sources)} sources")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    people, themes, sources, portraits, entries = validate()
    snapshot = date.fromisoformat((DATA / "edition.txt").read_text().strip())
    if not args.check:
        build(snapshot, datetime.now(ZoneInfo("Europe/Paris")).date())
