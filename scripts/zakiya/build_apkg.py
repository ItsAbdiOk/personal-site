"""Build one amgi-friendly .apkg per module for Zakiya's study guide.

Input:  JSON from scripts/zakiya/export-cards.ts (default .zakiya-anki/cards.json)
Output: public/zakiya/anki/<module file>.apkg

Run:    npm run zakiya:anki
        (or ~/.venvs/zakiya-anki/bin/python scripts/zakiya/build_apkg.py [cards.json] [out_dir])

amgi format rules this enforces:
  - deck name exactly 3 levels "ALevel::Physics::NN Topic", topic <= 25 chars
  - one Basic model (Front/Back only), minimal CSS (no display/position/visibility/@media)
  - Front <= 25 words, Back <= 40 words (HTML + source line stripped); fails listing offenders
  - only <b> <i> <u> <br> <hr> <img> <div> <p>; ^sup^ / ~sub~ become Unicode, never <sup>/<sub>
  - Back ends with <div class="src">Ch N · Textbook p. X</div>
  - stable IDs so re-importing updates cards in place and keeps review history:
      note GUID = genanki.guid_for("ALevel", "Physics", <topic>, <card id>)
      deck ID / model ID = derive_id(name) below, hard-coded in DECK_IDS / MODEL_ID.
    NEVER change these constants once a deck has shipped, or amgi will see a new deck/note type.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import sys
from pathlib import Path

import genanki

ROOT = Path(__file__).resolve().parents[2]

MAX_TOPIC_CHARS = 25
MAX_FRONT_WORDS = 25
MAX_BACK_WORDS = 40


def derive_id(name: str) -> int:
    """Deterministic 31-bit ID in [2^30, 2^31) from a name (sha1). Used to mint the constants below."""
    return (int(hashlib.sha1(name.encode()).hexdigest()[:8], 16) & 0x3FFFFFFF) + (1 << 30)


# Hard-coded so a rename of the derivation can never silently orphan review history.
MODEL_NAME = "ALevel Physics Basic (amgi)"
MODEL_ID = 1573241146  # derive_id(MODEL_NAME)
DECK_IDS = {
    "ALevel::Physics::03 Forces & Motion": 1721886526,  # derive_id(deck name)
}

CSS = (
    ".card { font-family: -apple-system, system-ui, sans-serif; font-size: 20px; "
    "text-align: center; color: black; background-color: white; }\n"
    ".src { font-size: 13px; color: #888; margin-top: 16px; }\n"
)

MODEL = genanki.Model(
    MODEL_ID,
    MODEL_NAME,
    fields=[{"name": "Front"}, {"name": "Back"}],
    templates=[
        {
            "name": "Card 1",
            "qfmt": "{{Front}}",
            "afmt": "{{FrontSide}}<hr id=answer>{{Back}}",
        }
    ],
    css=CSS,
)

SUP = dict(zip("0123456789+-−=()n", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁻⁼⁽⁾ⁿ"))
SUB = dict(zip("0123456789+-−=()xaeohklmnpst", "₀₁₂₃₄₅₆₇₈₉₊₋₋₌₍₎ₓₐₑₒₕₖₗₘₙₚₛₜ"))
ALLOWED_TAGS = {"b", "i", "u", "br", "hr", "img", "div", "p"}


class Ctx:
    def __init__(self, card_id: str):
        self.card_id = card_id
        self.fallbacks: list[str] = []


def plain(nodes: list[dict]) -> str:
    out = []
    for n in nodes:
        if n["t"] == "text":
            out.append(n["v"])
        elif n["t"] == "term":
            out.append(n["label"])
        else:
            out.append(plain(n["c"]))
    return "".join(out)


def scripted(text: str, table: dict[str, str], ctx: Ctx) -> str:
    if all(ch in table for ch in text):
        return "".join(table[ch] for ch in text)
    ctx.fallbacks.append(text)  # e.g. v~y~ -> "vy"
    return text


def to_html(nodes: list[dict], ctx: Ctx) -> str:
    out = []
    for n in nodes:
        t = n["t"]
        if t == "text":
            out.append(html.escape(n["v"], quote=False).replace("\r\n", "\n").replace("\n", "<br>"))
        elif t == "term":
            out.append(html.escape(n["label"], quote=False))
        elif t in ("b", "kw"):
            out.append(f"<b>{to_html(n['c'], ctx)}</b>")
        elif t == "i":
            out.append(f"<i>{to_html(n['c'], ctx)}</i>")
        elif t == "sup":
            out.append(html.escape(scripted(plain(n["c"]), SUP, ctx), quote=False))
        elif t == "sub":
            out.append(html.escape(scripted(plain(n["c"]), SUB, ctx), quote=False))
        else:
            raise ValueError(f"{ctx.card_id}: unknown Rich node type {t!r}")
    return "".join(out)


def word_count(field_html: str) -> int:
    text = html.unescape(re.sub(r"<[^>]+>", " ", field_html))
    return len(text.split())


def page_label(p: str) -> str:
    return f"Textbook pp. {p}" if re.search(r"[–\-,]", p) else f"Textbook p. {p}"


def source_line(card: dict, sub: dict) -> str:
    ch = sub["chapter"]["number"]
    if card["source"] == "spec-only":
        refs = list(dict.fromkeys(re.sub(r"\(.*?\)$", "", r) for r in sub["specRefs"]))
        where = f"Spec only ({', '.join(refs)})"
    else:
        where = page_label(card.get("page") or sub["textbookPages"])
    return f'<div class="src">Ch {ch} · {html.escape(where, quote=False)}</div>'


def check_html(field_html: str, where: str, errors: list[str]) -> None:
    for tag in re.findall(r"</?\s*([a-zA-Z0-9]+)", field_html):
        if tag.lower() not in ALLOWED_TAGS:
            errors.append(f"{where}: forbidden tag <{tag}>")


def build_module(mod: dict, out_dir: Path) -> tuple[int, list[str]]:
    deck_name, topic = mod["deck"], mod["topic"]
    assert deck_name.count("::") == 2, f"deck must have exactly 3 levels: {deck_name}"
    assert len(topic) <= MAX_TOPIC_CHARS, f"topic over {MAX_TOPIC_CHARS} chars: {topic!r}"
    deck_id = DECK_IDS.get(deck_name)
    if deck_id is None:
        sys.exit(
            f"No hard-coded deck ID for {deck_name!r}. Add to DECK_IDS in build_apkg.py:\n"
            f'    "{deck_name}": {derive_id(deck_name)},'
        )
    assert deck_id == derive_id(deck_name), f"DECK_IDS[{deck_name!r}] does not match derive_id"
    assert MODEL_ID == derive_id(MODEL_NAME)

    deck = genanki.Deck(deck_id, deck_name)
    media: list[str] = []
    errors: list[str] = []
    warnings: list[str] = []
    seen: set[str] = set()

    for sub in mod["subchapters"]:
        for card in sub["flashcards"]:
            cid = card["id"]
            if cid in seen:
                errors.append(f"{cid}: duplicate card id")
            seen.add(cid)
            ctx = Ctx(cid)
            front = to_html(card["frontNodes"], ctx)
            back_body = to_html(card["backNodes"], ctx)
            # Optional images (future): card["images"] = ["file.png", ...] living in public/zakiya/anki/media/.
            for img in card.get("images", []):
                path = ROOT / "public/zakiya/anki/media" / img
                if not path.is_file():
                    errors.append(f"{cid}: missing image {path}")
                media.append(str(path))
                back_body += f'<br><img src="{html.escape(Path(img).name)}">'
            back = back_body + source_line(card, sub)

            fw, bw = word_count(front), word_count(back_body)
            if fw > MAX_FRONT_WORDS:
                errors.append(f"{cid}: Front has {fw} words (max {MAX_FRONT_WORDS}): {plain(card['frontNodes'])}")
            if bw > MAX_BACK_WORDS:
                errors.append(f"{cid}: Back has {bw} words (max {MAX_BACK_WORDS}): {plain(card['backNodes'])}")
            check_html(front, f"{cid} Front", errors)
            check_html(back, f"{cid} Back", errors)
            if ctx.fallbacks:
                warnings.append(f"{cid}: no Unicode form, used plain text for {sorted(set(ctx.fallbacks))}")

            tags = [sub["number"], card["tag"]]
            deck.add_note(
                genanki.Note(
                    model=MODEL,
                    fields=[front, back],
                    guid=genanki.guid_for("ALevel", "Physics", topic, cid),
                    tags=[re.sub(r"\s+", "_", t) for t in tags],
                )
            )

    for w in warnings:
        print(f"  warning: {w}")
    if errors:
        print(f"\n{deck_name}: {len(errors)} problem(s), no .apkg written:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / mod["file"]
    genanki.Package(deck, media_files=media).write_to_file(str(out))
    print(f"build_apkg: {len(deck.notes)} notes → {out.relative_to(ROOT)}")
    return len(deck.notes), warnings


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / ".zakiya-anki/cards.json"
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "public/zakiya/anki"
    data = json.loads(src.read_text())
    for mod in data["modules"]:
        build_module(mod, out_dir)


if __name__ == "__main__":
    main()
