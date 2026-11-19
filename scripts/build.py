import argparse
import csv
import html
import re
import shutil
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path
from urllib.parse import quote, urlencode, urlsplit
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


def link(url, label, css="", new_tab=False):
    target = ' target="_blank" rel="noopener"' if new_tab else ""
    return f'<a class="{css}" href="{https(url)}"{target}>{escape(label)} <span aria-hidden="true">↗</span></a>'


FEEDBACK_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSdJ8TTWXc0CcGk3QchQV5xLydFQVMMD1mpEcRChM1pi3uA52g/viewform"
FEEDBACK_CANDIDAT = "entry.372906600"
FEEDBACK_THEME = "entry.428480985"


def feedback_url(person, theme):
    # Les libellés doivent correspondre exactement aux choix du formulaire.
    candidat = f'{person["name"]} — {person["party"]}'
    params = urlencode({FEEDBACK_CANDIDAT: candidat, FEEDBACK_THEME: theme["name"]})
    return f"{FEEDBACK_FORM}?usp=pp_url&{params}"


def source_refs(refs):
    ids = refs.split(",")
    if not all(key in sources for key in ids) or len(set(ids)) != len(ids):
        raise ValueError(f"Références invalides : {refs}")
    return ids


def claim(value, refs):
    ids = source_refs(refs)
    return (
        f'<div class="claim" data-sources="{escape(" ".join(ids))}">{escape(value)}</div>'
    )


def source_section(refs, extra=""):
    ids = list(dict.fromkeys(refs))
    for key in ids:
        source_refs(key)
    items = "".join(
        f'<li data-source-id="{key}">{link(sources[key]["url"], sources[key]["title"])}'
        f'<small>{escape(sources[key]["kind"])}</small></li>' for key in ids
    )
    return (
        '<details class="disclosure position-sources"><summary>Sources'
        f'<span class="source-count">{len(ids) + bool(extra)}</span></summary>'
        f'<ol class="source-list">{items}{extra}</ol></details>'
    )


def age(birthday, snapshot):
    born = date.fromisoformat(birthday)
    return snapshot.year - born.year - ((snapshot.month, snapshot.day) < (born.month, born.day))


def portrait(person, assets="assets"):
    image = portraits[person["id"]]
    return (
        f'<span class="portrait"><img src="{assets}/portraits/{person["id"]}.webp" '
        f'alt="" width="240" height="300" loading="lazy" data-credit="{https(image["url"])}"></span>'
    )


def word_date(day):
    months = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre".split()
    return f"{day.day} {months[day.month - 1]} {day.year}"


def profile(person, snapshot):
    key, name = person["id"], person["name"]
    image = portraits[key]
    profiles_links = ""
    credit = (
        '<li class="portrait-credit">'
        f'Photo : {link(image["url"], image["credit"])} · {link(image["license"], "Licence")}'
        '<small>Portrait recadré au format WebP.</small></li>'
    )
    for field, label in (("campaign", "Campagne"), ("party_url", "Parti")):
        if person[field]:
            profiles_links += link(person[field], label)
    return f'''
      <article class="profile">
        <div class="profile-image">{portrait(person, "../assets")}</div>
        <div class="profile-body"><h1>{escape(name)}</h1>
        {claim(f'{person["party"]} · {age(person["birth"], snapshot)} ans', f"bio-{key}")}
        <div class="status">{claim(person["status"], person["status_refs"])}</div>
        <div class="bio">{claim(person["bio"], f"bio-{key}")}</div>
        <div class="profile-links">{profiles_links}</div>
        <div class="profile-note">{claim("La liste officielle des candidatures doit être publiée au plus tard le 26 mars 2027. Cette édition présente une sélection de personnalités.", "loi,calendrier")}</div>
        {source_section([f"bio-{key}", *person["status_refs"].split(","), "loi", "calendrier"], credit)}
        </div>
      </article>'''


POSITION_FIELDS = (
    ("orientation", "Orientation"),
    ("explication", "En clair"),
    ("mesure", "Mesures et mise en œuvre"),
    ("financement", "Chiffrage et financement"),
    ("critique", "Critiques, réponses et points à vérifier"),
)

def position_field(field, label, records):
    if records:
        body = "".join(
            f'<li><span class="evidence">{escape(record["kind"])}</span>'
            f'{claim(record["text"], record["refs"])}</li>'
            for record in records
        )
        body = f'<ul class="position-notes">{body}</ul>'
    else:
        return ""
    return f'<section class="position-field position-{field}"><h5>{label}</h5>{body}</section>'


def comparison(theme, people, entries):
    key = theme["id"]
    cards = []
    for person in people.values():
        person_key = person["id"]
        fields = entries.get((key, person_key))
        if fields:
            summary = fields["resume"]
            intro = "".join(claim(record["text"], record["refs"]) for record in summary)
            measures = sorted(
                (record for field in ("orientation", "mesure", "explication")
                 for record in fields.get(field, [])),
                key=lambda record: record["sequence"],
            )
            details = (
                position_field("mesure", "Mesures", measures)
                + position_field("financement", "Financement", fields.get("financement", []))
                + position_field("critique", "Points à vérifier", fields.get("critique", []))
            )
            refs = [f"bio-{person_key}", *(
                ref for records in fields.values() for record in records
                for ref in record["refs"].split(",")
            )]
            content = (
                f'<div class="position-summary">{intro}</div>'
                '<details class="disclosure position-details"><summary>Détails</summary>'
                f'<div class="details-content">{details}</div></details>'
                + source_section(refs)
            )
        else:
            content = '<p class="missing">Position à documenter pour cette édition.</p>'
        feedback = (
            f'<p class="position-feedback">'
            f'{link(feedback_url(person, theme), "Donner du feedback", new_tab=True)}</p>'
        )
        cards.append(f"""
          <article class="position" id="position-{key}-{person_key}" data-person="{person_key}" aria-label="{escape(person["name"])} · {escape(theme["name"])}"{" data-empty" if not fields else ""}>
            <div class="position-person">{portrait(person)}<div>
              <h4>{escape(person["name"])}</h4>
              {claim(person["party"], f"bio-{person_key}")}
            </div></div>
            <div class="position-content">{content}{feedback}</div>
          </article>""")
    return f'''
        <section class="theme-panel" id="theme-{key}" data-theme="{key}">
          <header class="theme-heading">
            <div><h3>{escape(theme["name"])}</h3><p>{escape(theme["question"])}</p></div>
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
    entries = defaultdict(lambda: defaultdict(list))
    seen = set()
    valid_fields = {"resume", *(field for field, _ in POSITION_FIELDS)}
    for sequence, record in enumerate(rows("positions", "theme person field kind refs text")):
        record["sequence"] = sequence
        theme, key, field = (record[name] for name in ("theme", "person", "field"))
        pair = theme, key
        claim_key = (theme, key, field, record["text"])
        if (theme not in themes or key not in people or field not in valid_fields
                or claim_key in seen or not record["text"] or not record["kind"]):
            raise ValueError(f"Position invalide ou dupliquée : {pair}, {field}")
        if not set(record["refs"].split(",")) <= all_sources.keys():
            raise ValueError(f'Source inconnue : {record["refs"]}')
        if field == "resume" and len(record["text"].split()) >= 100:
            raise ValueError(f"Résumé de moins de 100 mots attendu : {pair}")
        seen.add(claim_key)
        entries[pair][field].append(record)
    if any("mesure" not in values for values in entries.values()):
        raise ValueError("Chaque position documentée doit avoir une proposition ou une déclaration.")
    expected_pairs = {(theme, person) for theme in themes for person in people}
    if set(entries) != expected_pairs:
        raise ValueError("Chaque candidat doit avoir une fiche pour chaque thème.")
    if any(len(values.get("resume", [])) != 1 for values in entries.values()):
        raise ValueError("Chaque position doit avoir un seul résumé.")
    return people, themes, all_sources, images, entries


def build(snapshot, generated):
    groups = defaultdict(list)
    for theme in themes.values():
        groups[theme["group"]].append(theme)
    filters = "".join(
        f'<section class="theme-stack"><h3>{escape(group)}</h3><div class="theme-options">' +
        "".join(
            f'<button type="button" data-theme-toggle="{t["id"]}" aria-pressed="false">'
            f'{escape(t["name"])}</button>' for t in options
        ) + '</div></section>' for group, options in groups.items()
    )
    candidate_picker = "".join(
        f'<button type="button" class="candidate-choice" data-person="{p["id"]}" aria-pressed="false" '
        f'aria-label="Comparer {escape(p["name"])}" title="{escape(p["name"])}">{portrait(p)}'
        '<span class="choice-mark" aria-hidden="true">✓</span></button>'
        for p in people.values()
    )
    column_headers = "".join(
        f'<div class="column-header" data-person="{p["id"]}">{portrait(p)}'
        f'<span class="column-ident"><strong>{escape(p["name"])}</strong>'
        f'<small>{escape(p["party"])}</small></span>'
        f'<button type="button" class="column-close" data-close-person="{p["id"]}" '
        f'aria-label="Retirer {escape(p["name"])} de la comparaison" '
        f'title="Retirer {escape(p["name"])} de la comparaison"><span aria-hidden="true">×</span></button></div>'
        for p in people.values()
    )
    timeline = "".join(
        f'<a href="profils/{p["id"]}.html" aria-label="Profil de {escape(p["name"])}">{portrait(p)}</a>'
        for p in people.values()
    )
    body = (ROOT / "web/index.html").read_text(encoding="utf-8")
    replacements = dict(
        timeline=timeline, candidate_count=str(len(people)),
        theme_filters=filters, column_headers=column_headers, candidate_picker=candidate_picker,
        comparisons="".join(comparison(t, people, entries) for t in themes.values()),
        snapshot=f'<time datetime="{snapshot}">{word_date(snapshot)}</time>',
        generated=f'<time datetime="{generated}">{word_date(generated)}</time>',
    )
    DIST.mkdir(exist_ok=True)
    shutil.rmtree(DIST / "assets", ignore_errors=True)
    shutil.copytree(ROOT / "web/assets", DIST / "assets")
    def render(template, values):
        return re.sub(r"\{\{(\w+)\}\}", lambda match: values[match[1]], template)

    (DIST / "index.html").write_text(render(body, replacements), encoding="utf-8")
    profile_template = (ROOT / "web/profile.html").read_text(encoding="utf-8")
    profile_dir = DIST / "profils"
    profile_dir.mkdir(exist_ok=True)
    for previous_page in profile_dir.glob("*.html"):
        if previous_page.stem not in people:
            previous_page.unlink()
    for person in people.values():
        page = render(profile_template, dict(
            name=escape(person["name"]),
            id=person["id"],
            profile=profile(person, snapshot),
            generated=replacements["generated"],
        ))
        (profile_dir / f'{person["id"]}.html').write_text(page, encoding="utf-8")
    (DIST / ".nojekyll").touch()
    notes = sum(len(records) for fields in entries.values() for records in fields.values())
    analyses = sum(len(fields.get("critique", [])) for fields in entries.values())
    print(
        f"{len(people)} profils · {len(themes)} thèmes · {len(entries)} comparaisons documentées · "
        f"{notes} notes, dont {analyses} points critiques · {len(sources)} sources"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    people, themes, sources, portraits, entries = validate()
    snapshot = date.fromisoformat((DATA / "edition.txt").read_text().strip())
    if not args.check:
        build(snapshot, datetime.now(ZoneInfo("Europe/Paris")).date())
