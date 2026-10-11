#!/usr/bin/env python3
"""Reads the `needs` JSON from $NEEDS, prints a pass/fail table (also appended to the Actions summary) and exits 1 unless
every job succeeded."""
import json, os, sys
needs = json.loads(os.environ["NEEDS"])
rows = [(name, info["result"]) for name, info in needs.items()]
ok = all(result == "success" for _, result in rows)
md = "## " + ("✅ All automated tests passed: safe to merge" if ok else "❌ Not ready to merge: a test job did not pass") + "\n\n| Job | Result |\n|---|:-:|\n"
for name, result in rows:
    md += "| %s | %s |\n" % (name, "✅ pass" if result == "success" else "❌ " + result)
print(md)
if os.environ.get("GITHUB_STEP_SUMMARY"):
    with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as f:
        f.write(md + "\n")
sys.exit(0 if ok else 1)
