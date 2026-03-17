#!/usr/bin/env python3
"""Valide les conventions de balises <head> pour tous les fichiers HTML racine."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


class HeadConventionParser(HTMLParser):
    """Collecte les métadonnées nécessaires à la validation des conventions."""

    def __init__(self) -> None:
        super().__init__()
        self.has_theme_color = False
        self.has_shortcut_icon = False
        self.has_apple_touch_icon = False
        self.has_manifest = False
        self.has_favicon_png = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag_name = tag.lower()
        attrs_dict = {name.lower(): (value or "") for name, value in attrs}

        if tag_name == "meta" and attrs_dict.get("name", "").lower() == "theme-color":
            self.has_theme_color = True
            return

        if tag_name != "link":
            return

        rel_tokens = {token.lower() for token in attrs_dict.get("rel", "").split()}
        href = attrs_dict.get("href", "")
        href_path = urlsplit(href).path

        if "icon" in rel_tokens and href_path == "assets/favicon.png":
            self.has_favicon_png = True
        if "shortcut" in rel_tokens and "icon" in rel_tokens:
            self.has_shortcut_icon = True
        if "apple-touch-icon" in rel_tokens:
            self.has_apple_touch_icon = True
        if "manifest" in rel_tokens:
            self.has_manifest = True


EXPECTED_CHECKS = {
    "rel=\"icon\" vers assets/favicon.png": lambda parser: parser.has_favicon_png,
    "rel=\"shortcut icon\"": lambda parser: parser.has_shortcut_icon,
    "rel=\"apple-touch-icon\"": lambda parser: parser.has_apple_touch_icon,
    "meta name=\"theme-color\"": lambda parser: parser.has_theme_color,
    "rel=\"manifest\"": lambda parser: parser.has_manifest,
}


def validate_file(html_file: Path) -> list[str]:
    parser = HeadConventionParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    parser.close()

    return [
        f"{html_file.name}: {label} manquant"
        for label, check in EXPECTED_CHECKS.items()
        if not check(parser)
    ]


def main() -> int:
    errors: list[str] = []
    html_files = sorted(Path(".").glob("*.html"))

    for html_file in html_files:
        errors.extend(validate_file(html_file))

    if errors:
        print("ERREURS DE CONVENTION <head>:")
        print("\n".join(errors))
        return 1

    print(f"OK: conventions <head> validées pour {len(html_files)} fichier(s) HTML.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
