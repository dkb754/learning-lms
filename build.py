#!/usr/bin/env python3
"""Wrap src/app.html (artifact-style body content) into a standalone index.html.

The Artifact publisher supplies its own <!doctype>/<head>/<body> skeleton, so
src/app.html holds only page content. This script rebuilds the skeleton so the
same file also works as a plain local page or on GitHub Pages.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).parent
src = (ROOT / "src" / "app.html").read_text()

if "<!--HEAD-->" not in src or "<!--/HEAD-->" not in src:
    sys.exit("src/app.html is missing its <!--HEAD--> / <!--/HEAD--> markers")

head = src.split("<!--HEAD-->", 1)[1].split("<!--/HEAD-->", 1)[0].strip()
body = src.split("<!--/HEAD-->", 1)[1].strip()

out = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="An adaptive reading and math tutor built for Adam.">
<meta name="theme-color" content="#2C63F0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Build Mode">
{head}
</head>
<body>
{body}
</body>
</html>
"""
(ROOT / "index.html").write_text(out)
print(f"built index.html ({len(out):,} bytes)")
