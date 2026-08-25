#!/usr/bin/env python3
"""Build dist/ — the deployable site — from src/app.html.

The Artifact publisher supplies its own <!doctype>/<head>/<body> skeleton, so
src/app.html holds page content only. This script rebuilds that skeleton and
adds the bits that only mean something on a real domain: the web app manifest
and the icons that let it install to a home screen.

    python3 build.py        # writes dist/index.html and dist/manifest.json
    python3 icons.py        # regenerates dist/*.png (rarely needed)
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"
src = (ROOT / "src" / "app.html").read_text()

if "<!--HEAD-->" not in src or "<!--/HEAD-->" not in src:
    sys.exit("src/app.html is missing its <!--HEAD--> / <!--/HEAD--> markers")

head = src.split("<!--HEAD-->", 1)[1].split("<!--/HEAD-->", 1)[0].strip()
body = src.split("<!--/HEAD-->", 1)[1].strip()

DIST.mkdir(exist_ok=True)

MANIFEST = {
    "name": "Adam's Build Mode",
    "short_name": "Build Mode",
    "description": "Reading comprehension and multiplication & division, adapted to how Adam answers.",
    "start_url": "./",
    "scope": "./",
    "display": "standalone",
    "orientation": "portrait",
    "background_color": "#EDF1F7",
    "theme_color": "#2C63F0",
    "icons": [
        {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
        {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
    ],
}
(DIST / "manifest.json").write_text(json.dumps(MANIFEST, indent=2) + "\n")

page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="An adaptive reading and math tutor built for Adam.">
<meta name="theme-color" content="#2C63F0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D1320" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Build Mode">
<meta name="mobile-web-app-capable" content="yes">
{head}
</head>
<body>
{body}
</body>
</html>
"""
(DIST / "index.html").write_text(page)

missing = [n for n in ("icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png")
           if not (DIST / n).exists()]
if missing:
    print(f"  ! icons missing ({', '.join(missing)}) — run: python3 icons.py")

print(f"built dist/index.html   ({len(page):,} bytes)")
print(f"built dist/manifest.json")
